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
- Identity is Clerk (`@clerk/clerk-react` client); `src/lib/d1.server.ts` verifies session tokens with `CLERK_SECRET_KEY` when set, else via the public JWKS — so self-hosted deploys without secrets still sign people in. Lovable Cloud/Supabase is connected but unused.
- All Inktella data lives in Cloudflare D1, reached only from server functions in `src/lib/inktella.functions.ts`; `d1()` prefers the Worker `DB` binding (self-hosted Cloudflare deploy), then the connector gateway (Lovable preview), then `CLOUDFLARE_API_TOKEN` — keeps tokens server-side and works on either host.
- Pages read synchronous arrays in `src/data/inktella.ts`, filled at startup by `hydrateInktella()` (`src/lib/inktella-store.tsx`); call `refresh()` after writes — avoids rewriting every route.
