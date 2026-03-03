import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug:        string;
  title:       string;
  date:        string;
  excerpt:     string;
  tags:        string[];
  readingTime: number;
  cover?:      string;
}

export interface Post extends PostMeta {
  content: string;
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));

  const posts = files.map(file => {
    const raw  = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    return {
      slug,
      title:       data.title       ?? "Untitled",
      date:        data.date        ?? "",
      excerpt:     data.excerpt     ?? content.slice(0, 160).replace(/\n/g, " ") + "…",
      tags:        data.tags        ?? [],
      readingTime: estimateReadingTime(content),
      cover:       data.cover,
    } as PostMeta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title:       data.title       ?? "Untitled",
    date:        data.date        ?? "",
    excerpt:     data.excerpt     ?? content.slice(0, 160).replace(/\n/g, " ") + "…",
    tags:        data.tags        ?? [],
    readingTime: estimateReadingTime(content),
    cover:       data.cover,
    content,
  };
}
