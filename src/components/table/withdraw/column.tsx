"use client";
import { StatusDot } from "@/components/ui/status-dot";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@heroui/react";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "sonner";
import { useCancelWithdrawal } from "@/hooks/useWithdraw";
import { statusBadge } from "@/constants/curency";
import { useEffect } from "react";
import { TWithdrawHistoryApiResponse } from "@/types/api.response";
import { formatIST } from "@/lib/utils";

export type Cloumn = TWithdrawHistoryApiResponse & {
  rowNumber: number;
};

export const columns: ColumnDef<Cloumn>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => (
      <div className="text-start">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "withdrawal_id",
    header: "Withdrawal ID",
    cell: ({ row }) => (
      <div className="text-start">
        {row.original.withdrawal_id}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-start">
        {row.original.amount} {row.original.currency}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase();
      return (
<StatusDot status={status === "payout" ? "completed" : row.original.status} size="md" />
      );
    },
  },
  {
    accessorKey: "group_name",
    header: "Withdrawal Name",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const withdrawal = row.original;

      const formatDate = (date?: string) => {
        if (!date) return "-";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "-" : formatIST(date);
      };

      return (
        <>
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            View Details
          </Button>

          <Modal
            title="Withdrawal Details"
            description={`Withdrawal Details of #${withdrawal.withdrawal_id}`}
            isOpen={open}
            onClose={() => setOpen(false)}
            height={60}
          >
            <div className="md:grid flex flex-col bg-card rounded-lg md:p-4 p-2 md:grid-cols-2 gap-2 md:gap-4">
              
              {/* ID */}
              <p className="col-span-2 flex items-center gap-2">
                ID:
                <span className="text-primary">
                  {withdrawal.withdrawal_id}
                </span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      withdrawal.withdrawal_id
                    );
                    toast.success("Withdrawal ID copied");
                  }}
                  className="scale-90"
                >
                  <MdOutlineContentCopy />
                </Button>
              </p>

              {/* Amount */}
              <p>
                Amount:
                <span className="text-primary ml-1">
                  {withdrawal.amount} {withdrawal.currency}
                </span>
              </p>

              {/* Status */}
              <p>
                Status:
                <Badge
                  variant={
                    statusBadge[
                      withdrawal.status?.toLowerCase() as keyof typeof statusBadge
                    ] as any
                  }
                  className="text-xs ml-1"
                >
                  {withdrawal.status}
                </Badge>
              </p>

              {/* Method */}
              <p className="col-span-2">
                Withdrawal Method:
                <span className="text-primary ml-1">
                  {withdrawal.group_name}
                </span>
              </p>

              {/* Dynamic Details */}
              {withdrawal.details &&
                Object.entries(withdrawal.details).map(([key, value]) => (
                  <p className="col-span-2" key={key}>
                    {key}:
                    <span className="text-primary ml-1">
                      {value || "-"}
                    </span>
                  </p>
                ))}

              {/* Dates */}
              <p className="col-span-2">
                Created At:
                <span className="text-primary ml-1">
                  {formatDate(withdrawal.created_at)}
                </span>
              </p>

              <p className="col-span-2">
                Completed At:
                <span className="text-primary ml-1">
                  {formatDate(withdrawal.completed_at)}
                </span>
              </p>

              {/* Admin Notes */}
              {withdrawal.admin_notes && (
                <Alert className="mt-4 col-span-2">
                  <AlertTitle>Admin Notes</AlertTitle>
                  <AlertDescription>
                    {withdrawal.admin_notes}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Modal>
        </>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div className="text-start">
          {isNaN(date.getTime())
            ? "-"
            : formatIST(row.original.created_at, { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Cancel",
    cell: ({ row }) => {
      const {
        mutate,
        isPending,
        isSuccess,
      } = useCancelWithdrawal();

      const closeRef = React.useRef<HTMLButtonElement>(null);

      useEffect(() => {
        if (isSuccess) {
          closeRef.current?.click();
          toast.success("Withdrawal cancelled successfully");
        }
      }, [isSuccess]);

      const isPendingStatus =
        row.original.status?.toLowerCase() === "pending";

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={!isPendingStatus}
              variant="outline"
            >
              Cancel
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Withdrawal</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this withdrawal?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose ref={closeRef as any}>
                <Button
                  variant="outline"
                  disabled={isPending}
                  className="w-full"
                >
                  Close
                </Button>
              </DialogClose>

              <Button
                variant="destructive"
                disabled={isPending}
                onClick={() =>
                  mutate(row.original.withdrawal_id)
                }
              >
                Confirm
                {isPending && (
                  <Spinner size="sm" className="ml-2" />
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];