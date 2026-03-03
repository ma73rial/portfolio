import fs   from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_DIR = path.join(process.cwd(), "content/posts");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Messages ──────────────────────────────────────

export interface Message {
  id:        string;
  name:      string;
  email:     string;
  company?:  string;
  message:   string;
  createdAt: string;
  read:      boolean;
}

export function readMessages(): Message[] {
  ensureDataDir();
  const file = path.join(DATA_DIR, "messages.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as Message[];
}

export function writeMessages(msgs: Message[]): void {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, "messages.json"), JSON.stringify(msgs, null, 2));
}

export function appendMessage(msg: Omit<Message, "id" | "createdAt" | "read">): Message {
  const msgs = readMessages();
  const newMsg: Message = {
    ...msg,
    id:        crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read:      false,
  };
  msgs.unshift(newMsg);
  writeMessages(msgs);
  return newMsg;
}

// ── Settings ──────────────────────────────────────

export interface Settings {
  displayName:  string;
  email:        string;
  tagline:      string;
  availability: string;
  bio:          string;
  github:       string;
  linkedin:     string;
  twitter:      string;
}

const DEFAULT_SETTINGS: Settings = {
  displayName:  "Max Pezzullo",
  email:        "max@example.com",
  tagline:      "Systems Engineer",
  availability: "Available",
  bio:          "I build high-performance systems to replace inefficient infrastructure.",
  github:       "https://github.com",
  linkedin:     "https://linkedin.com",
  twitter:      "https://twitter.com",
};

export function readSettings(): Settings {
  ensureDataDir();
  const file = path.join(DATA_DIR, "settings.json");
  if (!fs.existsSync(file)) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(file, "utf8")) };
}

export function writeSettings(s: Partial<Settings>): Settings {
  const current = readSettings();
  const updated = { ...current, ...s };
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, "settings.json"), JSON.stringify(updated, null, 2));
  return updated;
}

// ── Blog posts (file-based) ────────────────────────

import matter from "gray-matter";

export interface PostFile {
  slug:    string;
  title:   string;
  date:    string;
  excerpt: string;
  tags:    string[];
  content: string;
}

export function listPostFiles(): PostFile[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith(".md"))
    .map(f => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug:    f.replace(/\.md$/, ""),
        title:   data.title   ?? "",
        date:    data.date    ?? "",
        excerpt: data.excerpt ?? "",
        tags:    data.tags    ?? [],
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function createPostFile(
  slug:    string,
  title:   string,
  date:    string,
  excerpt: string,
  tags:    string[],
  content: string,
): void {
  const frontmatter =
    `---\ntitle: "${title}"\ndate: "${date}"\nexcerpt: "${excerpt.replace(/"/g, "'")}"\ntags: [${tags.map(t => `"${t}"`).join(", ")}]\n---\n\n`;
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), frontmatter + content);
}

export function deletePostFile(slug: string): boolean {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

// ── Auth helper ────────────────────────────────────

export function checkAdminAuth(req: Request): boolean {
  const authHeader = req.headers.get("authorization") ?? "";
  const token      = authHeader.replace(/^Bearer\s+/i, "");
  const expected   = process.env.ADMIN_PASSWORD ?? "admin";
  return token === expected;
}
