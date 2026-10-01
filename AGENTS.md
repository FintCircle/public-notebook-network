<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Identity is Clerk (`@clerk/clerk-react` client, `@clerk/backend` token verification in `src/lib/d1.server.ts`); Lovable Cloud/Supabase is connected but unused — owner chose Clerk + D1.
- All Inktella data lives in Cloudflare D1, reached only from server functions in `src/lib/inktella.functions.ts` via the Cloudflare connector gateway — keeps tokens server-side.
- Pages read synchronous arrays in `src/data/inktella.ts`, filled at startup by `hydrateInktella()` (`src/lib/inktella-store.tsx`); call `refresh()` after writes — avoids rewriting every route.
