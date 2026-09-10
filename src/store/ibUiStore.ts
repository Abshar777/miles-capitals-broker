import { User } from "next-auth";
import { create } from "zustand";

interface IbUiStore {
    openModal: boolean;
    setOpenModal: (openModal: boolean) => void;

}

export const useIbUiStore = create<IbUiStore>((set) => ({
    openModal: false,
    setOpenModal: (openModal) => set({ openModal }),

}));