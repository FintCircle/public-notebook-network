// Turns Markdown-style shortcuts (## heading, **bold**, - list…) into real formatting.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function inlineMd(s: string) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
}

/** Plain text (e.g. pasted) → HTML. */
export function markdownToHtml(text: string) {
  const out: string[] = [];
  let list: "ul" | "ol" | null = null;
  const close = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd();
    const t = inlineMd(esc(line.trim()));
    let m: RegExpMatchArray | null;
    if (!line.trim()) close();
    else if ((m = line.match(/^\s*(#{1,6})\s+(.*)$/))) {
      close();
      const lvl = m[1]!.length <= 2 ? 2 : 3;
      out.push(`<h${lvl}>${inlineMd(esc(m[2]!))}</h${lvl}>`);
    } else if ((m = line.match(/^\s*[-*+]\s+(.*)$/))) {
      if (list !== "ul") (close(), out.push("<ul>"), (list = "ul"));
      out.push(`<li>${inlineMd(esc(m[1]!))}</li>`);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      if (list !== "ol") (close(), out.push("<ol>"), (list = "ol"));
      out.push(`<li>${inlineMd(esc(m[1]!))}</li>`);
    } else if ((m = line.match(/^\s*>\s?(.*)$/))) {
      close();
      out.push(`<blockquote>${inlineMd(esc(m[1]!))}</blockquote>`);
    } else if (/^\s*(---|\*\*\*)\s*$/.test(line)) {
      close();
      out.push("<hr />");
    } else {
      close();
      out.push(`<p>${t}</p>`);
    }
  }
  close();
  return out.join("");
}

/** Normalise editor HTML: convert leftover Markdown in text-only blocks. Browser only. */
export function normalizeEditorHtml(root: HTMLElement) {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("img[src^='blob:']").forEach((img) => img.closest("figure")?.remove() ?? img.remove());
  const nodes = Array.from(clone.childNodes);
  for (const node of nodes) {
    const isText = node.nodeType === Node.TEXT_NODE;
    const el = node as HTMLElement;
    const isPlainBlock =
      !isText && (el.tagName === "DIV" || el.tagName === "P") && !el.querySelector("img,figure,pre,ul,ol,h2,h3");
    if (!isText && !isPlainBlock) continue;
    if (!isText) el.querySelectorAll("br").forEach((b) => b.replaceWith("\n"));
    const text = node.textContent ?? "";
    if (!/(^|\n)\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|>\s?|---)|\*\*|`|\]\(/.test(text)) continue;
    const tpl = document.createElement("template");
    tpl.innerHTML = markdownToHtml(text);
    node.replaceWith(tpl.content);
  }
  return clone.innerHTML.trim();
}
