import { create } from "zustand";

type SidebarStore = {
  collapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  set: (collapsed: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  open: () => set({ collapsed: false }),
  close: () => set({ collapsed: true }),
  set: (collapsed) => set({ collapsed }),
}));
