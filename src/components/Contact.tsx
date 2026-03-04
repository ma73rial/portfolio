"use client";
import { useRef, useState, FormEvent } from "react";
import gsap from "gsap";

const FIELDS = [
  { name: "name",    label: "Name",    type: "text",     placeholder: "John Smith" },
  { name: "email",   label: "Email",   type: "email",    placeholder: "john@company.com" },
  { name: "company", label: "Company", type: "text",     placeholder: "Acme Corp (optional)" },
  { name: "message", label: "Message", type: "textarea", placeholder: "Describe the problem you need solved..." },
];

export default function Contact() {
  const formRef  = useRef<HTMLFormElement>(null);
  const btnRef   = useRef<HTMLButtonElement>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });

  // Magnetic button
  const onBtnMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn  = btnRef.current!;
    const rect = btn.getBoundingClientRect();
    const x    = e.clientX - rect.left - rect.width  / 2;
    const y    = e.clientY - rect.top  - rect.height / 2;
    gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: "power2.out" });
  };
  const onBtnLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }
      gsap.to(formRef.current, { opacity: 0, y: -20, duration: 0.4, onComplete: () => setSent(true) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6 border-t border-cyan-400/10">
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="max-w-4xl mx-auto">
        <div className="section-label mb-4">06 / contact</div>
        <h2 className="font-display font-black text-[clamp(2rem,5vw,4rem)] text-white leading-tight mb-4">
          Got something cool<br />
          <span className="text-gradient-cyan">you want to build?</span>
        </h2>
        <p className="text-slate-400 mb-12 max-w-lg leading-relaxed">
          I&apos;m always interested in interesting problems — robotics, systems, weird ideas.
          Reach out if you want to collaborate, have a question, or just want to talk code.
        </p>

        {sent ? (
          <div className="glass rounded-2xl p-12 text-center border border-emerald-400/20">
            <div className="text-5xl mb-4">✓</div>
            <div className="font-display font-bold text-xl text-white mb-2">Message received.</div>
            <div className="text-slate-400 terminal text-sm">I&apos;ll respond within 24 hours.</div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {FIELDS.filter(f => f.type !== "textarea").map(f => (
                <div key={f.name} className="group">
                  <label className="terminal text-xs text-slate-500 tracking-widest uppercase mb-2 block">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    required={f.name !== "company"}
                    placeholder={f.placeholder}
                    value={values[f.name as keyof typeof values]}
                    onChange={e => setValues({ ...values, [f.name]: e.target.value })}
                    className="w-full bg-navy-800/60 border border-navy-500/50 focus:border-cyan-400/60 text-white placeholder:text-slate-600 rounded-lg px-4 py-3 text-sm outline-none transition-all duration-300 focus:bg-navy-800/80"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="terminal text-xs text-slate-500 tracking-widest uppercase mb-2 block">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={FIELDS.find(f => f.type === "textarea")!.placeholder}
                value={values.message}
                onChange={e => setValues({ ...values, message: e.target.value })}
                className="w-full bg-navy-800/60 border border-navy-500/50 focus:border-cyan-400/60 text-white placeholder:text-slate-600 rounded-lg px-4 py-3 text-sm outline-none transition-all duration-300 focus:bg-navy-800/80 resize-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <button
                ref={btnRef}
                type="submit"
                disabled={loading}
                onMouseMove={onBtnMove}
                onMouseLeave={onBtnLeave}
                className="group relative px-10 py-4 bg-cyan-400 text-navy-900 font-bold text-sm tracking-widest uppercase rounded-sm overflow-hidden hover:shadow-[0_0_50px_rgba(0,212,255,0.4)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{loading ? "Sending…" : "Send Message"}</span>
                <span className="absolute inset-0 bg-emerald-400 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
              <p className="terminal text-xs text-slate-500">
                Or email directly:{" "}
                <a href="mailto:mpez6366@student.dodea.edu" className="text-cyan-400 hover:underline">
                  mpez6366@student.dodea.edu
                </a>
              </p>
            </div>
            {error && (
              <p className="terminal text-xs text-red-400 mt-2">// Error: {error}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
