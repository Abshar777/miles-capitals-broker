"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "sonner";

import { TDepositHistoryApiResponse } from "@/types/api.response";
import { statusBadge } from "@/constants/curency";
import { copyToClipboard, formatIST } from "@/lib/utils";

export type Cloumn = TDepositHistoryApiResponse & {
  rowNumber: number;
};

export const useDepositColumns = () => {
  const [isOpenInfo, setIsOpenInfo] = React.useState(false);
  const [dataInfo, setDataInfo] =
    React.useState<TDepositHistoryApiResponse | null>(null);

  const columns: ColumnDef<Cloumn>[] = [
    {
      accessorKey: "rowNumber",
      header: "#",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "deposit_id",
      header: "Deposit ID",
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(row.original.deposit_id);
            toast.success("Deposit ID copied");
          }}
        >
          {row.original.deposit_id}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Deposited Amount",
      cell: ({ row }) => (
        <div>
          {row.original.amount} {row.original.currency}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="link"
          className="text-[15px] px-0"
          onClick={() => {
            setDataInfo(row.original);
            setIsOpenInfo(true);
          }}
        >
          View Details
        </Button>
      ),
    },
    {
      accessorKey: "receive_amount",
      header: "Received Amount",
      cell: ({ row }) => (
        <div>
          {row.original.receive_amount} USD
        </div>
      ),
    },
    {
      accessorKey: "commission_amount",
      header: "Commission",
      cell: ({ row }) => (
        <div>
          {row.original.commission_amount != null
            ? row.original.commission_amount.toFixed(2) + " USD"
            : "—"}
        </div>
      ),
    },
    {
      accessorKey: "payment_mode",
      header: "Payment Mode",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusDot status={row.original?.status} size="md" />
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <div>
          {formatIST(row.original.created_at, { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      ),
    },

  ];

  const DetailsModal = (
    <Modal
      height={20}
      description=""
      isOpen={isOpenInfo}
      onClose={() => setIsOpenInfo(false)}
      title={`Deposit Info of ${dataInfo?.deposit_id}`}
    >
      <div className="md:grid flex flex-col bg-card rounded-lg md:p-4 p-2 md:grid-cols-2 gap-4">
        <p className="col-span-2 flex items-center gap-2">
          ID:
          <span className="text-primary">{dataInfo?.deposit_id}</span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => copyToClipboard(dataInfo?.deposit_id ?? "")}
          >
            <MdOutlineContentCopy size={16} />
          </Button>
        </p>

        <p>
          Deposited Amount:
          <span className="text-primary ml-1">
            {dataInfo?.amount} {dataInfo?.currency}
          </span>
        </p>

        <p>
          Received Amount:
          <span className="text-primary ml-1">
            {dataInfo?.receive_amount} {dataInfo?.currency}
          </span>
        </p>

        {dataInfo?.commission_amount != null && (
          <p>
            Commission:
            <span className="text-primary ml-1">
              {dataInfo.commission_amount.toFixed(2)} USD
            </span>
          </p>
        )}

        <p>
          Status:
          <Badge
            className="ml-2"
            variant={
              dataInfo?.status === "pending"
                ? "warning"
                : dataInfo?.status === "approved"
                  ? "success"
                  : "destructive"
            }
          >
            {dataInfo?.status}
          </Badge>
        </p>

        <p>
          Payment Mode:
          <span className="text-primary ml-1">
            {dataInfo?.payment_mode}
          </span>
        </p>

        <p>
          Balance Before:
          <span className="text-primary ml-1">
            {dataInfo?.balance_before}
          </span>
        </p>

        <p>
          Balance After:
          <span className="text-primary ml-1">
            {dataInfo?.balance_after}
          </span>
        </p>

        <p className="col-span-2">
          Created At:
          <span className="text-primary ml-1">
            {formatIST(dataInfo?.created_at)}
          </span>
        </p>

        {dataInfo?.approved_at && (
          <p className="col-span-2">
            Approved At:
            <span className="text-primary ml-1">
              {formatIST(dataInfo.approved_at)}
            </span>
          </p>
        )}

        {dataInfo?.created_by_admin_email && (
          <p className="col-span-2">
            Approved By:
            <span className="text-primary ml-1">
              {dataInfo.created_by_admin_email}
            </span>
          </p>
        )}

        {dataInfo?.admin_notes && (
          <Alert className="col-span-2">
            <AlertTitle>Admin Notes</AlertTitle>
            <AlertDescription>
              {dataInfo.admin_notes}
            </AlertDescription>
          </Alert>
        )}

        {/* Proof Image */}
        {dataInfo?.proof_deposit_image && (
          <div className="col-span-2">
            <p className="mb-2 font-medium">Proof Image:</p>
            <img
              src={dataInfo.proof_deposit_image}
              alt="Proof"
              className="rounded-lg cursor-pointer border max-h-60"
              onClick={() =>
                window.open(dataInfo.proof_deposit_image, "_blank")
              }
            />
          </div>
        )}
      </div>
    </Modal>
  );

  return { columns, DetailsModal };
};