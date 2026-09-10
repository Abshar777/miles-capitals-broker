import React from "react";
import { Form, FormField } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useDeposit } from "@/hooks/useDeposit";
import FormGeneratorV2 from "../global/form-generator/v2";
import {
  FaArrowRight,
  FaDollarSign,
  FaProductHunt,
  FaTelegram,
  FaUpload,
  FaUser,
} from "react-icons/fa6";
import AnimatedButton from "../global/animatedButton";
import { MdCurrencyExchange } from "react-icons/md";
import { useCreateMt5Acc } from "@/hooks/useMt5";
import { mt5Currencies, mt5Leverage, mt5Products } from "@/constants/mt5.const";
import { useTransferToMain } from "@/hooks/useIbWallet";
import { Button } from "../ui/button";

const IbTransferWalletForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { form, errors, onFormSubmit, isPending, balance, maxOnclick } = useTransferToMain(onSubmit);
  return (
    <>
      <Form {...form}>
        <form onSubmit={onFormSubmit} className="">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1  gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <div className="flex items-center gap-1 relative ">
                    <FormGeneratorV2
                      disabled={isPending || balance === 0}
                      // activeDefault={true}
                      inputType="input"
                      max={balance}
                      label="Amount"
                      field={field}
                      // max={lockPeriodData?.withdrawableAmount || 10}
                      errors={errors}
                      type="number"
                      indicatorText={`max: ${balance}`}
                      placeholder="Enter Amount"
                      Icon={FaUser}
                      className={{
                        input: "w-full ",
                        main: "w-full ",
                      }}
                    />
                    <Button disabled={isPending || balance === 0} size={"sm"} type="button" className="text-xs h-11 mt-5 rounded-2xl" variant={"outline"} onClick={maxOnclick}>
                      Max
                    </Button>
                  </div>
                )}
              />

            </div>


          </div>
          <div className="flex w-full mt-4 mb-4 items-center">
            <AnimatedButton
              size="md"

              type="submit"
              className="w-full"
              isLoading={isPending}
              disabled={isPending || balance === 0}
              text="Transfer"
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default IbTransferWalletForm;
