"use client";
import loginSchema from "@/schema/auth/login.schema";
import registerSchema, {
  signUpSchemaType,
} from "@/schema/auth/register.schema";
import {
  conformPasswordApi,
  forgetPasswordApi,
  login,
  register as registerApi,
} from "@/api/auth";
import { useMutationData } from "./useMutation";
import useZodForm from "./useZodForm";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { countryCodes } from "@/constants/countries";
import { v4 as uuidv4 } from "uuid";
import { AxiosError } from "axios";
import { claimRefralApi, joinReferralApi } from "@/api/ib";
import forgetPasswordSchema from "@/schema/auth/forgetpassword";
import conformPasswordSchema from "@/schema/auth/conformPasswordSchema";

export const useAuth = (type: "login" | "register", code?: string) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const schema: signUpSchemaType | any =
    type === "login" ? loginSchema : registerSchema;
  const apiFn = type === "login" ? login : registerApi;
  const { mutate, isPending, isError } = useMutationData(
    ["user"],
    (data) => apiFn(data),
    ["user"],
    onSubmit,
    (error) => {
      const data = (error as unknown as AxiosError).response?.data as {
        detail?: string;
        error?: {
          message?: string;
        };
      };
      //   console.log( typeof (data.error?.message as any),"anananan");
      if (data?.error?.message == "User already registered but not verified") {
        // toast.error("User already registered but not verified", {
        //   description: "Please verify your email to continue",
        // });
        router.push("/auth/otp");
      }
    },
  );

  useEffect(() => {
    if (code && typeof window !== "undefined") {
      localStorage.setItem("referral_code", code);
    }
  }, [code, typeof window]);
  useEffect(() => {
    if (isPending) {
      setIsLoading(true);
    }
    if (isError) {
      // toast.error("Something went wrong")
      setIsLoading(false);
    }
  }, [isPending, isError]);
  const { register, onFormSubmit, errors, reset, setValue, watch, getValues, formState } =
    useZodForm(schema, mutate, {
      country: "India",
      city: "",
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      repeat_password: "",
    });

  const {
    mutate: claimRefral,
    isPending: isClaimPending,
    isError: isClaimError,
    isSuccess: isClaimSuccess,
  } = useMutationData(
    ["claim"],
    (data: { token: string; code: string }) =>
      joinReferralApi(data.token, data.code),
    ["claim"],
    () => {
      toast.success("Referral claimed successfully");
      if (typeof window !== "undefined") {
        localStorage.removeItem("referral_code");
      }
    },
  );

  function onSubmit(response: { data: any }) {
    const AuthApiResponse = response?.data;
    const token = AuthApiResponse?.access_token as string;

    localStorage.setItem("__accessToken", token);
    toast.promise(
      signIn("credentials", {
        email: getValues("email"),
        token: type === "login" ? token : null,
        verified: type === "login" ? true : false,
        otpAccess: type === "login" ? false : true,
        conformPasswordAccess: false,
        name: getValues("firstname") + " " + getValues("lastname"),
        country: getValues("country"),
        city: getValues("city"),
        redirect: false,
        id: uuidv4(),
      })
        .then(() => {
          if (type === "login") {
            router.push("/root/dashboard");
            if (typeof window !== "undefined") {
              const referralCode = localStorage.getItem("referral_code");
              if (referralCode) {
                claimRefral({ token: token, code: referralCode });
              }
            }
          } else {
            router.push("/auth/otp");
          }
          reset();
          const message =
            type === "login"
              ? "User logged in successfully"
              : "User registered successfully";
          toast.success(message, {
            description:
              type === "login"
                ? "Welcome back!"
                : "Please verify your email to continue",
          });
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong");
          setIsLoading(false);
        }),
      {
        loading: type === "login" ? "Logging in..." : "Registering...",
        success:
          type === "login"
            ? "Logged in successfully"
            : "Registered successfully",
        error: type === "login" ? "Error logging in" : "Error registering",
      },
    );
  }

  return {
    register,
    onFormSubmit,
    errors,
    reset,
    isPending: isLoading,
    setValue,
    watch,
    formState,
  };
};

export const useForgotPassword = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { mutate, isPending, isError } = useMutationData(
    ["user"],
    (data: any) => forgetPasswordApi(data),
    ["user"],
    async () => {
      await signIn("credentials", {
        email: getValues("email"),
        token: null,
        verified: false,
        otpAccess: true,

        redirect: false,
        forgetOtpAccess: true,
      });
      router.push("/auth/otp");
      toast.success("Code sent successfully");
    },
    async (error) => {
      toast.error("Something went wrong");
      // await signIn("credentials", {
      //   email: getValues("email"),
      //   token: null,
      //   verified: false,
      //   otpAccess: true,

      //   redirect: false,
      //   forgetOtpAccess: true,
      // });
      // router.push("/auth/otp");
      // toast.success("Code sent successfully");
    },
  );

  const { register, onFormSubmit, errors, reset, setValue, watch, getValues, formState } =
    useZodForm(forgetPasswordSchema, mutate, {
      email: "",
    });

  return {
    mutate,
    isPending,
    isError,
    register,
    onFormSubmit,
    errors,
    reset,
    setValue,
    watch,
    getValues,
    formState,
  };
};

export const useResetPassword = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { mutate, isPending, isError } = useMutationData(
    ["user"],
    (data: any) =>
      conformPasswordApi({
        ...data,
        token: session?.user?.conformPasswordToken as string,
      }),
    ["user"],
    async () => {
      await update({
        conformPasswordToken: null,
        otpAccess: false,
        forgetOtpAccess: false,
      });
      router.push("/auth/login");
      toast.success("Password reset successfully");
    },
    async (error) => {
      toast.error("Something went wrong");
      // await signIn("credentials", {
      //   email: getValues("email"),
      //   token: null,
      //   verified: false,
      //   otpAccess: true,

      //   redirect: false,
      //   forgetOtpAccess: true,
      // });
      // router.push("/auth/otp");
      // toast.success("Code sent successfully");
    },
  );

  const { register, onFormSubmit, errors, reset, setValue, watch, getValues, formState } =
    useZodForm(conformPasswordSchema, mutate, {
      newPassword: "",
      repeat_password: "",
    });

  return {
    mutate,
    isPending,
    isError,
    register,
    onFormSubmit,
    errors,
    reset,
    setValue,
    watch,
    getValues,
    formState,
  };
};
