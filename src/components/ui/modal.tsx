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
import { ScrollArea } from "./scroll-area";

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
          <DrawerContent className="pt-2   px-4">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className=" h-full">
          <ScrollArea className={`h-[${height}vh] pb-4`}>
          {children}
          </ScrollArea>
          </div>
          </DrawerContent>
        </Drawer>
      )}

    </>
  );
};
