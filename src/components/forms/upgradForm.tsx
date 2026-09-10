import React, { useEffect, useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useDeposit } from "@/hooks/useDeposit";
import FormGeneratorV2 from "../global/form-generator/v2";
import {
  FaArrowRight,
  FaDollarSign,
  FaIdCard,
  FaTelegram,
  FaUpload,
} from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AnimatedButton from "../global/animatedButton";
import { MdCurrencyExchange } from "react-icons/md";
import { TbCurrencyDirham } from "react-icons/tb";
import { FaExchangeAlt, FaInfoCircle, FaRupeeSign } from "react-icons/fa";
import { IoLogoUsd } from "react-icons/io5";
import { RiRefreshFill } from "react-icons/ri";
import { currencies, fromCurrencies } from "@/constants/curency";
import TooltipReuse from "../ui/tooltipReuse";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useKyc } from "@/hooks/useKyc";

const UpgradForm = () => {
  const [documentName, setDocumentName] = useState<
    "passport" | "aadhar" | "emirates"
  >("aadhar");
  const { form, errors, onFormSubmit, isPending } = useKyc();
  useEffect(() => {
    form.setValue(
      "identity_name",
      documentName as "passport" | "aadhar" | "emirates"
    );
  }, [documentName]);

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className=" flex flex-col  gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Proof of Identity</h1>
            <p className="text-sm text-foreground/50">
              Any legitimate government-issued document that has a photo.
            </p>

            <RadioGroup
              className="flex flex-col gap-4 mt-2"
              defaultValue="aadhar"
              value={documentName}
              onValueChange={(value) => {
                setDocumentName(value as "passport" | "aadhar" | "emirates");
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="passport" id="passport" />
                <Label htmlFor="passport">Passport </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aadhar" id="aadhar" />
                <Label htmlFor="aadhar">Aadhar Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emirates" id="emirates" />
                <Label htmlFor="emirates">Emirates ID</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="mt-3">
            <FormField
              control={form.control}
              name="identity_front"
              render={({ field }) => (
                <FormGeneratorV2
                  inputType="upload"
                  label="Identity Front Side Photo"
                  Icon={FaIdCard}
                  field={field}
                  acceptedFileTypes="image/jpeg,image/png,image/jpg"
                  maxFileSize={2}
                  errors={errors}
                  placeholder="Upload your identity front side photo"
                  type="number"
                  className={{
                    input: "w-full bg-foreground/5",
                    main: "w-full ",
                  }}
                />
              )}
            />
          </div>
          <div className="mt-3">
            <FormField
              control={form.control}
              name="identity_back"
              render={({ field }) => (
                <FormGeneratorV2
                  inputType="upload"
                  label="Identity Back Side Photo"
                  Icon={FaIdCard}
                  field={field}
                  acceptedFileTypes="image/jpeg,image/png,image/jpg"
                  maxFileSize={2}
                  errors={errors}
                  placeholder="Upload your identity back side photo"
                  type="number"
                  className={{
                    input: "w-full bg-foreground/5",
                    main: "w-full ",
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className=" flex flex-col mt-2  gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Proof of Residence</h1>
            <p className="text-sm text-foreground/50">
              Any valid identity card with address or utility bill
            </p>
            <RadioGroup
              className="flex flex-col gap-4 mt-2"
              defaultValue="proof_of_residency"
              value={form.getValues("residency_name")}
              onValueChange={(value) => {
                form.setValue("residency_name", value as "proof_of_residency");
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="proof_of_residency"
                  id="proof_of_residency"
                />
                <Label htmlFor="proof_of_residency">Proof of Residency </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="mt-3">
            <FormField
              control={form.control}
              name="residency_front"
              render={({ field }) => (
                <FormGeneratorV2
                  inputType="upload"
                  label="Residence Front Side Photo"
                  Icon={FaIdCard}
                  field={field}
                  acceptedFileTypes="image/jpeg,image/png,image/jpg"
                  maxFileSize={2}
                  errors={errors}
                  placeholder="Upload your residence front side photo"
                  type="number"
                  className={{
                    input: "w-full bg-foreground/5",
                    main: "w-full ",
                  }}
                />
              )}
            />
          </div>
          <div className="mt-3">
            <FormField
              control={form.control}
              name="residency_back"
              render={({ field }) => (
                <FormGeneratorV2
                  inputType="upload"
                  label="Residence Back Side Photo"
                  Icon={FaIdCard}
                  field={field}
                  acceptedFileTypes="image/jpeg,image/png,image/jpg"
                  maxFileSize={2}
                  errors={errors}
                  placeholder="Upload your residence back side photo"
                  type="number"
                  className={{
                    input: "w-full bg-foreground/5",
                    main: "w-full ",
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="flex w-full mt-4 items-center">
          <AnimatedButton
            size="md"
            type="submit"
            className="w-min"
            isLoading={isPending}
            text="Upgrade"
          />
        </div>
      </form>
    </Form>
  );
};

export default UpgradForm;
