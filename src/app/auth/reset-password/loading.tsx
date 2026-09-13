import {
  AuthSkeletonCard,
  SkTitle,
  SkSubtitle,
  SkField,
  SkButton,
} from "@/components/auth/AuthSkeleton";

/** Mirrors the new-password card: new password + repeat password. */
const Authloading = () => (
  <AuthSkeletonCard withBack>
    <SkTitle />
    <SkSubtitle />
    <SkField />
    <SkField />
    <SkButton full />
  </AuthSkeletonCard>
);

export default Authloading;
