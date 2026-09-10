import { create } from "zustand";

interface CoinsbayUiStore {
  value: string;
  setValue: (value: string) => void;
}

export const useCoinsbayUiStore = create<CoinsbayUiStore>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
}));
