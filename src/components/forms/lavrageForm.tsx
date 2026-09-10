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
import { useCreateMt5Acc, useUpdateLavrage } from "@/hooks/useMt5";
import { mt5Currencies, mt5Leverage, mt5Products } from "@/constants/mt5.const";

const LevrageForm = ({
  OLdlavrage,
  login,
  credID,
}: {
  OLdlavrage: string;
  login: string;
  credID: string;
}) => {
  const { form, errors, onFormSubmit, isPending } = useUpdateLavrage(
    OLdlavrage,
    login,
    credID
  );
  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-4">
            <div className="grid grid-cols-1  gap-4">
              <FormField
                control={form.control}
                name="leverage"
                render={({ field }) => (
                  <div className="flex relative justify-end items-center">
                    <FormGeneratorV2
                      activeDefault={false}
                      inputType="select"
                      label="Leverage"
                      field={field}
                      options={mt5Leverage as any}
                      // max={lockPeriodData?.withdrawableAmount || 10}
                      errors={errors}
                      placeholder="Select Leverage"
                      Icon={FaDollarSign}
                      className={{
                        input: "w-full  ",
                        main: "w-full ",
                      }}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full mt-4 mb-4 items-center">
          <AnimatedButton
            size="md"
            type="submit"
            className="w-full"
            isLoading={isPending}
            text="Update Leverage"
          />
        </div>
      </form>
    </Form>
  );
};

export default LevrageForm;
