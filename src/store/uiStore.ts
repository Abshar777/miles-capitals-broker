import { create } from "zustand";

interface UiStore {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
    color: string;
    setColor: (color: string) => void;
  }


  export const useUiStore = create<UiStore>((set) => ({
    theme: "light" as "light" | "dark",
    setTheme: (theme: "light" | "dark") => set({ theme }),
    color: "white",
    setColor: (color) => set({ color }),
  }));