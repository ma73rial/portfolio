export type Contribution = {
  date:       string;
  subsystem:  string;
  title:      string;
  desc:       string;
  patchLink?: string;
  bugLink?:   string;
  status:     "Upstream" | "Reviewed" | "Sent";
  accent:     string;
};

export const CONTRIBUTIONS: Contribution[] = [
  {
    date:      "2025",
    subsystem: "drivers/net/wireless",
    title:     "DWA-131 H1 — Upstream WiFi Driver",
    desc:      "The D-Link DWA-131 rev H1 USB WiFi adapter had zero Linux support. Reverse-engineered the chip, wrote a plug-and-play kernel driver in C, and submitted it upstream.",
    status:    "Upstream",
    accent:    "#f97316",
  },
  {
    date:      "Mar 3, 2026",
    subsystem: "arch/alpha/boot/tools",
    title:     "objstrip.c: fix partial write() losing output",
    desc:      "Partial write() return wasn't advancing the buffer pointer, causing silent output corruption on interrupted writes. Classic POSIX write() loop bug.",
    status:    "Sent",
    accent:    "#a78bfa",
  },
  {
    date:      "Mar 3, 2026",
    subsystem: "drivers/net/ethernet/intel/igb + igc",
    title:     "igb/igc: fix typos in comments (v2)",
    desc:      "'likley' → 'likely', 'auto-negotitation' → 'auto-negotiation', 'exra' → 'extra', 'Aserted' → 'Asserted'. Picked up by reviewer Joe Damato (Facebook) who spotted a fourth typo; v2 fixed all four.",
    status:    "Reviewed",
    accent:    "#00d4ff",
  },
  {
    date:      "Mar 3, 2026",
    subsystem: "drivers/ata",
    title:     "libata-core: Disable LPM on ST1000DM010-2EP102",
    desc:      "Seagate BarraCuda 1 TB (ST1000DM010-2EP102) causes random system freezes since kernel 6.15 due to Link Power Management issues — same family as an already-quirked drive. Added it to the NOLPM quirk table. Reviewed-by: Damien Le Moal (Western Digital Research).",
    bugLink:   "https://bugzilla.kernel.org/show_bug.cgi?id=221163",
    status:    "Reviewed",
    accent:    "#00ffb3",
  },
  {
    date:      "Mar 4, 2026",
    subsystem: "mm/vmstat",
    title:     "Reject zero vm.stat_interval to prevent busy-loop",
    desc:      "Setting vm.stat_interval=0 caused round_jiffies_relative(0) to return 0, scheduling vmstat_shepherd immediately — producing a 20-30% kworker busy-loop. Added a custom sysctl handler that rejects zero with -EINVAL, mirroring the pattern used by dirtytime_interval_handler.",
    bugLink:   "https://bugzilla.kernel.org/show_bug.cgi?id=220226",
    status:    "Sent",
    accent:    "#facc15",
  },
  {
    date:      "Mar 4, 2026",
    subsystem: "net/bridge",
    title:     "bridge: fix NULL deref in br_do_suppress_nd when ipv6.disable=1",
    desc:      "With ipv6.disable=1, the IPv6 module skips full initialisation leaving ipv6_stub NULL. A bridge port with neigh_suppress on would then crash on any ICMPv6 Neighbour Solicitation. Added a one-line early-return guard.",
    bugLink:   "https://bugzilla.kernel.org/show_bug.cgi?id=221143",
    status:    "Sent",
    accent:    "#f43f5e",
  },
  {
    date:      "Mar 4, 2026",
    subsystem: "drivers/hid/amd-sfh-hid",
    title:     "amd_sfh: suppress redundant error log on discovery failure",
    desc:      "Systems without AMD SFH sensors already get a dev_warn() from the discovery path; a second dev_err() from the work function was redundant and alarming. Suppress it for -EOPNOTSUPP only.",
    bugLink:   "https://bugzilla.kernel.org/show_bug.cgi?id=221099",
    status:    "Sent",
    accent:    "#38bdf8",
  },
];
