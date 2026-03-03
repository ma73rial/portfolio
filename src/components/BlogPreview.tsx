import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default async function BlogPreview() {
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <section id="blog" className="relative py-32 px-6 border-t border-cyan-400/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="section-label mb-4">04 / writing</div>
            <h2 className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] text-white leading-tight">
              Technical writing<br />
              <span className="text-gradient-cyan">on things I&apos;ve built.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-sm text-cyan-400 hover:text-emerald-400 transition-colors tracking-widest uppercase terminal"
          >
            All posts
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group glass rounded-2xl p-6 flex flex-col justify-between card-hover border border-transparent hover:border-cyan-400/20 transition-all duration-300"
              style={{ minHeight: "280px" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="terminal text-xs text-slate-500">{post.date}</span>
                  {post.tags?.[0] && (
                    <span className="terminal text-xs px-2 py-0.5 rounded-sm border border-cyan-400/20 text-cyan-400">
                      {post.tags[0]}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-cyan-400 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="terminal text-xs text-slate-500">{post.readingTime} min read</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/blog"
            className="terminal text-sm text-cyan-400 tracking-widest uppercase"
          >
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  );
}
