import { create } from "zustand"

interface ModalState {
    isOpen: boolean
    title: string
    message: string
    openSuccessModal: (title: string, message: string) => void
    closeSuccessModal: () => void;
    data: any;
    setData: (data: any) => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    title: "",
    message: "",
    openSuccessModal: (title: string, message: string) => set({ isOpen: true, title, message }),
    closeSuccessModal: () => set({ isOpen: false, title: "", message: "" }),
    data: null,
    setData: (data: any) => set({ data }),

}))
