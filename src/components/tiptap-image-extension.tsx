import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useState } from "react";
import { AlignLeft, AlignCenter, Maximize2, Trash2, Replace } from "lucide-react";

export type ImageAlignment = "left" | "center" | "full";

export const CustomImage = Image.extend({
  name: "customImage",

  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: "",
        parseHTML: (element) => element.getAttribute("alt") || "",
        renderHTML: (attributes) => ({ alt: attributes["alt"] as string }),
      },
      caption: {
        default: "",
        parseHTML: (element) => {
          const figcaption = element.closest("figure")?.querySelector("figcaption");
          return figcaption ? figcaption.innerText : element.getAttribute("data-caption") || "";
        },
        renderHTML: (attributes) => ({ "data-caption": attributes["caption"] as string }),
      },
      alignment: {
        default: "center",
        parseHTML: (element) => {
          const figure = element.closest("figure");
          if (figure?.classList.contains("align-left")) return "left";
          if (figure?.classList.contains("align-full")) return "full";
          return element.getAttribute("data-alignment") || "center";
        },
        renderHTML: (attributes) => ({ "data-alignment": attributes["alignment"] as string }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});

function ImageComponent({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const [isEditingAlt, setIsEditingAlt] = useState(false);
  const src = (node.attrs["src"] as string) || "";
  const alt = (node.attrs["alt"] as string) || "";
  const caption = (node.attrs["caption"] as string) || "";
  const alignment = ((node.attrs["alignment"] as ImageAlignment) || "center") as ImageAlignment;

  const handleReplace = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          updateAttributes({ src: reader.result, alt: file.name.replace(/\.[^.]+$/, "") });
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const alignClass =
    alignment === "left"
      ? "float-left mr-6 mb-4 max-w-xs align-left"
      : alignment === "full"
        ? "w-full my-6 align-full"
        : "mx-auto my-6 max-w-xl text-center align-center";

  return (
    <NodeViewWrapper className={`custom-image-node group relative ${alignClass}`}>
      <figure className="relative inline-block w-full">
        <div
          className={`relative overflow-hidden rounded-md transition-ring ${
            selected ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
        >
          <img
            src={src}
            alt={alt}
            className="h-auto w-full max-w-full rounded-md object-contain transition-all"
            loading="lazy"
          />

          {/* Quick Controls overlay on hover / selection */}
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-background/90 p-1 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 dark:bg-popover/90">
            <button
              type="button"
              title="Align Left"
              onClick={() => updateAttributes({ alignment: "left" })}
              className={`rounded p-1 text-xs hover:bg-accent ${alignment === "left" ? "bg-accent text-accent-foreground font-bold" : ""}`}
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Align Center"
              onClick={() => updateAttributes({ alignment: "center" })}
              className={`rounded p-1 text-xs hover:bg-accent ${alignment === "center" ? "bg-accent text-accent-foreground font-bold" : ""}`}
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Full Width"
              onClick={() => updateAttributes({ alignment: "full" })}
              className={`rounded p-1 text-xs hover:bg-accent ${alignment === "full" ? "bg-accent text-accent-foreground font-bold" : ""}`}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <span className="h-3 w-px bg-border" />
            <button
              type="button"
              title="Replace image"
              onClick={handleReplace}
              className="rounded p-1 text-xs hover:bg-accent"
            >
              <Replace className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Delete image"
              onClick={deleteNode}
              className="rounded p-1 text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Caption editable input */}
        <div className="mt-1.5 text-center">
          <input
            type="text"
            value={caption}
            placeholder="Write a caption…"
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            className="w-full bg-transparent text-center text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/40 focus:text-foreground"
          />
        </div>

        {/* Alt text editor toggle */}
        <div className="mt-0.5 text-center">
          {isEditingAlt ? (
            <div className="inline-flex items-center gap-1.5 text-xs">
              <input
                type="text"
                value={alt}
                placeholder="Alternative text (for accessibility)"
                onChange={(e) => updateAttributes({ alt: e.target.value })}
                className="rounded border border-border px-2 py-0.5 text-xs outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setIsEditingAlt(false)}
                className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                Done
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingAlt(true)}
              className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground"
            >
              {alt ? `Alt: ${alt}` : "+ Add alt text"}
            </button>
          )}
        </div>
      </figure>
    </NodeViewWrapper>
  );
}
