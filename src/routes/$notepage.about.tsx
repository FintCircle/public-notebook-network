import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";
import { getNotepage } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/about")({
  head: ({ params }) => {
    const notepage = getNotepage(params.notepage);
    return {
      meta: [{ title: notepage ? `About ${notepage.owner} — ${notepage.name}` : "About | Inktella" }],
    };
  },
  component: NotepageAbout,
});

function NotepageAbout() {
  const { notepage: slug } = Route.useParams();
  const notepage = getNotepage(slug);
  const [isEditing, setIsEditing] = useState(false);
  const [pageTitle, setPageTitle] = useState("About");
  const [intro, setIntro] = useState("A little more about the person behind this notebook.");
  const [bio, setBio] = useState(notepage?.ownerBio ?? "");
  const [interests, setInterests] = useState(notepage?.interests.join(", ") ?? "");
  const [links, setLinks] = useState(notepage?.links ?? []);

  if (!notepage) return null;

  return (
    <main
      className="notepage-theme min-h-screen px-5 py-8 text-[var(--np-ink)] sm:py-14"
      style={{
        "--np-bg": notepage.theme.bg,
        "--np-ink": notepage.theme.ink,
        backgroundColor: notepage.theme.bg,
      } as CSSProperties}
    >
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link to="/$notepage" params={{ notepage: slug }} className="text-sm opacity-60 hover:opacity-100">
            ← {notepage.name}
          </Link>
          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="hand text-xl opacity-75 hover:opacity-100"
          >
            {isEditing ? "Done" : "Edit about"}
          </button>
        </div>

        <header className="mt-16 border-b border-current/15 pb-10">
          <img
            src={notepage.portrait}
            alt={`${notepage.owner} portrait`}
            className="size-24 rounded-full object-cover sm:size-28"
          />
          <p className="mt-6 text-sm opacity-60">{notepage.owner} · {notepage.country}</p>
          {isEditing ? (
            <div className="mt-5 grid gap-3">
              <input value={pageTitle} onChange={(event) => setPageTitle(event.target.value)} aria-label="About page title" className="border-b border-current/20 bg-transparent py-1 font-heading text-4xl tracking-tight outline-none focus:border-current/50 sm:text-5xl" />
              <textarea value={intro} onChange={(event) => setIntro(event.target.value)} aria-label="About page introduction" rows={2} className="max-w-[42ch] resize-y border border-current/20 bg-transparent p-2 text-lg leading-relaxed outline-none focus:border-current/50" />
            </div>
          ) : (
            <>
              <h1 className="mt-2 font-heading text-4xl tracking-tight sm:text-5xl">{pageTitle}</h1>
              <p className="mt-4 max-w-[42ch] text-lg leading-relaxed opacity-75">{intro}</p>
            </>
          )}
        </header>

        <section className="grid gap-10 py-10 sm:grid-cols-[1fr_0.7fr]" aria-label="About details">
          <div>
            <label htmlFor="about-bio" className="text-sm opacity-55">Bio</label>
            {isEditing ? (
              <textarea id="about-bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={7} className="mt-3 w-full resize-y border border-current/20 bg-transparent p-3 leading-relaxed outline-none focus:border-current/50" />
            ) : (
              <p className="mt-3 whitespace-pre-line leading-relaxed">{bio}</p>
            )}
          </div>

          <div>
            <h2 className="text-sm opacity-55">Interests</h2>
            {isEditing ? (
              <textarea value={interests} onChange={(event) => setInterests(event.target.value)} aria-label="Interests" rows={3} className="mt-3 w-full resize-y border border-current/20 bg-transparent p-2 leading-relaxed outline-none focus:border-current/50" />
            ) : (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 leading-relaxed">
                {interests.split(",").map((interest) => interest.trim()).filter(Boolean).map((interest) => <span key={interest}>{interest}</span>)}
              </div>
            )}
            <h2 className="mt-9 text-sm opacity-55">Elsewhere</h2>
            {isEditing ? (
              <div className="mt-3 grid gap-3">
                {links.map((link, index) => (
                  <div key={`${link.label}-${index}`} className="grid gap-2 sm:grid-cols-2">
                    <input value={link.label} onChange={(event) => setLinks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} aria-label={`Link ${index + 1} label`} className="border border-current/20 bg-transparent p-2 outline-none focus:border-current/50" />
                    <input value={link.href} onChange={(event) => setLinks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, href: event.target.value } : item))} aria-label={`Link ${index + 1} URL`} className="border border-current/20 bg-transparent p-2 outline-none focus:border-current/50" />
                  </div>
                ))}
                <button type="button" onClick={() => setLinks((current) => [...current, { label: "New link", href: "https://" }])} className="justify-self-start text-sm underline underline-offset-4 opacity-70 hover:opacity-100">+ add link</button>
              </div>
            ) : (
              <div className="mt-3 flex flex-col items-start gap-2">
                {links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 opacity-80 hover:opacity-100">{link.label} ↗</a>)}
              </div>
            )}
          </div>
        </section>

        {isEditing && (
          <p className="border-t border-current/15 pt-5 text-sm opacity-55">
            This editor is ready for your about details. Save and account permissions can be connected when editing is wired to your backend.
          </p>
        )}
      </div>
    </main>
  );
}
