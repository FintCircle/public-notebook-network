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
  const [bio, setBio] = useState(notepage?.ownerBio ?? "");

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
          <h1 className="mt-2 font-heading text-4xl tracking-tight sm:text-5xl">About</h1>
          <p className="mt-4 max-w-[42ch] text-lg leading-relaxed opacity-75">
            A little more about the person behind this notebook.
          </p>
        </header>

        <section className="grid gap-10 py-10 sm:grid-cols-[1fr_0.7fr]" aria-label="About details">
          <div>
            <label htmlFor="about-bio" className="text-sm opacity-55">Bio</label>
            {isEditing ? (
              <textarea
                id="about-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={7}
                className="mt-3 w-full resize-y border border-current/20 bg-transparent p-3 leading-relaxed outline-none focus:border-current/50"
              />
            ) : (
              <p className="mt-3 leading-relaxed">{bio}</p>
            )}
          </div>

          <div>
            <h2 className="text-sm opacity-55">Interests</h2>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 leading-relaxed">
              {notepage.interests.map((interest) => <span key={interest}>{interest}</span>)}
            </div>
            <h2 className="mt-9 text-sm opacity-55">Elsewhere</h2>
            <div className="mt-3 flex flex-col items-start gap-2">
              {notepage.links.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 opacity-80 hover:opacity-100">
                  {link.label} ↗
                </a>
              ))}
            </div>
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
