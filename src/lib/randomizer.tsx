import { createContext, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { notes } from "@/data/inktella";
import { Shuffle } from "lucide-react";

const RandomizerContext = createContext<{ active: boolean; randomize: () => void }>({
  active: false,
  randomize: () => undefined,
});

export function RandomizerProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const location = useLocation();

  function randomize() {
    const current = location.pathname.match(/^\/([^/]+)\/notepage\/([^/]+)/)?.[2];
    const choices = notes.filter((note) => note.id !== current);
    const note = choices[Math.floor(Math.random() * choices.length)];
    if (!note) return;
    setActive(true);
    navigate({
      to: "/$notepage/notepage/$noteId",
      params: { notepage: note.notepage, noteId: note.id },
    });
  }

  const value = useMemo(() => ({ active, randomize }), [active, location.pathname]);
  return <RandomizerContext.Provider value={value}>{children}</RandomizerContext.Provider>;
}

export function useRandomizer() {
  return useContext(RandomizerContext);
}

export function RandomizerButton() {
  const { active, randomize } = useRandomizer();
  const location = useLocation();
  const isNote = /^\/[^/]+\/notepage\/[^/]+/.test(location.pathname);
  if (!active || !isNote) return null;

  return (
    <button
      type="button"
      onClick={randomize}
      aria-label="Open another random note"
      title="Another note, chosen by chaos"
      className="fixed bottom-6 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full border border-border bg-background/90 text-primary shadow-xl backdrop-blur transition-transform hover:rotate-12 hover:scale-105"
    >
      <Shuffle aria-hidden className="size-6" />
      <span className="sr-only">Another random note</span>
    </button>
  );
}
