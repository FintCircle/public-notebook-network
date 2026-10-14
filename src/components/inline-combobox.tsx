import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

export function InlineCombobox({
  label,
  value,
  options,
  placeholder,
  open,
  onOpenChange,
  onChange,
  selectedValues,
  searchable = true,
}: {
  label: string;
  value: string;
  options: Option[];
  placeholder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (value: string) => void;
  selectedValues?: string[];
  searchable?: boolean;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? options.filter((option) => option.label.toLowerCase().includes(normalized))
      : options;
  }, [options, query]);

  useEffect(() => {
    if (open && searchable) inputRef.current?.focus();
    if (!open) {
      setQuery("");
      setHighlightedIndex(0);
    }
  }, [open, searchable]);

  function select(option: Option) {
    onChange(option.value);
    onOpenChange(false);
  }

  return (
    <div className="relative grid gap-2 text-sm font-medium">
      <span id={`${id}-label`}>
        {label} <span className="font-normal text-muted-foreground">required</span>
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-labelledby={`${id}-label`}
        onClick={() => onOpenChange(!open)}
        className="flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-left outline-none transition-colors hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={cn(!selected && "text-muted-foreground")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") onOpenChange(false);
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setHighlightedIndex((index) => Math.min(index + 1, filtered.length - 1));
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setHighlightedIndex((index) => Math.max(index - 1, 0));
                  }
                  if (event.key === "Enter" && filtered[highlightedIndex]) {
                    event.preventDefault();
                    select(filtered[highlightedIndex]);
                  }
                }}
                placeholder={`Search ${label.toLowerCase()}...`}
                aria-label={`Search ${label.toLowerCase()}`}
                className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}
          <div
            id={`${id}-listbox`}
            role="listbox"
            aria-label={label}
            className="max-h-[min(16rem,calc(100dvh-14rem))] overflow-y-auto p-1 overscroll-contain"
          >
            {filtered.length ? (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => select(option)}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-muted focus-visible:bg-muted",
                    filtered.indexOf(option) === highlightedIndex && "bg-muted",
                  )}
                >
                  <span>{option.label}</span>
                  {(selectedValues
                    ? selectedValues.includes(option.value)
                    : option.value === value) && <Check aria-hidden className="size-4" />}
                </button>
              ))
            ) : (
              <p className="px-3 py-5 text-center text-sm text-muted-foreground">
                No matches found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function InlineTagInput({
  value,
  onChange,
  suggestions,
  open,
  onOpenChange,
}: {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const tags = value.split(/[\s,]+/).filter(Boolean);
  const filtered = suggestions
    .filter((tag) => !tags.includes(`#${tag}`) && tag.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    if (!open) setQuery("");
  }, [open]);

  function addTag(tag: string) {
    const next = tags.includes(`#${tag}`) ? tags : [...tags, `#${tag}`];
    onChange(next.join(" "));
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="relative grid gap-2 text-sm font-medium">
      <label htmlFor="notetags">
        Tags <span className="font-normal text-muted-foreground">optional</span>
      </label>
      <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-transparent px-3 py-1.5 focus-within:border-foreground">
        <input
          id="notetags"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setQuery(
              event.target.value
                .split(/[\s,]+/)
                .pop()
                ?.replace(/^#/, "") ?? "",
            );
          }}
          onFocus={() => onOpenChange(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onOpenChange(false);
            if (event.key === "Enter" && filtered[0]) {
              event.preventDefault();
              addTag(filtered[0]);
            }
          }}
          placeholder="#personal-project #draft"
          className="min-w-0 flex-1 bg-transparent py-1 outline-none placeholder:text-muted-foreground"
          ref={inputRef}
        />
      </div>
      {open && filtered.length > 0 && (
        <div
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-[min(12rem,calc(100dvh-14rem))] overflow-y-auto rounded-xl border border-border bg-background p-1 shadow-lg"
          role="listbox"
          aria-label="Suggested tags"
        >
          {filtered.map((tag) => (
            <button
              key={tag}
              type="button"
              role="option"
              onClick={() => addTag(tag)}
              className="flex min-h-10 w-full items-center rounded-lg px-3 py-2 text-left text-sm hover:bg-muted focus-visible:bg-muted"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type { Option as InlineComboboxOption };
