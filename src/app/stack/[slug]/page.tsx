import { STACK } from "@/data/stack";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return STACK.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = STACK.find(s => s.slug === slug);
  if (!item) return {};
  return {
    title: `${item.name} — Max Pezzullo`,
    description: item.tagline,
  };
}

export default async function StackPage({ params }: Props) {
  const { slug } = await params;
  const item = STACK.find(s => s.slug === slug);
  if (!item) notFound();

  const { Icon } = item;

  return (
    <main className="min-h-screen py-32 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          href="/#stack"
          className="terminal text-xs text-slate-500 hover:text-cyan-400 transition-colors tracking-widest uppercase mb-12 inline-block"
        >
          ← Stack
        </Link>

        {/* Hero */}
        <div className="flex items-start gap-6 mb-12 mt-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
          >
            <Icon style={{ color: item.color }} className="text-4xl" />
          </div>
          <div>
            <h1 className="font-display font-black text-4xl text-white mb-2">{item.name}</h1>
            <p className="text-slate-400">{item.tagline}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10 mb-10 pb-10 border-b border-white/5">
          <div>
            <div className="terminal text-xs text-slate-500 tracking-widest mb-1">SINCE</div>
            <div className="font-display font-bold text-white text-lg">{item.since}</div>
          </div>
          <div>
            <div className="terminal text-xs text-slate-500 tracking-widest mb-2">PROFICIENCY</div>
            <div className="flex items-center gap-3">
              <div className="w-36 h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.proficiency}%`, background: item.color }}
                />
              </div>
              <span className="font-display font-bold text-white text-sm">{item.proficiency}%</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 leading-relaxed text-lg mb-12">{item.description}</p>

        {/* Use cases */}
        <div className="mb-12">
          <div className="terminal text-xs text-slate-500 tracking-widest mb-5">I USE IT FOR</div>
          <ul className="space-y-3">
            {item.usedFor.map((use, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                {use}
              </li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        {item.projects.length > 0 && (
          <div className="mb-12">
            <div className="terminal text-xs text-slate-500 tracking-widest mb-5">PROJECTS</div>
            <div className="flex flex-wrap gap-3">
              {item.projects.map(p => (
                <Link
                  key={p.id}
                  href={`/blog/${p.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: `${item.color}15`,
                    color: item.color,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  {p.name} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Code sample */}
        <div>
          <div className="terminal text-xs text-slate-500 tracking-widest mb-5">CODE SAMPLE</div>
          <pre
            className="glass rounded-xl p-6 text-xs font-mono leading-relaxed overflow-x-auto"
            style={{ color: item.color }}
          >
{item.code}
          </pre>
        </div>

        {/* Other stack items */}
        <div className="mt-16 pt-10 border-t border-white/5">
          <div className="terminal text-xs text-slate-500 tracking-widest mb-5">REST OF THE STACK</div>
          <div className="flex flex-wrap gap-2">
            {STACK.filter(s => s.slug !== item.slug).map(s => (
              <Link
                key={s.slug}
                href={`/stack/${s.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
              >
                <s.Icon style={{ color: s.color }} className="text-sm" />
                {s.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
