import {
  AuthSkeletonCard,
  SkTitle,
  SkSubtitle,
  SkOtpRow,
  SkButton,
  SkFooterLine,
} from "@/components/auth/AuthSkeleton";

/** Mirrors the verification card: six OTP boxes and a full-width continue button. */
const Authloading = () => (
  <AuthSkeletonCard withBack>
    <SkTitle />
    <SkSubtitle />
    <SkOtpRow />
    <SkButton full />
    <SkFooterLine />
  </AuthSkeletonCard>
);

export default Authloading;
