import { User } from "next-auth";
import { create } from "zustand";

interface Mt5UiStore {
 openModal: boolean;
 setOpenModal: (openModal: boolean) => void;
 
}

export const useMt5UiStore = create<Mt5UiStore>((set) => ({
  openModal: false,
  setOpenModal: (openModal) => set({ openModal }),
 
}));