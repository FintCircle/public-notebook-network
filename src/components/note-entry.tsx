import { Link } from "@tanstack/react-router";
import type { Note } from "@/data/inktella";
import { LikeButton } from "./like-button";
import { NotetagList } from "./notetag-list";

export function NoteEntry({ note }: { note: Note }) {
  return (
    <article className="py-9">
      <p className="text-xs tracking-[0.18em] uppercase opacity-50">
        {note.date}
      </p>
      <h2 className="mt-3 text-2xl leading-snug">
        <Link
          to="/$notepage/notepage/$noteId"
          params={{ notepage: note.notepage, noteId: note.id }}
          className="hover:underline"
        >
          {note.title}
        </Link>
      </h2>
      <p className="mt-3 max-w-[62ch] leading-relaxed opacity-80">{note.preview}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <NotetagList tags={note.notetags} notepage={note.notepage} />
        <LikeButton count={note.likes} />
      </div>
    </article>
  );
}
