import Hero                  from "@/components/Hero";
import Manifesto             from "@/components/Manifesto";
import Stats                 from "@/components/Stats";
import Projects              from "@/components/Projects";
import KernelContributions   from "@/components/KernelContributions";
import About                 from "@/components/About";
import BlogPreview           from "@/components/BlogPreview";
import Contact               from "@/components/Contact";
import Footer                from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Stats />
      <Projects />
      <About />
      <KernelContributions />
      <BlogPreview />
      <Contact />
      <Footer />
    </main>
  );
}
