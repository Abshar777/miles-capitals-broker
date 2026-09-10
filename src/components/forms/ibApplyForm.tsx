import React from "react";
import { Form, FormField } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { MdCurrencyExchange, MdGroupAdd } from "react-icons/md";
import { useCreateMt5Acc } from "@/hooks/useMt5";
import { mt5Currencies, mt5Leverage, mt5Products } from "@/constants/mt5.const";
import { useApplyIB } from "@/hooks/useIB";
import { Spinner } from "@heroui/react";

const IBApplyForm = () => {
  const { form, errors, onFormSubmit, isPending, defaultPlan, isError, isLoading } =
    useApplyIB();
  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className="flex flex-col gap-4">
          <div className="flex w-full  flex-col gap-4">
            {!isError && !isLoading && defaultPlan && (
              <FormField
                control={form.control}
                name="plan_id"
                render={({ field }) => (
                  <div className="flex relative w-full items-center">
                    <FormGeneratorV2
                      activeDefault={true}
                      inputType="selectv2"
                      label="Plan"
                      field={field}
                      Icon={MdGroupAdd}
                      disabled={defaultPlan?.registration === "private"}
                      options={[
                        {
                          ID: defaultPlan?.id || "",
                          id: defaultPlan?.id || "",
                          label: defaultPlan?.name || "",
                          value: defaultPlan?.id || "",
                          iconImage: null as unknown as string,
                          disabled: defaultPlan?.registration === "private"

                        },
                      ]}
                      errors={errors}
                      placeholder="Select a Plan"
                      className={{
                        input: "w-full ",
                        main: "w-full ",
                      }}
                    />
                  </div>
                )}
              />
            )}
            {isError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>No default plan found</AlertDescription>
              </Alert>
            )}
            {isLoading && (
              <div className="flex items-center justify-center h-full w-full">
                <Spinner color="primary" size="sm" />
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full mt-4 mb-4 items-center">
          <AnimatedButton
            size="md"
            type="submit"
            className="w-full whiteTextBtn"
            isLoading={isPending}
            text="Apply for IB Plan"
            disabled={isPending || isError}
          />
        </div>
      </form>
    </Form>
  );
};

export default IBApplyForm;
