import {
  AuthSkeletonCard,
  SkTitle,
  SkField,
  SkPhoneField,
  SkCheckbox,
  SkButton,
  SkFooterLine,
} from "@/components/auth/AuthSkeleton";

/** Mirrors the sign-up card: first/last name, country, city, phone, email, password, repeat. */
const Authloading = () => (
  <AuthSkeletonCard withBack>
    <SkTitle />
    <SkField />
    <SkField />
    <SkField />
    <SkField />
    <SkPhoneField />
    <SkField />
    <SkField />
    <SkField />
    <SkCheckbox />
    <SkButton full />
    <SkFooterLine />
  </AuthSkeletonCard>
);

export default Authloading;
