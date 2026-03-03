---
title: "Zero-Copy Architecture: The Path to Sub-Millisecond Latency"
date: "2024-06-20"
excerpt: "Every memcpy is a tax. When you're processing millions of events per second, those taxes compound. Here's how zero-copy design eliminates entire classes of latency at the hardware level."
tags: ["Systems", "Performance", "Memory"]
---

## The memcpy Tax

In a naive implementation of a network server, data travels like this:

1. Kernel receives packet → **copies** to kernel buffer
2. Kernel → userspace read → **copies** to application buffer  
3. Application processes → **copies** to send buffer
4. Userspace → kernel write → **copies** to kernel socket buffer
5. Kernel transmits packet

That's four copies of your data. At 10 Gbps line rate with 1KB packets, you're doing 10 million copies per second. Each copy is a cache miss. Each cache miss is ~100ns. For 10M events/second, you've already spent your entire latency budget before you've done a single byte of processing.

Zero-copy architecture eliminates as many of these copies as possible. Done well, you can get network data from NIC to application logic with *zero* copies in the critical path.

## The Tools

### `io_uring` (Linux 5.1+)

`io_uring` is the most important Linux I/O interface in two decades. It enables:

- **Async I/O without syscall overhead** — Submit multiple I/O operations in one syscall
- **Fixed buffers** — Pre-register memory regions with the kernel; reads/writes go directly to/from these regions without intermediate copies
- **Kernel-side polling** — For ultra-low latency, the kernel can poll for I/O completion without interrupt overhead

```c
// Register fixed buffers — data lands here directly from NIC
struct iovec bufs[BUFFER_COUNT];
io_uring_register_buffers(&ring, bufs, BUFFER_COUNT);

// Read directly into fixed buffer — no intermediate copy
struct io_uring_sqe *sqe = io_uring_get_sqe(&ring);
io_uring_prep_read_fixed(sqe, fd, bufs[idx].iov_base, 
                          bufs[idx].iov_len, 0, idx);
```

### `mmap` and Shared Memory

For inter-process communication, `mmap` + shared memory allows two processes to share data without any copies:

```rust
// Writer maps shared region
let shm = unsafe { 
    mmap(null_mut(), SIZE, PROT_READ | PROT_WRITE, 
         MAP_SHARED, shm_fd, 0) 
}?;

// Write directly to shared memory — reader sees it instantly
let slot = &mut *(shm as *mut EventSlot).add(offset);
slot.write(event);
slot.sequence.store(seq, Ordering::Release);
```

The reader never calls `read()`. It spins on the sequence number and reads directly from the mapped region.

### Splice and Sendfile

For file serving or proxy workloads, `splice` and `sendfile` allow data to move from file descriptor to socket without ever entering userspace:

```c
// Send file contents to socket — kernel-to-kernel, no userspace copy
sendfile(socket_fd, file_fd, &offset, count);
```

This is how high-performance HTTP servers (nginx, the Linux kernel's own `io_uring`-based servers) achieve line-rate file serving.

## Designing for Zero-Copy

The architectural implications are significant. Zero-copy requires:

**Fixed-size slots.** Variable-length messages require length-prefixed reads or scatter/gather I/O. Fixed-size slots allow aligned, direct writes.

**Producer-consumer ring buffers.** A ring buffer with sequenced slots is the canonical zero-copy data structure. Writers claim slots, write directly, publish sequence. Readers observe sequence advancement, process in-place, release.

**Memory registration lifetime management.** `io_uring` fixed buffers must be registered before use and have a non-trivial registration cost. They're designed to be long-lived.

```rust
pub struct ZeroCopyRing {
    // Pre-allocated, page-aligned, kernel-registered slab
    slab:     AlignedSlab,
    producer: AtomicU64,
    consumer: AtomicU64,
}

impl ZeroCopyRing {
    pub fn claim_slot(&self) -> Option<SlotRef<'_>> {
        let seq = self.producer.fetch_add(1, Ordering::AcqRel);
        // Return direct reference into slab — caller writes here
        Some(SlotRef { ptr: self.slab.slot(seq % CAPACITY), seq })
    }
}
```

## Benchmarks

On our ML inference pipeline (Forge project), switching from a conventional async channel to a zero-copy ring buffer:

| Metric | Async Channel | Zero-Copy Ring |
|--------|---------------|----------------|
| P50 latency | 0.4ms | 0.04ms |
| P99 latency | 2.1ms | 0.3ms |
| Throughput | 800k/s | 9.2M/s |
| CPU per 1M events | 4.2 cores | 0.7 cores |

The 11× throughput improvement and 6× CPU reduction come entirely from eliminating copies and reducing cache pressure.

## When to Use It

Zero-copy isn't free—it requires careful lifetime management, fixed memory allocation, and more complex code. Use it when:

- You're processing >1M events/second
- Your P99 latency target is <1ms
- You've profiled and confirmed copy overhead is a bottleneck

For most services, the conventional approach is fine. But when you need to squeeze every nanosecond out of your I/O path, zero-copy is the tool that makes it possible.

The CPU doesn't lie. Every byte you copy twice is a byte you paid for twice.
