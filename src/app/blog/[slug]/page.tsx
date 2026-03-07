import { notFound } from "next/navigation";
import Link          from "next/link";
import { getPost, getAllPostSlugs } from "@/lib/posts";
import { remark }   from "remark";
import remarkHtml   from "remark-html";
import remarkGfm    from "remark-gfm";
import ReadingProgress from "./ReadingProgress";
import PostCountdown   from "@/components/PostCountdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title:       `${post.title} — Max Pezzullo`,
    description: "locked" in post ? "This post is not yet available." : post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Locked post — show countdown
  if ("locked" in post) {
    return (
      <main className="min-h-screen pt-28 pb-24 px-6 flex flex-col items-center justify-center relative">
        <div className="max-w-3xl w-full mx-auto flex flex-col items-center gap-10 text-center">
          <Link
            href="/blog"
            className="self-start inline-flex items-center gap-2 terminal text-xs text-slate-500 hover:text-cyan-400 transition-colors tracking-widest uppercase"
          >
            ← Back to blog
          </Link>

          <div className="flex flex-wrap justify-center gap-2">
            {post.tags.map(t => (
              <span
                key={t}
                className="terminal text-xs px-2 py-1 rounded-sm border border-cyan-400/20 text-cyan-400"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="font-display font-black text-[clamp(1.6rem,4vw,3rem)] text-white leading-tight">
            {post.title}
          </h1>

          <div className="w-full h-px bg-cyan-400/10" />

          <p className="terminal text-xs text-slate-500 tracking-widest uppercase">
            This post is locked. Check back in…
          </p>

          <PostCountdown lockedUntil={post.lockedUntil} />
        </div>
      </main>
    );
  }

  // Convert markdown → HTML
  const processed = await remark().use(remarkGfm).use(remarkHtml, { allowDangerousHtml: true }).process(post.content);
  const html = processed.toString();

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 relative">
      <ReadingProgress />

      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 terminal text-xs text-slate-500 hover:text-cyan-400 transition-colors tracking-widest uppercase mb-10"
        >
          ← Back to blog
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(t => (
            <span
              key={t}
              className="terminal text-xs px-2 py-1 rounded-sm border border-cyan-400/20 text-cyan-400"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-[clamp(1.8rem,4vw,3.2rem)] text-white leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-6 mb-12 pb-8 border-b border-cyan-400/10">
          <span className="terminal text-xs text-slate-500">{post.date}</span>
          <span className="terminal text-xs text-slate-500">{post.readingTime} min read</span>
          <span className="terminal text-xs text-slate-600">Max Pezzullo</span>
        </div>

        {/* Content */}
        <article
          className="prose-portfolio"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-cyan-400/10 flex items-center justify-between">
          <Link
            href="/blog"
            className="terminal text-xs text-slate-500 hover:text-cyan-400 transition-colors tracking-widest uppercase"
          >
            ← All posts
          </Link>
          <Link
            href="/#contact"
            className="terminal text-xs text-cyan-400 hover:text-emerald-400 transition-colors tracking-widest uppercase"
          >
            Get in touch →
          </Link>
        </div>
      </div>
    </main>
  );
}
