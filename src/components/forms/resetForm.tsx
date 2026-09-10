"use client";
import { useResetPassword } from "@/hooks/useAuth";
import AuthField from "../auth/AuthField";
import AuthButton from "../auth/AuthButton";
import PasswordRules from "../auth/PasswordRules";

const ResetForm = () => {
  const { register, onFormSubmit, errors, isPending, watch } = useResetPassword();
  const newPassword = watch("newPassword") || "";
  const repeat = watch("repeat_password") || "";
  const canSubmit = newPassword.length >= 8 && repeat.length >= 8;

  return (
    <form onSubmit={onFormSubmit} className="w-full flex flex-col gap-4" noValidate>
      <AuthField
        label="New password"
        name="newPassword"
        type="password"
        placeholder="Enter Password"
        autoComplete="new-password"
        register={register}
        errors={errors}
      >
        <PasswordRules value={newPassword} />
      </AuthField>
      <AuthField
        label="Repeat password"
        name="repeat_password"
        type="password"
        placeholder="Repeat Password"
        autoComplete="new-password"
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

export default ResetForm;
