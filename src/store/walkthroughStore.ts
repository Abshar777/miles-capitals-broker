"use client";
import { create } from "zustand";

const STORAGE_KEY = "miles_tour_done";

interface WalkthroughStore {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  showWelcome: boolean;
  initTour: () => void;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  replayTour: () => void;
}

export const useWalkthroughStore = create<WalkthroughStore>((set, get) => ({
  isActive: false,
  currentStep: 0,
  totalSteps: 13,
  showWelcome: false,

  initTour: () => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // slight delay so the sidebar has rendered
      setTimeout(() => set({ showWelcome: true }), 1200);
    }
  },

  startTour: () => set({ isActive: true, currentStep: 0, showWelcome: false }),

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      get().completeTour();
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },

  skipTour: () => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "true");
    set({ isActive: false, showWelcome: false, currentStep: 0 });
  },

  completeTour: () => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "true");
    set({ isActive: false, showWelcome: false, currentStep: 0 });
  },

  replayTour: () => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    set({ showWelcome: true, isActive: false, currentStep: 0 });
  },
}));
