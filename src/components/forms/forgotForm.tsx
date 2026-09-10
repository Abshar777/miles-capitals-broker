"use client";
import { useForgotPassword } from "@/hooks/useAuth";
import AuthField from "../auth/AuthField";
import AuthButton from "../auth/AuthButton";

const ForgotForm = () => {
  const { register, onFormSubmit, errors, isPending, watch } = useForgotPassword();
  const email = watch("email");
  const canSubmit = !!email && /\S+@\S+\.\S+/.test(email);

  return (
    <form onSubmit={onFormSubmit} className="w-full flex flex-col gap-4" noValidate>
      <AuthField
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        register={register}
        errors={errors}
      />
      <div className="mt-2">
        <AuthButton type="submit" fullWidth disabled={!canSubmit} isLoading={isPending}>
          Continue
        </AuthButton>
      </div>
    </form>
  );
};

export default ForgotForm;
