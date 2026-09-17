# Notepage creation, owner area, legal pages, and network escape hatch

## What will change

- Add **Privacy**, **Terms**, and **Guidelines** links beneath the homepage and create a dedicated page for each.
- Change **Start a Notepage** and **Start another Notepage** so they open a Notepage creation flow instead of the note editor.
- Build the creation flow in three calm steps:
  1. Name the Notepage and add its description.
  2. Customize its background and type.
  3. Continue into the owner's Notepages area.
- Add a dedicated **My Notepages** area listing owned notebooks, note counts, public-view links, and an **Add note** action for each notebook.
- Make **Note down** ask “Where are you noting this down?” when there is more than one owned Notepage, then open the editor for the chosen one.
- Keep public Notepages free of the normal Inktella header.
- Add a small fixed Inktella mark to every public Notepage. Tapping it opens a compact sheet with:
  - Note down
  - Notella
  - Notetags
  - My Notepages
  - Find
- Change the bottom attribution on public Notepages to **part of inktella ↗**.

## Interaction and visual treatment

- The network mark will remain subtle and use the active Notepage's colors without competing with the owner's identity.
- On mobile, the menu will slide up from the bottom; on larger screens it will open as a small corner panel.
- Notebook selection and creation will stay typography-first, mobile-friendly, and consistent with the existing Inktella design.
- The creation preview will update while the owner chooses background and type.

## Technical details

- Add routes for `/privacy`, `/terms`, `/guidelines`, `/notepages/new`, `/notepages`, and `/notetags`.
- Keep the current front-end-only approach: creation and note actions will demonstrate the complete flow with sample account data, without accounts, payment, or permanent saving.
- Use typed TanStack links and search parameters so the selected Notepage reaches the editor correctly.
- Reuse the existing dialog and button system, Notepage theme tokens, and mock notebook data.
- Add unique metadata to every new page and verify the flows at mobile and desktop sizes.
