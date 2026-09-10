import { SuccessModal } from "@/components/animation/successModal";
import Mt5AccountForm from "@/components/forms/mt5AccountForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModalStore } from "@/store/successModalUiStore";
import { useMt5UiStore } from "@/store/mt5uiStore";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Mt5ConnectComp from "./mt5ConnectComp";
import { useGetMt5AccList } from "@/hooks/useMt5";
import Mt5ListCards from "./mt5ListCards";
import { Loader2 } from "lucide-react";
import { Spinner } from "@heroui/react";
import { cn } from "@/lib/utils";

const MT5Card = () => {
  
  const { openModal, setOpenModal } = useMt5UiStore();
  const { data } = useModalStore();
  const { accounts, isLoading,setAccountType,length } = useGetMt5AccList();
  return (
    <>
      <SuccessModal>
        <div className=" flex-col md:hidden hidden bg-card rounded-[4px] p-4 gap-2">
          <div className="flex items-center gap-4">
            <p>Login ID:</p>
            <p>{data?.login}</p>
          </div>
          <div className="flex items-center gap-4">
            <p>Account Category:</p>
            <p>{data?.account_category}</p>
          </div>
          <div className="flex items-center gap-4">
            <p>First Name:</p>
            <p>{data?.first_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <p>Last Name:</p>
            <p>{data?.last_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <p>Investor Password:</p>
            <p>{data?.investor_password}</p>
          </div>
          <div className="flex items-center gap-4">
            <p>Master Password:</p>
            <p>{data?.master_password}</p>
          </div>
          <div className="flex items-center gap-4">
            <p>Created At:</p>
            <Badge>{data?.created_at}</Badge>
          </div>
        </div>
      </SuccessModal>
      <Modal
        title="Connect New Account"
        description="Connect your MT5 account to start trading"
        isOpen={openModal}
        height={80}
        onClose={() => setOpenModal(false)}
      >
        <div className="flex flex-col   gap-4">
          <Tabs defaultValue="Live">
            <TabsList className="w-full">
              <TabsTrigger className="w-full text-md" value="Live">
                Live
              </TabsTrigger>
              <TabsTrigger className="w-full text-md" value="Demo">
                Demo
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Live">
              <div className="flex flex-col pb-4 gap-4">
                <Mt5AccountForm type="Live" />
              </div>
            </TabsContent>
            <TabsContent value="Demo">
              <div className="flex flex-col pb-4  gap-4">
                <Mt5AccountForm type="Demo" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Modal>
      <div className="w-full h-full min-h-[300px]">
        {!isLoading &&
          (length > 0 ? (
            <Mt5ListCards accounts={accounts} setAccountType={setAccountType} />
          ) : (
            <Mt5ConnectComp />
          ))}
        {isLoading && (
          <div className="flex items-center justify-center h-[300px] w-full">
            <Spinner color="primary" size="lg" />
          </div>
        )}
      </div>
    </>
  );
};

export default MT5Card;
