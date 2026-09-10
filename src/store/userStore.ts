import { User } from "next-auth";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  isKYCVerified: boolean;
  setUser: (user: User) => void;
  setIsKYCVerified: (isKYCVerified: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isKYCVerified: false,
  setUser: (user) => set({ user }),
  setIsKYCVerified: (isKYCVerified) => set({ isKYCVerified }),
}));