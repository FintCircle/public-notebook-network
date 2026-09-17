import { useState } from "react";

export function LikeButton({ count }: { count: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Unlike this note" : "Like this note"}
      onClick={() => setLiked((v) => !v)}
      className="inline-flex items-center gap-1.5 text-sm opacity-60 transition-opacity hover:opacity-100"
    >
      <span aria-hidden className="text-base leading-none">
        {liked ? "♥" : "♡"}
      </span>
      <span className="tabular-nums">{count + (liked ? 1 : 0)}</span>
    </button>
  );
}
