import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function LikeButton({ count }: { count: number }) {
  const [liked, setLiked] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={isAuthenticated ? (liked ? "Unlike this note" : "Like this note") : "Sign in to like this note"}
      onClick={() => isAuthenticated ? setLiked((v) => !v) : navigate({ to: "/sign-in" })}
      className="inline-flex items-center gap-1.5 text-sm opacity-60 transition-opacity hover:opacity-100"
    >
      <span aria-hidden className="text-base leading-none">
        {liked ? "♥" : "♡"}
      </span>
      <span className="tabular-nums">{count + (liked ? 1 : 0)}</span>
    </button>
  );
}
