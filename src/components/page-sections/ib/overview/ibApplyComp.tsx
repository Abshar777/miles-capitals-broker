import { Icon } from "@/components/ui/icon";
import IBApplyForm from "@/components/forms/ibApplyForm";
import { Modal } from "@/components/ui/modal";
import { useIbUiStore } from "@/store/ibUiStore";
import React from "react";

/** Reference empty state: apply for an IB plan. */
const IBApplyComp = () => {
  const { setOpenModal, openModal } = useIbUiStore();
  return (
    <>
      <div className="flex h-full min-h-[360px] w-full flex-col text-center items-center justify-center gap-3 rounded-[4px] border border-border">
        <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-muted-foreground">
          <Icon name="users-16" size={16} />
        </span>
        <h1 className="text-[24px] leading-8 font-medium text-foreground">No IB plan yet</h1>
        <p className="text-[15px] leading-6 text-muted-foreground max-w-[400px]">
          Apply for an IB plan to get your partner link, track referred clients and earn rewards. Applications are
          reviewed by our team.
        </p>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="mt-2 h-10 rounded-[4px] bg-primary px-6 text-[13.33px] text-black outline outline-1 -outline-offset-1 outline-transparent hover:brightness-110 hover:outline-primary transition-[filter,outline-color] duration-150 ease-in-out"
        >
          Apply for IB Plan
        </button>
      </div>
      <Modal
        title="Apply for IB Plan"
        description="Applications are reviewed by our team"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className="flex flex-col gap-4">
          <IBApplyForm />
        </div>
      </Modal>
    </>
  );
};

export default IBApplyComp;
