"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { countryCodes } from "@/constants/countries";
import AuthField from "../auth/AuthField";
import AuthSelect from "../auth/AuthSelect";
import AuthPhone from "../auth/AuthPhone";
import AuthCheckbox from "../auth/AuthCheckbox";
import AuthButton from "../auth/AuthButton";
import PasswordRules from "../auth/PasswordRules";
import { AuthFooterLine } from "../auth/AuthText";

const countryOptions = countryCodes
  .filter((c, i, arr) => arr.findIndex((x) => x.name === c.name) === i)
  .map((c) => ({ value: c.name, label: c.name, flag: c.country }));

const RegisterForm = ({ code }: { code?: string }) => {
  const { register, onFormSubmit, errors, isPending, setValue, watch, formState } = useAuth(
    "register",
    code
  );
  const [agreed, setAgreed] = useState(false);

  const country = watch("country");
  const password = watch("password") || "";
  const values = watch();
  const filled =
    !!values.firstname &&
    !!values.lastname &&
    !!values.city &&
    !!values.phone &&
    !!values.email &&
    !!values.password &&
    !!values.repeat_password;
  const canSubmit = filled && agreed && formState.isValid;

  return (
    <form onSubmit={onFormSubmit} className="w-full flex flex-col gap-4" noValidate>
      <AuthField
        label="First Name"
        name="firstname"
        placeholder="Enter First Name"
        autoComplete="given-name"
        register={register}
        errors={errors}
      />
      <AuthField
        label="Last Name"
        name="lastname"
        placeholder="Enter Last Name"
        autoComplete="family-name"
        register={register}
        errors={errors}
      />

      <AuthSelect
        label="Country"
        value={country || ""}
        options={countryOptions}
        onChange={(v) => setValue("country", v, { shouldValidate: true, shouldDirty: true })}
        placeholder="Select country"
      />

      <AuthField
        label="City"
        name="city"
        placeholder="Enter City"
        autoComplete="address-level2"
        register={register}
        errors={errors}
      />

      <AuthPhone
        label="Phone number"
        name="phone"
        country={country}
        setValue={setValue}
        errors={errors}
      />

      <AuthField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter Email"
        autoComplete="email"
        register={register}
        errors={errors}
      />

      <AuthField
        label="Enter Password"
        name="password"
        type="password"
        placeholder="Enter Password"
        autoComplete="new-password"
        register={register}
        errors={errors}
      >
        <PasswordRules value={password} />
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

      <AuthCheckbox id="agreement" checked={agreed} onChange={setAgreed}>
        I agree with Customer Agreement
      </AuthCheckbox>

      <div className="mt-2">
        <AuthButton type="submit" fullWidth disabled={!canSubmit} isLoading={isPending}>
          Continue
        </AuthButton>
      </div>

      <AuthFooterLine text="Already have an account?" linkText="Log in" href="/auth/login" />
    </form>
  );
};

export default RegisterForm;
