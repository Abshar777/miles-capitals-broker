"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import Flag from "react-world-flags"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { IconType } from "react-icons/lib"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countryCodes } from "@/constants/countries"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Sorted longest-first so +353 matches before +3, avoiding false partial hits
const sortedCountryCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length)



type Props = {
  type?: "text" | "email" | "password" | "number"
  inputType: "select" | "input" | "textarea" | "checkbox" | "phone"
  options?: { value: string; label: string; id: string; flag?: string }[]
  label?: string
  placeholder?: string
  register: UseFormRegister<any>
  name: string
  errors: FieldErrors<FieldValues>
  lines?: number
  className?: string
  showError?: boolean
  Icon?: IconType
  maxLength?: number
  checked?: boolean
  passwordStrengthSh?: boolean
  setValue?: any
  onCountryChange?: (country: string) => void
  selectedOption?: string
}

const FormGenerator = ({
  inputType,
  options,
  label,
  placeholder = "",
  register,
  name,
  errors,
  type,
  lines,
  className,
  showError = true,
  checked,
  Icon,
  maxLength,
  setValue,
  passwordStrengthSh,
  onCountryChange,
  selectedOption: selectedOptionProps,
}: Props) => {
  const [show, setShow] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>(selectedOptionProps || "")
  const [Type, setType] = useState<string>(type || "text")
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("+1")
  const [passwordStrength, setPasswordStrength] = useState<string>("")
  const [showPasswordStrength, setShowPasswordStrength] = useState<boolean>(false)
  const [pwdRules, setPwdRules] = useState({
    lower: false,
    upper: false,
    digit: false,
    special: false,
    length: false,
  })

  // Initialize phone field once on mount with the default country code
  useEffect(() => {
    if (inputType === "phone") setValue(name, selectedCountryCode + " ")
  }, [])

  const checkPasswordStrength = (value: string) => {
    const lower = /[a-z]/.test(value)
    const upper = /[A-Z]/.test(value)
    const digit = /\d/.test(value)
    const special = /[!@#$%^&*()\-_}{.+]/.test(value)
    const length = value.length >= 8

    setPwdRules({ lower, upper, digit, special, length })
  }
  const isSafari = typeof window !== "undefined" && window?.navigator?.userAgent?.includes("Safari")

  switch (inputType) {
    case "input":
      return (
        <div className="relative w-full">
          <Label className="flex w-full justify-start items-start flex-col gap-2 text-forground " htmlFor={`input-${label}`}>
            <p className="flex text-foreground/70 font-semibold items-center gap-1">
              {label && label}
              {label && <span className="text-primary">*</span>}
            </p>
            <div className="flex relative w-full items-center justify-end">
              {Icon && <Icon className="absolute text-sm left-2 text-muted-foreground" />}{" "}
              {passwordStrengthSh    ? (
                
                <Popover open={showPasswordStrength} onOpenChange={(o) => setShowPasswordStrength(o)}>
                  <PopoverTrigger asChild>
                    <Input
                    autoComplete="off"
                      maxLength={maxLength}
                      id={`input-${label}`}
                      type={Type}
                      placeholder={placeholder}
                      className={cn(
                        `  w-full  px-[1.7rem] ${errors[name] && "errInput"} flex-1`,
                        className,
                      )}
                      {...register(name)}
                      onFocus={(e) => {
                        
                        if (Type === "password" || type === "password") {
                          setShowPasswordStrength(true)
                        }
                      }}
                      onBlur={(e) => {
                        setShowPasswordStrength(false)
                        register(name).onBlur?.(e)
                      }}
                      onChange={(e) => {
                        
                        const v = e.target.value || ""
                        setPwdRules({
                          lower: /[a-z]/.test(v),
                          upper: /[A-Z]/.test(v),
                          digit: /\d/.test(v),
                          special: /[!@#$%^&*()\-_}{.+]/.test(v),
                          length: v.length >= 8,
                        })
                        register(name).onChange?.(e)
                      }}
                    />
                  </PopoverTrigger>

                  <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={8}
                    className="w-64 bg-background border-themeGray p-3 text-sm"
                  >
                    <p className="font-medium mb-2">Password requirements</p>
                    <ul className="space-y-1">
                      <li
                        className={cn(
                          "flex items-center gap-2",
                          pwdRules.lower ? "text-green-600" : "text-muted-foreground",
                        )}
                      >
                        <span className={pwdRules.lower ? "ri-check-line" : "ri-close-line"} aria-hidden="true" />
                        At least one lowercase letter
                      </li>
                      <li
                        className={cn(
                          "flex items-center gap-2",
                          pwdRules.upper ? "text-green-600" : "text-muted-foreground",
                        )}
                      >
                        <span className={pwdRules.upper ? "ri-check-line" : "ri-close-line"} aria-hidden="true" />
                        At least one uppercase letter
                      </li>
                      <li
                        className={cn(
                          "flex items-center gap-2",
                          pwdRules.digit ? "text-green-600" : "text-muted-foreground",
                        )}
                      >
                        <span className={pwdRules.digit ? "ri-check-line" : "ri-close-line"} aria-hidden="true" />
                        At least one digit
                      </li>
                      <li
                        className={cn(
                          "flex items-center gap-2",
                          pwdRules.special ? "text-green-600" : "text-muted-foreground",
                        )}
                      >
                        <span className={pwdRules.special ? "ri-check-line" : "ri-close-line"} aria-hidden="true" />
                        At least one special character
                      </li>
                      <li
                        className={cn(
                          "flex items-center gap-2",
                          pwdRules.length ? "text-green-600" : "text-muted-foreground",
                        )}
                      >
                        <span className={pwdRules.length ? "ri-check-line" : "ri-close-line"} aria-hidden="true" />
                        Minimum 8 characters
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              ) : (
                
                <Input
                  maxLength={maxLength}
                  id={`input-${label}`}
                  type={Type}
                  placeholder={placeholder}
                  className={cn(
                    ` w-full  px-[1.7rem] ${errors[name] && "errInput"} flex-1`,
                    className,
                  )}
                  {...register(name)}
                  onFocus={() => {}}
                  onBlur={(e) => {
                    register(name).onBlur?.(e)
                  }}
                />
              )}
              {type == "password" && (
                <i
                  onClick={() => {
                    setShow(!show)
                    Type == "password" ? setType("text") : setType("password")
                  }}
                  className={`cursor-pointer text-foreground/80 ${
                    show ? "ri-eye-close-line" : "ri-eye-2-line"
                  } absolute me-2`}
                ></i>
              )}
            </div>
            {showError && (
              <ErrorMessage
                errors={errors}
                name={name}
                render={({ message }: { message: string }) => (
                  <p className="text-red-700 mt-1">{message === "Required" ? "" : message}</p>
                )}
              />
            )}
          </Label>

          {passwordStrengthSh && <>{/* ... no-op marker: popover implemented above, shown only on focus ... */}</>}
        </div>
      )

    case "phone":
      return (
        <Label className="flex flex-col w-full gap-2 items-start text-background/80" htmlFor={`phone-${label}`}>
          <p className="flex text-foreground/70  font-semibold items-center gap-1">
            {label && label}
            {label && <span className="text-primary">*</span>}
          </p>
          <div className="grid grid-cols-4  gap-2 w-full">
            <Select
              value={selectedCountryCode}
              
              onValueChange={(e) => {
                setSelectedCountryCode(e)
                setValue(name, e + " ")   // reset phone when user picks from dropdown
                onCountryChange?.(e)
              }}
              defaultValue={selectedCountryCode}
            >
              <SelectTrigger className="col-span-1  border-themeGray">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background  border-themeGray">
                {countryCodes.map((country, index) => (
                  <SelectItem
                    key={`${country.code}-${country.country}-${index}`}
                    value={country.code}
                    className=" hover:bg-primary cursor-pointer "
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Flag code={country.country} style={{ width: 15, height: 20 }} />
                        <span>{country.code}</span>
                      </div>
                      <span>{country.country}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex col-span-3 relative w-full  items-center justify-end flex-1">
              {Icon && <Icon className="absolute text-sm left-2 text-muted-foreground" />}
              <Input
                maxLength={maxLength}
                id={`phone-${label}`}
                type="tel"
                placeholder={placeholder || "Enter phone number"}
                className={cn(
                  `w-full ${Icon ? "px-[1.7rem]" : "px-3"} ${errors[name] && "errInput"} flex-1`,
                  className,
                )}
                {...register(name)}
                onChange={(e: any) => {
                  let value = e.target.value

                  if (value.startsWith("+")) {
                    // Auto-detect country code — longest match first to avoid partial hits
                    const matched = sortedCountryCodes.find((c) => value.startsWith(c.code))
                    if (matched && matched.code !== selectedCountryCode) {
                      setSelectedCountryCode(matched.code)
                      // Don't reset the field — just sync the dropdown to what was typed
                    }
                  } else {
                    // User deleted the leading + — re-prepend the current code
                    if (!value.startsWith(selectedCountryCode + " ")) {
                      value = selectedCountryCode + " " + value.replace(/^\+?\d*\s*/, "")
                    }
                  }

                  e.target.value = value
                  register(name).onChange(e)
                }}
              />
            </div>
          </div>
          {showError && (
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }: { message: string }) => (
                <p className="text-red-700 mt-2">{message === "Required" ? "" : message}</p>
              )}
            />
          )}
        </Label>
      )

    case "select":
      return (
        <Label htmlFor={`select-${label}`} className="flex text-foreground/70 items-start flex-col gap-2">
          {label && label}
          <Select
            onValueChange={(e) => {
              
              setSelectedOption(e)
              setValue(name, e)
            }}
            value={selectedOption}
            defaultValue={selectedOption}
          >
            <SelectTrigger className="text-foreground border-themeGray">
              <SelectValue defaultValue={selectedOption} />
            </SelectTrigger>
            <SelectContent className="bg-background border-themeGray">
              {options?.length &&
                options.map((option, index) => (
                  <SelectItem value={option.value} key={`${option.value}-${index}`} className="dark:bg-muted">
                    <div className="flex items-center gap-2">
                      {option.flag && <Flag code={option.flag} style={{ width: 15, height: 20 }} />}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {showError && (
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }: { message: string }) => (
                <p className="text-red-400 mt-2">{message === "Required" ? "" : message}</p>
              )}
            />
          )}
        </Label>
      )

    case "textarea":
      return (
        <Label className="flex flex-col gap-2 text-[#9D9D9D]" htmlFor={`input-${label}`}>
          {label && label}
          <Textarea
            className={cn(
              className,
              `focus:bg-background/20 placeholder:text-muted-foreground/30 bg-primary-foreground ${
                errors[name] && "errInput"
              } border-themeGray text-themeTextGray`,
            )}
            id={`input-${label}`}
            placeholder={placeholder}
            rows={lines}
            {...register(name)}
          />
          {showError && (
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }: { message: string }) => (
                <p className="text-red-400 mt-2">{message === "Required" ? "" : message}</p>
              )}
            />
          )}
        </Label>
      )

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox checked={checked} color="primary" id={label} />
          <label
            htmlFor={label}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        </div>
      )

    default:
      break
  }
}

export default FormGenerator
