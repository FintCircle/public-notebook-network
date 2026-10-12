import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RemoveFormatting,
} from "lucide-react";
import { useState } from "react";

export function FloatingToolbar({ editor }: { editor: Editor | null }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const openLinkModal = () => {
    const existing = editor.getAttributes("link")["href"] as string | undefined;
    setLinkUrl(existing || "");
    setShowLinkInput(true);
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150, placement: "top" }}
      shouldShow={({ editor, state }) => {
        const { selection } = state;
        const { empty } = selection;
        // Do not show bubble menu if image node or selection empty
        if (empty || editor.isActive("customImage")) {
          return false;
        }
        return true;
      }}
      className="flex max-w-[90vw] items-center gap-0.5 overflow-x-auto rounded-lg border border-border bg-popover/95 p-1 shadow-lg backdrop-blur-md dark:bg-popover/95"
    >
      {showLinkInput ? (
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs">
          <input
            type="text"
            placeholder="Paste URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setLink();
              } else if (e.key === "Escape") {
                setShowLinkInput(false);
              }
            }}
            className="w-48 rounded border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
            autoFocus
          />
          <button
            type="button"
            onClick={setLink}
            className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:opacity-90"
          >
            Set
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("bold") ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("italic") ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("underline") ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("strike") ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <span className="mx-0.5 h-4 w-px bg-border" />

          <button
            type="button"
            title="Heading 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("heading", { level: 1 }) ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("heading", { level: 2 }) ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("heading", { level: 3 }) ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <span className="mx-0.5 h-4 w-px bg-border" />

          <button
            type="button"
            title="Bullet list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("bulletList") ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Numbered list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("orderedList") ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("blockquote") ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <Quote className="h-4 w-4" />
          </button>

          <span className="mx-0.5 h-4 w-px bg-border" />

          <button
            type="button"
            title="Align Left"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive({ textAlign: "left" }) ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Align Center"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive({ textAlign: "center" }) ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Align Right"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive({ textAlign: "right" }) ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <AlignRight className="h-4 w-4" />
          </button>

          <span className="mx-0.5 h-4 w-px bg-border" />

          <button
            type="button"
            title="Link"
            onClick={openLinkModal}
            className={`rounded p-1.5 hover:bg-accent ${editor.isActive("link") ? "bg-accent text-accent-foreground font-bold" : "text-popover-foreground/80"}`}
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Clear formatting"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="rounded p-1.5 text-popover-foreground/80 hover:bg-accent"
          >
            <RemoveFormatting className="h-4 w-4" />
          </button>
        </>
      )}
    </BubbleMenu>
  );
}
