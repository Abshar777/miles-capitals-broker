import { create } from "zustand";
import type { TGatewayProvider } from "@/api/coinsbay";

interface CoinsbayUiStore {
  value: string;
  setValue: (value: string) => void;
  // Gateway that owns the active intent (coinsbuy | unipayment)
  provider: TGatewayProvider;
  setProvider: (provider: TGatewayProvider) => void;
}

export const useCoinsbayUiStore = create<CoinsbayUiStore>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
  provider: "coinsbuy",
  setProvider: (provider) => set({ provider }),
}));
