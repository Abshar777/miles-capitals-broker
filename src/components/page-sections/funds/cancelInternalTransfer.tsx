"use client";
import { useCancelWalletTransfer } from "@/hooks/useInternalTransfer";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@heroui/react";
import { useEffect, useRef } from "react";

const CancelInternalTransfer = ({status,id,onSuccess=() => {}}: {status: string,id: string,onSuccess?: () => void}) => {
  const {
    mutate,
    isPending,
    error,
    isSuccess,
  } = useCancelWalletTransfer();
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isSuccess && ref.current) {
      ref.current?.click();
      onSuccess();
    }
  }, [isSuccess]);

  return (
    <Dialog>
      <DialogTrigger className="w-full " disabled={status !== "pending"}>
        <Button
          disabled={status !== "pending"}
          color="outline"
          className="w-full"
        >
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Wallet Transfer</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this withdrawal?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose ref={ref as any} className="md:w-auto w-full" >
            <Button
              variant={"outline"}
              disabled={isPending}
              color="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant={"destructive"}
            disabled={isPending}
            onClick={() => mutate(id)}
            color="primary"
            className=""
          >
            Confirm
            {isPending && (
              <Spinner
                size="sm"
                className="text-primary-foreground"
                color="white"
              />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelInternalTransfer;
