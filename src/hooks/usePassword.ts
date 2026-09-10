"use client";
import { useMutationData } from "./useMutation";
import { conformPasswordApi, forgetPasswordApi } from "@/api/auth";
import useZodForm from "./useZodForm";
import forgetPasswordSchema from "@/schema/auth/forgetpassword";
import conformPasswordSchema from "@/schema/auth/conformPasswordSchema";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";



export const usePassword = (type: "forget" | "conform") => {
  const router = useRouter();


  const schema =
    type === "forget" ? forgetPasswordSchema : conformPasswordSchema;
  const apiFn = type === "forget" ? forgetPasswordApi : conformPasswordApi;


  const { mutate, isPending } = useMutationData(
    ["password"],
    (data: any) => (apiFn as any)({ newPassword: data.password, email: data?.email }),
    ["password"],
    onSubmit
  );

  const { register, onFormSubmit, errors, reset, setValue } = useZodForm(schema, mutate);
  async function onSubmit(response: { data: any }) {
    console.log(response, "🟢 response");
    if (type === "forget") {
      router.push("/auth/otp");
    } else {
      router.push("/auth/login"); //WIRE_UP redirect to profile
    }
    const message =
      type === "forget"
        ? "email found , please check your email"
        : "Password changed successfully";
    toast.success(message);
  }

  return { mutate, isPending, register, onFormSubmit, errors, reset, setValue };
};
