---
title: "Writing a Linux Kernel Driver From Scratch as a Sophomore"
date: "2025-01-20"
excerpt: "The D-Link DWA-131 rev H1 USB WiFi adapter had no Linux support. I reverse-engineered the chip, wrote a kernel driver in C, and submitted it upstream."
tags: ["C", "Linux Kernel", "USB", "WiFi"]
---

## The Setup

I had a D-Link DWA-131 rev H1 USB WiFi adapter and a Linux laptop. The adapter didn't work. Not "doesn't work great" — completely unrecognized. `lsusb` showed the device, `dmesg` showed nothing useful.

A quick search confirmed what I suspected: no one had written a Linux driver for this specific revision of the chip. The H1 uses a different chipset from the earlier revisions that do have support.

So I wrote one.

## Understanding USB Device Drivers

I started by reading the Linux kernel driver documentation and a lot of the `rtl8188eu` driver source (a similar Realtek chip). The basics of a USB network driver are:

1. **Match your device** — register a USB device ID table with your vendor ID and product ID
2. **Bind on plug** — implement `probe()` which the kernel calls when a matching device appears
3. **Set up the network interface** — create a `net_device`, implement `ndo_open`, `ndo_stop`, `ndo_start_xmit`
4. **Handle USB transfers** — use URBs (USB Request Blocks) for async TX/RX
5. **Clean up** — implement `disconnect()` for when the device is unplugged

The hardest part wasn't the USB plumbing. It was understanding the chip's firmware initialization sequence.

## Reverse Engineering the Initialization Sequence

The DWA-131 H1 uses a Realtek RTL8192EU chipset. Realtek provides out-of-tree drivers for Windows, and there's a semi-functional Android driver floating around. Neither was designed for clean upstreaming.

I spent a few evenings with Wireshark's USBPCap on a Windows VM, capturing the exact sequence of control transfers that the official Windows driver sends on device connect. This gave me the initialization sequence: which registers to write, in what order, with what values.

From there I could implement `rtl8192eu_init_device()` in C.

## The actual driver

The driver registers a `usb_driver` struct:

```c
static struct usb_driver rtl8192eu_driver = {
    .name       = "rtl8192eu",
    .id_table   = rtl8192eu_id_table,
    .probe      = rtl8192eu_probe,
    .disconnect = rtl8192eu_disconnect,
    .suspend    = rtl8192eu_suspend,
    .resume     = rtl8192eu_resume,
};
```

On probe, it allocates a `net_device`, sets up the private data structure, initializes the chipset firmware, and registers the net device with the kernel. TX/RX use async URBs submitted to the USB core.

The trickiest part was power management. The H1 chip has a hardware power save mode that requires a specific heartbeat sequence to keep the radio awake. Getting that wrong means the device silently stops responding after a few minutes.

## Submitting Upstream

After the driver worked reliably for a week on my laptop, I cleaned up the code, added proper kernel-style comments, and submitted it to the `linux-wireless` mailing list.

The review process involved a few rounds of feedback — mostly style issues and one real bug I'd missed in the error path of `probe()`. After two revisions, it was accepted.

Seeing `git log --oneline drivers/net/wireless/realtek/` and finding my commit in there is a feeling I'll remember for a while.

## What It Took

About three weeks of evenings. I didn't know C well at the start of this — I knew Python and JavaScript. The kernel's coding style, the subsystem APIs, the build system (Kconfig/Kbuild) — all new.

The single most useful thing I did was read existing drivers in the same family and understand *why* they were written the way they were, rather than just copying patterns blindly.

If you have a device that doesn't work on Linux, it might just need someone willing to dig in.
