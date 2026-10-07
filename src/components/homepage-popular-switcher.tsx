import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Flame, Heart } from "lucide-react";
import { getPopularDecayedNotes, getNotepage, type Note } from "@/data/inktella";

export function HomepagePopularSwitcher() {
  const [popularNotes, setPopularNotes] = useState<Note[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const topNotes = getPopularDecayedNotes(8);
    setPopularNotes(topNotes);
  }, []);

  // Auto-switch mobile / active note every 5s if not paused
  useEffect(() => {
    if (popularNotes.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % popularNotes.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [popularNotes.length, isPaused]);

  if (popularNotes.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + popularNotes.length) % popularNotes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % popularNotes.length);
  };

  const currentMobileNote = popularNotes[currentIndex];
  const mobileNotepage = currentMobileNote ? getNotepage(currentMobileNote.notepage) : null;

  return (
    <div
      className="border-t border-border/60 bg-muted/30 px-3 py-2 text-sm select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        {/* Label Badge */}
        <div className="flex shrink-0 items-center gap-1.5 font-medium text-xs tracking-wider uppercase text-primary/90 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
          <Flame className="size-3.5 text-primary fill-primary/20" aria-hidden />
          <span>Popular Notes</span>
        </div>

        {/* Desktop View: Smooth switcher row displaying popular note titles */}
        <div className="hidden md:flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {popularNotes.map((note, idx) => {
            const np = getNotepage(note.notepage);
            const title = note.title.trim() || note.preview.slice(0, 35) || "Untitled Note";
            const isActive = idx === currentIndex;

            return (
              <Link
                key={note.id}
                to="/$notepage/notepage/$noteId"
                params={{ notepage: note.notepage, noteId: note.id }}
                onMouseEnter={() => setCurrentIndex(idx)}
                className={`group flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium transition-all duration-300 border ${
                  isActive
                    ? "bg-background text-foreground shadow-sm border-border scale-[1.02] ring-1 ring-primary/30"
                    : "text-muted-foreground hover:text-foreground border-transparent hover:bg-background/60"
                }`}
                title={`Read "${title}" by ${np?.name || note.notepage}`}
              >
                <span className="truncate max-w-[160px] lg:max-w-[200px]">{title}</span>
                {np && (
                  <span className="text-[10px] text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                    · {np.name}
                  </span>
                )}
                <span className="flex items-center gap-0.5 text-[10px] text-primary/80 font-normal">
                  <Heart className="size-2.5 fill-primary/40 text-primary" aria-hidden />
                  {note.likes}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile View: Displays one note title at a time with smooth transition and controls */}
        <div className="flex md:hidden flex-1 items-center justify-between gap-2 overflow-hidden">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            aria-label="Previous popular note"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex-1 overflow-hidden text-center">
            {currentMobileNote && (
              <Link
                to="/$notepage/notepage/$noteId"
                params={{ notepage: currentMobileNote.notepage, noteId: currentMobileNote.id }}
                className="inline-flex items-center justify-center gap-1.5 max-w-full text-xs font-medium text-foreground hover:text-primary transition-colors py-0.5"
              >
                <span className="truncate">
                  {currentMobileNote.title.trim() ||
                    currentMobileNote.preview.slice(0, 30) ||
                    "Untitled Note"}
                </span>
                {mobileNotepage && (
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    ({mobileNotepage.name})
                  </span>
                )}
                <span className="inline-flex items-center gap-0.5 text-[10px] text-primary shrink-0">
                  <Heart className="size-2.5 fill-primary/40 text-primary" aria-hidden />
                  {currentMobileNote.likes}
                </span>
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            aria-label="Next popular note"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Dots indicator for mobile */}
          <div className="flex items-center gap-1 shrink-0 pl-1">
            {popularNotes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`size-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-primary w-3"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
