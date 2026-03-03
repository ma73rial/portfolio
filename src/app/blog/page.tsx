import Link        from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog — Max Pezzullo",
  description: "Thoughts on high-performance systems, distributed architectures, and why most infrastructure deserves to be replaced.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="section-label mb-4">Writing</div>
          <h1 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-white leading-tight mb-4">
            Opinions on infra.<br />
            <span className="text-gradient-cyan">Backed by benchmarks.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            I write about distributed systems, performance engineering, and the art of
            replacing bad infrastructure with good infrastructure.
          </p>
        </div>

        {/* Post list */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-xl px-6 py-5 border border-transparent hover:border-cyan-400/20 transition-all duration-300 card-hover"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {post.tags.map(t => (
                    <span
                      key={t}
                      className="terminal text-xs px-2 py-0.5 rounded-sm border border-cyan-400/20 text-cyan-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="font-display font-bold text-lg text-white group-hover:text-cyan-400 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2 max-w-2xl">{post.excerpt}</p>
              </div>
              <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-1 flex-shrink-0">
                <span className="terminal text-xs text-slate-500">{post.date}</span>
                <span className="terminal text-xs text-slate-600">{post.readingTime} min read</span>
                <span className="text-cyan-400 ml-auto md:ml-0 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-24 text-slate-500 terminal">
            // No posts yet. Check back soon.
          </div>
        )}
      </div>
    </main>
  );
}
