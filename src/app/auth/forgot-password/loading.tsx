import {
  AuthSkeletonCard,
  SkTitle,
  SkSubtitle,
  SkField,
  SkButton,
} from "@/components/auth/AuthSkeleton";

/** Mirrors the reset-password request card: two-line instruction, one unlabelled email field. */
const Authloading = () => (
  <AuthSkeletonCard withBack>
    <SkTitle />
    <SkSubtitle lines={2} />
    <SkField labelled={false} />
    <SkButton full />
  </AuthSkeletonCard>
);

export default Authloading;
