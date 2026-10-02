import { goToSignIn } from "@/lib/account-portal";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import type { Note } from "@/data/inktella";
import { toggleLike } from "@/lib/inktella.functions";
import { currentUserId } from "@/lib/inktella-store";

export function LikeButton({ note }: { note: Note }) {
  const initiallyLiked = !!currentUserId && note.likedBy.includes(currentUserId);
  const [liked, setLiked] = useState(initiallyLiked);
  const [busy, setBusy] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const count = note.likes - (initiallyLiked ? 1 : 0) + (liked ? 1 : 0);

  async function onClick() {
    if (!isAuthenticated) return goToSignIn();
    setBusy(true);
    setLiked((v) => !v);
    try {
      const res = await toggleLike({ data: { noteId: note.id } });
      setLiked(res.liked);
    } catch {
      setLiked(initiallyLiked);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      disabled={busy}
      aria-label={isAuthenticated ? (liked ? "Unlike this note" : "Like this note") : "Sign in to like this note"}
      onClick={() => void onClick()}
      className="inline-flex items-center gap-1.5 text-sm opacity-60 transition-opacity hover:opacity-100"
    >
      <span aria-hidden className="text-base leading-none">{liked ? "♥" : "♡"}</span>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
