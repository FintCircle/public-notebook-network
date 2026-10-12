import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { Editor } from "@tiptap/react";

export type SlashMenuItem = {
  title: string;
  description: string;
  icon: string;
  command: (editor: Editor) => void;
};

export const SlashCommands = Extension.create({
  name: "slashCommands",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("slashCommands"),
        // Handling keyboard & query listening handled in editor wrapper UI or custom plugin state
      }),
    ];
  },
});
