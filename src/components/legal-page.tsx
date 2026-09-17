import { Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
        <Link to="/" className="text-sm opacity-55 hover:opacity-100">
          ← Inktella
        </Link>
        <h1 className="mt-10 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-[58ch] text-lg leading-relaxed opacity-75">{intro}</p>
        <p className="mt-4 text-xs uppercase opacity-45">Last updated 17 September 2026</p>

        <div className="mt-12 space-y-10 border-t border-border/70 pt-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl">{section.title}</h2>
              <div className="mt-3 space-y-3 leading-relaxed opacity-75">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}