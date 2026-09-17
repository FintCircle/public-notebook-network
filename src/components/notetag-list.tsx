import { Link } from "@tanstack/react-router";

export function NotetagList({
  tags,
  notepage,
}: {
  tags: string[];
  notepage?: string;
}) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-70">
      {tags.map((tag) =>
        notepage ? (
          <Link
            key={tag}
            to="/$notepage/notetags/$tag"
            params={{ notepage, tag }}
            className="hover:opacity-100 hover:underline"
          >
            #{tag}
          </Link>
        ) : (
          <Link
            key={tag}
            to="/notetags/$tag"
            params={{ tag }}
            className="hover:opacity-100 hover:underline"
          >
            #{tag}
          </Link>
        ),
      )}
    </div>
  );
}
