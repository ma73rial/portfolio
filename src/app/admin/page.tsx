"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PROJECTS } from "@/components/Projects";
import dynamic from "next/dynamic";
import { LayoutDashboard, FolderGit2, FileText, Mail, Settings, LogOut } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// ── Types ──────────────────────────────────────────
interface Message {
  id: string; name: string; email: string;
  company?: string; message: string; createdAt: string; read: boolean;
}
interface PostFile {
  slug: string; title: string; date: string;
  excerpt: string; tags: string[]; content: string;
}
interface Settings {
  displayName: string; email: string; tagline: string;
  availability: string; bio: string; github: string;
  linkedin: string; twitter: string;
}

// ── Toast ──────────────────────────────────────────
interface Toast { id: number; msg: string; type: "ok" | "err" }
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);
  const push = useCallback((msg: string, type: Toast["type"] = "ok") => {
    const id = next.current++;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, push };
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",  Icon: LayoutDashboard },
  { id: "projects",  label: "Projects",   Icon: FolderGit2      },
  { id: "blog",      label: "Blog Posts", Icon: FileText        },
  { id: "messages",  label: "Messages",   Icon: Mail            },
  { id: "settings",  label: "Settings",   Icon: Settings        },
];

// ── Root ───────────────────────────────────────────
export default function AdminPage() {
  const [tab,    setTab]    = useState("dashboard");
  const [authed, setAuthed] = useState(false);
  const [pw,     setPw]     = useState("");
  const [err,    setErr]    = useState(false);
  const { toasts, push }    = useToast();

  // Must be declared before any conditional return — Rules of Hooks
  const apiFetch = useCallback(
    (url: string, opts: RequestInit = {}) =>
      fetch(url, {
        ...opts,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${pw}`, ...opts.headers },
      }),
    [pw]
  );

  const [checking, setChecking] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.trim()) { setErr(true); return; }
    setChecking(true);
    try {
      const r = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${pw}` },
      });
      if (r.ok) { setAuthed(true); setErr(false); }
      else      { setErr(true); }
    } catch { setErr(true); }
    finally   { setChecking(false); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 grid-overlay">
        <div className="w-full max-w-sm glass rounded-2xl p-8 border border-cyan-400/10">
          <div className="terminal text-xs text-slate-500 mb-6 tracking-widest">// RESTRICTED ACCESS</div>
          <h1 className="font-display font-black text-2xl text-white mb-1">Admin Panel</h1>
          <p className="text-sm text-slate-500 mb-8">Enter admin password</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              autoFocus
              placeholder="Password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              className="w-full bg-navy-800 border border-navy-500/50 focus:border-cyan-400/60 text-white placeholder:text-slate-600 rounded-lg px-4 py-3 text-sm outline-none transition-all"
            />
            {err && <p className="terminal text-xs text-red-400">// Access denied</p>}
            <button type="submit" disabled={checking} className="w-full py-3 bg-cyan-400 text-navy-900 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-emerald-400 transition-colors disabled:opacity-60">
              {checking ? "Checking…" : "Enter"}
            </button>
          </form>
          <div className="mt-6">
            <Link href="/" className="terminal text-xs text-slate-600 hover:text-cyan-400 transition-colors">← Back to portfolio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="admin-sidebar w-60 flex-shrink-0 flex flex-col py-8 px-4 sticky top-0 h-screen overflow-y-auto">
        <div className="px-2 mb-8">
          <div className="font-display font-black text-base text-white mb-0.5">
            max<span className="text-cyan-400">.</span>dev
          </div>
          <div className="terminal text-xs text-slate-500">Admin Panel</div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
                tab === id
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                  : "text-slate-400 hover:text-white hover:bg-navy-700/40"
              }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-cyan-400/10">
          <Link href="/" className="flex items-center gap-2 terminal text-xs text-slate-500 hover:text-cyan-400 transition-colors block mb-3">← Portfolio</Link>
          <button onClick={() => setAuthed(false)}
            className="flex items-center gap-2 terminal text-xs text-slate-500 hover:text-red-400 transition-colors tracking-widest uppercase">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        {tab === "dashboard" && <DashboardTab apiFetch={apiFetch} />}
        {tab === "projects"  && <ProjectsTab  apiFetch={apiFetch} toast={push} />}
        {tab === "blog"      && <BlogTab       apiFetch={apiFetch} toast={push} />}
        {tab === "messages"  && <MessagesTab   apiFetch={apiFetch} toast={push} />}
        {tab === "settings"  && <SettingsTab   apiFetch={apiFetch} toast={push} />}
      </main>

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999] pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`glass px-4 py-3 rounded-lg border text-sm terminal pointer-events-auto flex items-center gap-2
              ${t.type === "ok" ? "border-emerald-400/30 text-emerald-400" : "border-red-400/30 text-red-400"}`}
          >
            <span>{t.type === "ok" ? "✓" : "✗"}</span> {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared props type ──────────────────────────────
type AdminProps = {
  apiFetch: (url: string, opts?: RequestInit) => Promise<Response>;
  toast: (msg: string, type?: "ok" | "err") => void;
};

// ── Dashboard ──────────────────────────────────────
function DashboardTab({ apiFetch }: { apiFetch: AdminProps["apiFetch"] }) {
  const [msgCount, setMsgCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [unread, setUnread] = useState(0);
  const [recentPosts, setRecentPosts] = useState<PostFile[]>([]);

  useEffect(() => {
    apiFetch("/api/admin/messages").then(r => r.json()).then((msgs: Message[]) => {
      setMsgCount(msgs.length);
      setUnread(msgs.filter(m => !m.read).length);
    }).catch(() => {});
    apiFetch("/api/admin/posts").then(r => r.json()).then((posts: PostFile[]) => {
      setPostCount(posts.length);
      setRecentPosts(posts.slice(0, 5));
    }).catch(() => {});
  }, [apiFetch]);

  const stats = [
    { label: "Total Projects",   value: PROJECTS.length, color: "#00d4ff" },
    { label: "Blog Posts",       value: postCount,        color: "#00ffb3" },
    { label: "Messages",         value: msgCount,         color: "#a78bfa" },
    { label: "Unread Messages",  value: unread,           color: "#f472b6" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Dashboard</h1>
        <p className="terminal text-xs text-slate-500">All systems nominal.</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="glass rounded-xl p-5 border border-white/5">
            <div className="terminal text-xs text-slate-500 mb-2 tracking-wider">{s.label}</div>
            <div className="font-display font-black text-3xl" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 border border-white/5">
          <div className="terminal text-xs text-slate-500 tracking-wider mb-6">RECENT POSTS</div>
          {recentPosts.length === 0 ? (
            <p className="terminal text-xs text-slate-600">// No posts yet — create one in the Blog tab.</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map(p => (
                <div key={p.slug} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/5">
                  <div>
                    <div className="text-sm text-slate-300 font-semibold line-clamp-1">{p.title}</div>
                    <div className="terminal text-[10px] text-slate-500 mt-0.5">{p.date}</div>
                  </div>
                  <Link href={`/blog/${p.slug}`} target="_blank"
                    className="terminal text-xs text-cyan-400 hover:text-emerald-400 transition-colors ml-4 flex-shrink-0">View →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="glass rounded-xl p-6 border border-white/5">
          <div className="terminal text-xs text-slate-500 tracking-wider mb-6">QUICK LINKS</div>
          <div className="space-y-3">
            {[
              { label: "View live portfolio",    href: "/",       ext: false },
              { label: "Read blog posts",        href: "/blog",   ext: false },
              { label: "API: messages",          href: "/api/admin/messages", ext: true  },
              { label: "API: posts",             href: "/api/admin/posts",    ext: true  },
              { label: "API: settings",          href: "/api/admin/settings", ext: true  },
            ].map(l => (
              <a key={l.href} href={l.href} target={l.ext ? "_blank" : undefined}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/5 hover:border-cyan-400/20 text-sm text-slate-300 hover:text-cyan-400 transition-all">
                {l.label}
                <span className="text-slate-600">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Projects ───────────────────────────────────────
function ProjectsTab({ apiFetch: _apiFetch, toast: _toast }: AdminProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Projects</h1>
          <p className="terminal text-xs text-slate-500">{PROJECTS.length} projects — statically defined in src/components/Projects.tsx</p>
        </div>
      </div>
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left terminal text-xs text-slate-500 tracking-widest px-6 py-4">NAME</th>
              <th className="text-left terminal text-xs text-slate-500 tracking-widest px-6 py-4 hidden md:table-cell">STATUS</th>
              <th className="text-left terminal text-xs text-slate-500 tracking-widest px-6 py-4 hidden lg:table-cell">IMPACT</th>
              <th className="text-right terminal text-xs text-slate-500 tracking-widest px-6 py-4">BLOG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {PROJECTS.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.accent }} />
                    <div>
                      <div className="font-semibold text-sm text-white">{p.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{p.tagline}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="terminal text-xs px-2 py-1 rounded border" style={{ color: p.accent, borderColor: `${p.accent}33` }}>{p.status}</span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="terminal text-xs text-slate-500">{p.tags.join(", ")}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/blog/${p.id}`} target="_blank"
                    className="terminal text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="terminal text-xs text-slate-600 mt-4">// To add/edit projects, update PROJECTS array in src/components/Projects.tsx</p>
    </div>
  );
}

// ── Blog ───────────────────────────────────────────
function BlogTab({ apiFetch, toast }: AdminProps) {
  const [posts,   setPosts]   = useState<PostFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ slug: "", title: "", date: new Date().toISOString().slice(0, 10), excerpt: "", tags: "", content: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/admin/posts");
      if (!r.ok) throw new Error("Unauthorized");
      setPosts(await r.json());
    } catch { toast("Failed to load posts", "err"); }
    finally  { setLoading(false); }
  }, [apiFetch, toast]);

  useEffect(() => { load(); }, [load]);

  const deletePost = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    const r = await apiFetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    if (r.ok) { toast("Post deleted"); load(); }
    else      { toast("Failed to delete post", "err"); }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const r = await apiFetch("/api/admin/posts", {
      method: "POST",
      body:   JSON.stringify({ ...form, tags }),
    });
    if (r.ok) { toast("Post created"); setShowNew(false); setForm({ slug: "", title: "", date: new Date().toISOString().slice(0,10), excerpt: "", tags: "", content: "" }); load(); }
    else      { const d = await r.json(); toast(d.error ?? "Failed to create post", "err"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Blog Posts</h1>
          <p className="terminal text-xs text-slate-500">{posts.length} posts in content/posts/</p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 text-xs font-bold tracking-widest uppercase border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-all rounded-sm">
          {showNew ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {showNew && (
        <form onSubmit={createPost} className="glass rounded-xl p-6 border border-cyan-400/20 mb-6 space-y-4">
          <div className="terminal text-xs text-cyan-400 mb-2">New blog post</div>
          <div className="grid md:grid-cols-2 gap-4">
            {(["slug","title","date","excerpt","tags"] as const).map(f => (
              <div key={f}>
                <label className="terminal text-xs text-slate-500 tracking-widest mb-1.5 block uppercase">{f} {f === "tags" ? "(comma separated)" : ""}</label>
                <input required={f !== "excerpt" && f !== "tags"} value={form[f]}
                  onChange={e => setForm({ ...form, [f]: e.target.value })}
                  className="w-full bg-navy-800/60 border border-navy-500/50 focus:border-cyan-400/60 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
              </div>
            ))}
          </div>
          <div>
            <label className="terminal text-xs text-slate-500 tracking-widest mb-1.5 block">CONTENT (Markdown)</label>
            <div data-color-mode="dark">
              <MDEditor
                value={form.content}
                onChange={v => setForm({ ...form, content: v ?? "" })}
                height={320}
                preview="edit"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-cyan-400 text-navy-900 font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-emerald-400 transition-colors">
            Create Post
          </button>
        </form>
      )}

      {loading ? (
        <div className="terminal text-xs text-slate-500 text-center py-12">// Loading posts…</div>
      ) : (
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left terminal text-xs text-slate-500 tracking-widest px-6 py-4">TITLE</th>
                <th className="text-left terminal text-xs text-slate-500 tracking-widest px-6 py-4 hidden md:table-cell">DATE</th>
                <th className="text-right terminal text-xs text-slate-500 tracking-widest px-6 py-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map(p => (
                <tr key={p.slug} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-white mb-1 line-clamp-1">{p.title}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map(t => (
                        <span key={t} className="terminal text-[10px] px-1.5 py-0.5 rounded border border-cyan-400/20 text-cyan-400">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="terminal text-xs text-slate-400">{p.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/blog/${p.slug}`} target="_blank"
                        className="terminal text-xs text-slate-500 hover:text-cyan-400 transition-colors">View</Link>
                      <button onClick={() => deletePost(p.slug)}
                        className="terminal text-xs text-slate-500 hover:text-red-400 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Messages ───────────────────────────────────────
function MessagesTab({ apiFetch, toast }: AdminProps) {
  const [msgs,    setMsgs]    = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/api/admin/messages");
      if (!r.ok) throw new Error();
      setMsgs(await r.json());
    } catch { toast("Failed to load messages", "err"); }
    finally  { setLoading(false); }
  }, [apiFetch, toast]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await apiFetch(`/api/admin/messages/${id}`, { method: "PATCH" });
    setMsgs(m => m.map(x => x.id === id ? { ...x, read: true } : x));
  };

  const deleteMsg = async (id: string) => {
    const r = await apiFetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (r.ok) { toast("Message deleted"); setMsgs(m => m.filter(x => x.id !== id)); }
    else      { toast("Failed to delete", "err"); }
  };

  const unread = msgs.filter(m => !m.read).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Messages</h1>
        <p className="terminal text-xs text-slate-500">{msgs.length} total · {unread} unread</p>
      </div>

      {loading ? (
        <div className="terminal text-xs text-slate-500 text-center py-12">// Loading messages…</div>
      ) : msgs.length === 0 ? (
        <div className="terminal text-xs text-slate-500 text-center py-12">// No messages yet. The contact form populates this inbox.</div>
      ) : (
        <div className="space-y-3">
          {msgs.map(m => (
            <div key={m.id}
              className={`glass rounded-xl border transition-all ${!m.read ? "border-cyan-400/20" : "border-white/5"}`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!m.read ? "bg-cyan-400" : "bg-navy-500"}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm text-white">{m.name}</span>
                        {m.company && <span className="terminal text-xs text-slate-500">{m.company}</span>}
                        <a href={`mailto:${m.email}`} className="terminal text-xs text-cyan-400 hover:underline">{m.email}</a>
                      </div>
                      <p
                        className={`text-sm text-slate-400 ${expanded === m.id ? "" : "line-clamp-2"}`}
                      >
                        {m.message}
                      </p>
                      {m.message.length > 120 && (
                        <button onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                          className="terminal text-xs text-slate-600 hover:text-cyan-400 transition-colors mt-1">
                          {expanded === m.id ? "show less" : "show more"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="terminal text-xs text-slate-500">{new Date(m.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-3">
                      {!m.read && (
                        <button onClick={() => markRead(m.id)} className="terminal text-xs text-slate-500 hover:text-emerald-400 transition-colors">
                          Mark read
                        </button>
                      )}
                      <a href={`mailto:${m.email}?subject=Re: your message`}
                        className="terminal text-xs text-cyan-400 hover:text-emerald-400 transition-colors">
                        Reply
                      </a>
                      <button onClick={() => deleteMsg(m.id)} className="terminal text-xs text-slate-500 hover:text-red-400 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Settings ───────────────────────────────────────
function SettingsTab({ apiFetch, toast }: AdminProps) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    apiFetch("/api/admin/settings")
      .then(r => r.json())
      .then(setSettings)
      .catch(() => toast("Failed to load settings", "err"));
  }, [apiFetch, toast]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const r = await apiFetch("/api/admin/settings", {
        method: "PUT",
        body:   JSON.stringify(settings),
      });
      if (!r.ok) throw new Error();
      toast("Settings saved");
    } catch { toast("Failed to save", "err"); }
    finally  { setSaving(false); }
  };

  if (!settings) return <div className="terminal text-xs text-slate-500 py-12 text-center">// Loading…</div>;

  const FIELDS: { key: keyof Settings; label: string }[] = [
    { key: "displayName",  label: "Display Name"  },
    { key: "email",        label: "Email"         },
    { key: "tagline",      label: "Tagline"       },
    { key: "availability", label: "Availability"  },
    { key: "bio",          label: "Bio"           },
    { key: "github",       label: "GitHub URL"    },
    { key: "linkedin",     label: "LinkedIn URL"  },
    { key: "twitter",      label: "Twitter URL"   },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Settings</h1>
        <p className="terminal text-xs text-slate-500">Persisted to data/settings.json</p>
      </div>
      <form onSubmit={save} className="max-w-lg space-y-4">
        {FIELDS.map(f => (
          <div key={f.key} className="glass rounded-xl p-5 border border-white/5">
            <label className="terminal text-xs text-slate-500 tracking-widest mb-2 block uppercase">{f.label}</label>
            {f.key === "bio" ? (
              <textarea rows={3} value={settings[f.key]}
                onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
                className="w-full bg-navy-800/60 border border-navy-500/50 focus:border-cyan-400/60 text-white rounded-lg px-4 py-2.5 text-sm outline-none resize-none" />
            ) : (
              <input value={settings[f.key]}
                onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
                className="w-full bg-navy-800/60 border border-navy-500/50 focus:border-cyan-400/60 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
            )}
          </div>
        ))}
        <button type="submit" disabled={saving}
          className="px-6 py-3 bg-cyan-400 text-navy-900 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-emerald-400 transition-colors disabled:opacity-60">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
