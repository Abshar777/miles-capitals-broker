"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerHeader } from "./drawer";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  height?: number;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  height,
  onClose,
  children,
}) => {
  const isMobile = useIsMobile();
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <>
      {!isMobile && (
        <Dialog open={isOpen} onOpenChange={onChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <>{children}</>
          </DialogContent>
        </Dialog>
      )}
      {isMobile&&(
        <Drawer shouldScaleBackground={true} open={isOpen} onOpenChange={onChange}>
          {/* Height is an inline style: Tailwind cannot generate classes built at runtime
              (h-[${height}vh] never existed), and dvh excludes the mobile address bar. */}
          <DrawerContent
            className="pt-2 px-4"
            style={{ maxHeight: `${height ?? 90}dvh` }}
          >
          <DrawerHeader className="shrink-0">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {/* Scrolls by touch; data-vaul-no-drag keeps a swipe here scrolling instead of closing the drawer. */}
          <div
            data-vaul-no-drag
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
          >
          {children}
          </div>
          </DrawerContent>
        </Drawer>
      )}

    </>
  );
};
