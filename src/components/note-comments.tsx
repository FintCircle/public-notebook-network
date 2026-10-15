import { useState } from "react";
import { MessageCircle, MoreHorizontal, Flag, Pencil, Trash2 } from "lucide-react";
import { addComment, deleteComment, editComment, reportComment } from "@/lib/comment-actions";
import { comments, currentUserId, useInktellaStore, type NoteComment } from "@/lib/inktella-store";
import { useAuth } from "@/lib/auth";

export function NoteComments({ noteId, enabled = true }: { noteId: string; enabled?: boolean }) {
  const { refresh } = useInktellaStore();
  const { isAuthenticated } = useAuth();
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const all = comments.filter((comment) => comment.noteId === noteId && !comment.deletedAt);
  const roots = all.filter((comment) => !comment.parentId);
  const replies = (id: string) => all.filter((comment) => comment.parentId === id);

  async function submit() {
    if (!body.trim() || busy) return;
    setBusy(true);
    try {
      if (editing) await editComment({ data: { commentId: editing, body } });
      else await addComment({ data: { noteId, parentId: replyTo ?? undefined, body } });
      setBody(""); setReplyTo(null); setEditing(null); await refresh();
    } finally { setBusy(false); }
  }

  if (!enabled) return <p className="mt-16 border-t border-black/10 pt-6 text-sm opacity-60">Comments are turned off for this note.</p>;
  return <section className="mt-16 border-t border-black/10 pt-8" aria-labelledby="comments-heading">
    <div className="flex items-center justify-between"><h2 id="comments-heading" className="flex items-center gap-2 text-lg"><MessageCircle className="size-4" /> Comments <span className="text-sm opacity-50">{all.length}</span></h2></div>
    {isAuthenticated ? <div className="mt-5 flex gap-3"><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder={editing ? "Edit your comment…" : replyTo ? "Write a reply…" : "Leave a thoughtful comment…"} maxLength={2000} rows={3} className="min-h-20 flex-1 resize-y rounded-lg border border-black/15 bg-transparent p-3 text-sm outline-none focus:border-black/40" /><button type="button" disabled={busy || !body.trim()} onClick={submit} className="self-end rounded-full bg-black px-4 py-2 text-sm text-white disabled:opacity-40">{editing ? "Save" : "Post"}</button></div> : <p className="mt-5 text-sm opacity-60">Sign in to join the conversation.</p>}
    <div className="mt-8 space-y-6">{roots.map((comment) => <CommentThread key={comment.id} comment={comment} replies={replies(comment.id)} onReply={() => { setReplyTo(comment.id); setEditing(null); }} onEdit={() => { setEditing(comment.id); setReplyTo(null); setBody(comment.body); }} />)}</div>
  </section>;
}

function CommentThread({ comment, replies, onReply, onEdit }: { comment: NoteComment; replies: NoteComment[]; onReply: () => void; onEdit: () => void }) {
  const [open, setOpen] = useState(false);
  const mine = currentUserId === comment.authorId;
  const { refresh } = useInktellaStore();
  return <div className="text-sm"><div className="flex gap-3"><div className="size-8 shrink-0 rounded-full border border-black/15 text-center leading-8">{comment.authorName.charAt(0)}</div><div className="min-w-0 flex-1"><div className="flex items-baseline gap-2"><strong>{comment.authorName}</strong>{comment.isAuthor && <span className="text-xs opacity-50">author</span>}<time className="text-xs opacity-45">{new Date(comment.createdAt).toLocaleDateString()}</time></div><p className="mt-1 whitespace-pre-wrap leading-relaxed">{comment.body}</p><div className="mt-2 flex gap-4 text-xs opacity-55"><button type="button" onClick={onReply}>Reply</button>{mine && <><button type="button" onClick={onEdit}><Pencil className="mr-1 inline size-3" />Edit</button><button type="button" onClick={async () => { await deleteComment({ data: { commentId: comment.id } }); await refresh(); }}><Trash2 className="mr-1 inline size-3" />Delete</button></>}<button type="button" onClick={async () => { await reportComment({ data: { commentId: comment.id } }); await refresh(); }}><Flag className="mr-1 inline size-3" />Report</button></div></div></div>{replies.length > 0 && <div className="ml-11 mt-3"> <button type="button" onClick={() => setOpen(!open)} className="text-xs opacity-60">{open ? "Hide" : "Show"} {replies.length} repl{replies.length === 1 ? "y" : "ies"}</button>{open && <div className="mt-4 space-y-4 border-l border-black/10 pl-4">{replies.map((reply) => <CommentThread key={reply.id} comment={reply} replies={[]} onReply={onReply} onEdit={onEdit} />)}</div>}</div>}</div>;
}
