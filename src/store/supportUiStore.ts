import { User } from "next-auth";
import { create } from "zustand";

interface SupportUiStore {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  ticketId: string | null;
  setTicketId: (ticket: string) => void;
}

export const useSupportUiStore = create<SupportUiStore>((set) => ({
  openModal: false,
  setOpenModal: (openModal) => set({ openModal }),
  ticketId: null,
  setTicketId: (ticketId) => set({ ticketId }),
}));
