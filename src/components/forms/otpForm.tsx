"use client";
import useOtp from "@/hooks/useOtp";
import OtpInput from "../global/form-generator/otp-input";
import AuthButton from "../auth/AuthButton";
import { AuthFooterLine } from "../auth/AuthText";

const OtpForm = () => {
  const { handleSubmit, isPending, otp, setOtp, resendOtp, isResendLoading } = useOtp();
  const code = otp.join("");

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <OtpInput otpLength={6} setOtp={setOtp} otp={otp} />

      <div className="mt-2">
        <AuthButton
          type="submit"
          fullWidth
          disabled={code.length !== 6}
          isLoading={isPending || isResendLoading}
        >
          Continue
        </AuthButton>
      </div>

      <AuthFooterLine text="Didn’t receive the code?" linkText="Resend" onClick={resendOtp} />
    </form>
  );
};

export default OtpForm;
