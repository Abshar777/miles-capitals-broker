import {
  AuthSkeletonCard,
  SkTitle,
  SkSubtitle,
  SkField,
  SkInlineLink,
  SkButton,
  SkFooterLine,
} from "@/components/auth/AuthSkeleton";

/** Mirrors the login card: centered title, email + password, forgot link, auto-width button. */
const Authloading = () => (
  <AuthSkeletonCard>
    <SkTitle center />
    <SkSubtitle center />
    <SkField />
    <div className="flex flex-col gap-2">
      <SkField />
      <SkInlineLink />
    </div>
    <SkButton />
    <SkFooterLine />
  </AuthSkeletonCard>
);

export default Authloading;
