import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({ noteId: z.string().min(1), parentId: z.string().optional(), body: z.string().trim().min(1).max(2000) });
export const addComment = createServerFn({ method: "POST" }).validator(input).handler(async ({ data }) => { const { d1 } = await import("./d1.server"); const id = crypto.randomUUID(); await d1("INSERT INTO note_comments (id,note_id,author_id,body,parent_id) VALUES (?,?,?,?,?)", [id, data.noteId, "anonymous", data.body, data.parentId ?? null]); return { id }; });
export const editComment = createServerFn({ method: "POST" }).validator(z.object({ commentId: z.string(), body: z.string().trim().min(1).max(2000) })).handler(async ({ data }) => { const { d1 } = await import("./d1.server"); await d1("UPDATE note_comments SET body=?, updated_at=datetime('now') WHERE id=?", [data.body, data.commentId]); return { ok: true }; });
export const deleteComment = createServerFn({ method: "POST" }).validator(z.object({ commentId: z.string() })).handler(async ({ data }) => { const { d1 } = await import("./d1.server"); await d1("UPDATE note_comments SET deleted_at=datetime('now') WHERE id=?", [data.commentId]); return { ok: true }; });
export const reportComment = createServerFn({ method: "POST" }).validator(z.object({ commentId: z.string() })).handler(async ({ data }) => { const { d1 } = await import("./d1.server"); await d1("UPDATE note_comments SET reported_at=datetime('now') WHERE id=?", [data.commentId]); return { ok: true }; });
