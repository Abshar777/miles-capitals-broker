"use client";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { useState, useRef, useEffect } from "react";
import type { ControllerRenderProps, FieldErrors } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons/lib";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CiCalendarDate as CalendarIcon } from "react-icons/ci";
import { HiClock as Clock } from "react-icons/hi";
import { IoCloudUploadOutline as UploadIcon } from "react-icons/io5";
import { MdKeyboardArrowDown as DownArrow } from "react-icons/md";
import AnimatedButton from "../../animatedButton";
import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";
import { form, Spinner } from "@heroui/react";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FaTrash } from "react-icons/fa6";
import Image from "next/image";

const uploadFile = (file: any) => {
  return URL.createObjectURL(file);
};

type Props = {
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "stringNumber"
    | "datetime-local";
  inputType:
    | "select"
    | "input"
    | "textarea"
    | "checkbox"
    | "date"
    | "time"
    | "switch"
    | "upload"
    | "selectv2";
  options?: {
    value: string;
    disabled?: boolean;
    label: string;
    id: string;
    ID?: string;
    iconImage?: string;
    amount?: number;
    hasMethod?: boolean;
    description?: string;
    badgeLabel?: string;
    commission_percent?: number;
    
  }[];
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  lines?: number;
  isFetching?: boolean;
  field: ControllerRenderProps<any, any>;
  className?: {
    label?: string;
    input?: string;
    icon?: string;
    error?: string;
    main?: string;
    button?: string;
    optionImg?: string;
  };
  activeDefault?: boolean;
  errors: FieldErrors<any>;
  showError?: boolean;
  Icon?: IconType;
  maxLength?: number;
  checked?: boolean;
  dateFormat?: string;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  buttonText?: string;
  summeryComp?: React.ReactNode;
  min?: number;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  max?: number;
  minLength?: number;
  disabled?: boolean;
  indicatorText?: string;
  loaderFn?: (isLoading: boolean) => void;
};

const FormGeneratorV2 = ({
  inputType,
  options,
  label,
  placeholder = "",
  type,
  lines,
  field,
  errors,
  className,
  showError = true,
  checked,
  Icon,
  maxLength,
  dateFormat,
  acceptedFileTypes = "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  maxFileSize = 5, // 5MB default
  buttonText = "Upload",
  minLength,
  min,
  onEnter,
  disabled,
  max,
  indicatorText,
  loaderFn = (isLoading: boolean) => {},
  activeDefault = false,
  summeryComp,
  isRequired = true,
  isFetching = false,
}: Props) => {
  
  const [show, setShow] = useState<boolean>(false);

  const [Type, setType] = useState<string>(type || "text");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>(
    inputType == "upload"
      ? field?.value?.name?.split?.("/")?.pop?.()?.split?.("__")?.[1] || ""
      : ""
  );
  const [searchTerm, setSearchTerm] = useState<string>(field.value || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
    id: string;
    iconImage?: string;
    amount?: number;
    ID?: string;
    hasMethod?: boolean;
    disabled?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    loaderFn(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!field.value) {
      setSelectedOption(null);
      setImagePreview(null);
      setFileName("");
    }
  }, [field.value]);

  switch (inputType) {
    case "input":
      return (
        <FormItem className={className?.main}>
          <div className={cn("flex flex-col  gap-2 ", className?.main)}>
            <FormLabel
              className={cn(
                "flex items-center gap-1 text-[15px] leading-6 font-normal text-muted-foreground",
                className?.label
              )}
            >
              {label && label}
              {label && isRequired && <span className="text-primary">*</span>}
              {!!summeryComp && summeryComp}
            </FormLabel>
            <FormControl className="flex relative items-center justify-end">
              <div className="flex relative items-center justify-end">
                {Icon && (
                  <Icon
                    className={cn(
                      "absolute text-sm left-2 text-foreground",
                      className?.icon,
                      disabled && "text-muted-foreground"
                    )}
                  />
                )}{" "}
                <Input
                  // min={min}
                  disabled={disabled}
                  max={max}
                  minLength={minLength}
                  maxLength={maxLength}
                  id={`input-${label}`}
                  type={Type}
                  placeholder={placeholder}
                  className={cn(
                    `  px-[1.7rem] ${errors[field.name] && "errInput"} flex-1`,
                    className?.input
                  )}
                  value={field.value}
                  onKeyDown={(e) => {
                    if (onEnter) {
                      onEnter(e);
                    }
                  }}
                  onChange={(e) => {
                    if (type == "number") {
                      if (e.target.value[0] == "0") {
                        e.target.value = e.target.value.slice(1);
                      }
                      field.onChange(Number(e.target.value));
                    } else {
                      field.onChange(e.target.value);
                    }
                  }}
                />
                {type == "password" && (
                  <i
                    onClick={() => {
                      setShow(!show);
                      Type == "password"
                        ? setType("text")
                        : setType("password");
                    }}
                    className={`cursor-pointer text-foreground/80 ${
                      show ? "ri-eye-close-line" : "ri-eye-2-line"
                    } absolute me-2`}
                  ></i>
                )}
                {indicatorText && (
                  <p
                    className={`cursor-pointer text-xs text-muted-foreground absolute me-2`}
                  >
                    {indicatorText}
                  </p>
                )}
              </div>
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      );
    case "select":
      return (
        <FormItem className={className?.main}>
          <div className={cn("flex flex-col gap-2 ", className?.main)}>
            <FormLabel
              className={cn(
                "flex items-center gap-1 text-[15px] leading-6 font-normal text-muted-foreground",
                className?.label
              )}
            >
              {label && label}
              {label && isRequired && <span className="text-primary">*</span>}
            </FormLabel>
            <FormControl>
              <Select
                disabled={disabled || isFetching}
                value={field.value}
                onValueChange={field.onChange}
              >
                <div className="relative flex items-center">
                  {Icon && !isFetching && (
                    <Icon
                      className={cn(
                        "absolute text-sm left-2 text-foreground",
                        className?.icon
                      )}
                    />
                  )}
                  {isFetching && (
                    <Spinner
                      size="sm"
                      color="secondary"
                      className="absolute left-2"
                    />
                  )}
                  <SelectTrigger
                    className={cn(
                      `  ps-[1.7rem] py-4  ${errors[field.name] && "errInput"}`,
                      className?.input
                    )}
                  >
                    {isFetching
                      ? <span className="text-muted-foreground text-sm">Loading...</span>
                      : <SelectValue placeholder={placeholder} />
                    }
                  </SelectTrigger>
                </div>
                <SelectContent>
                  {options?.map((option, i) => (
                    <SelectItem
                      className="text-foreground cursor-pointer rounded-[4px]"
                      key={option.id}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      );

    case "selectv2":
      useEffect(() => {
        if (options && activeDefault&&!options?.[0]?.disabled) {
          field.onChange(options?.[0]?.value || "");
          setSelectedOption(options?.[0] || null);
        }
      }, [options]);
      const selectedValueLabel = options?.find(
        (option) => option.value === field.value
      )?.label;

      return (
        <FormItem className={className?.main}>
          <div
            className={cn(
              "flex flex-col gap-2 text-foreground/80",
              className?.main
            )}
          >
            <FormLabel
              className={cn(
                "flex items-center gap-1 text-[15px] leading-6 font-normal text-muted-foreground",
                className?.label
              )}
            >
              {label && label}
              {label && isRequired && <span className="text-primary">*</span>}
            </FormLabel>
            <FormControl>
              <div className="w-full">
                <div className="relative w-full">
                  {!isMobile && (
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                      <div className="relative md:flex hidden  w-full  items-center">
                        {Icon && !selectedOption?.iconImage && (
                          <Icon
                            className={cn(
                              "absolute text-sm left-2 text-foreground z-10",
                              className?.icon
                            )}
                          />
                        )}
                        {!!selectedOption?.iconImage && (
                          <img
                            src={selectedOption.iconImage}
                            alt={selectedOption.label}
                            className={cn(
                              "absolute w-6 h-6 text-sm left-2 text-foreground z-10",
                              className?.optionImg,
                              !selectedOption?.iconImage && "hidden"
                            )}
                          />
                        )}
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "flex h-14 w-full rounded-[4px] border border-field bg-field px-[15px] py-3 text-[15px] leading-6 text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/60 disabled:cursor-not-allowed disabled:opacity-50",
                              ` ps-[2.5rem] cursor-pointer text-foreground ${
                                errors[field.name] && "errInput" 
                              } ${
                                selectedValueLabel ? "" :" opacity-50"
                              }`,
                              className?.input
                            )}
                            onClick={() => setIsOpen(!isOpen)}
                          >
                            {selectedValueLabel || placeholder}
                          </div>
                        </PopoverTrigger>
                        <div
                          onClick={() => setIsOpen(!isOpen)}
                          className="absolute right-2"
                        >
                          <DownArrow className="h-4 w-4 z-[100] text-foreground cursor-pointer" />
                        </div>
                      </div>

                      <PopoverContent
                        className="p-0 w-[var(--radix-popover-trigger-width)] md:block hidden bg-card border border-border rounded-[4px] shadow-none max-h-64 overflow-hidden"
                        align="start"
                      >
                        <div className="flex flex-col ">
                          <Input
                            placeholder="Search"
                            className="px-4 py-1.5 h-12 focus:outline-none focus-visible:ring-0 outline-transparent border-transparent rounded-none bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Separator className=" mb-2" />
                          {!isFetching &&
                            options?.filter((option) =>
                              option.label
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            ).length === 0 && (
                              <div className="px-4 text-sm py-1 text-foreground">
                                No results found
                              </div>
                            )}
                          {isFetching && (
                            <div className="px-4 text-sm py-1 flex items-center justify-center text-foreground">
                              <Spinner
                                size="sm"
                                className="text-foreground"
                                color="secondary"
                              />
                            </div>
                          )}
                          <ScrollArea className="max-h-60 h-60">
                            <div className="flex flex-col gap-2 h-full mb-10  p-1">
                              {!isFetching &&
                                options
                                  ?.filter((option) =>
                                    option.label
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase())
                                  )
                                  .map((option) => (
                                    <div
                                      key={option.id}
                                      className={cn(
                                        "px-4 py-2.5 text-foreground text-[15px] hover:bg-field cursor-pointer flex items-center gap-2 rounded-[4px]",
                                        option.disabled &&
                                          "opacity-50 cursor-not-allowed",
                                        field.value == option.value &&
                                          "bg-primary text-primary-foreground"
                                      )}
                                      onClick={() => {
                                        if (option.disabled) return;
                                        field.onChange(option.value);
                                        setSelectedOption(option);
                                        setIsOpen(false);
                                      }}
                                    >
                                      {!!option.iconImage && <img
                                        src={option.iconImage}
                                        alt={option.label}
                                        className={cn(
                                          "w-6 h-6",
                                          className?.optionImg,
                                          !option.iconImage && "hidden"
                                        )}
                                      />}

                                      <div className="flex group w-full flex-col ">
                                        <p
                                          className={cn(
                                            "text-sm  ",
                                            field.value == option.value &&
                                              " text-primary-foreground "
                                          )}
                                        >
                                          {option.label}
                                        </p>
                                        {option?.ID && (
                                          <p
                                            className={cn(
                                              "text-xs ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            ID:{option.ID}
                                          </p>
                                        )}
                                        {option?.description && (
                                          <p
                                            className={cn(
                                              "text-xs text-foreground ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            {option?.description}
                                          </p>
                                        )}
                                      </div>
                                      {typeof option?.hasMethod !==
                                        "undefined" ||
                                        (typeof option?.badgeLabel !==
                                          "undefined" && (
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              className={cn(
                                                "font-normal ",
                                                field.value == option.value &&
                                                  " text-primary-foreground "
                                              )}
                                            >
                                              {option?.badgeLabel
                                                ? option?.badgeLabel
                                                : option?.hasMethod
                                                ? "Available"
                                                : "Not Available"}
                                            </Badge>
                                          </div>
                                        ))}
                                      {typeof option?.amount !==
                                        "undefined" && (
                                        <div className="flex-1 flex items-center justify-end">
                                          <p
                                            className={cn(
                                              "text-sm ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            {option.amount}
                                          </p>
                                        </div>
                                      )}
                                      {typeof option?.commission_percent !==
                                        "undefined" && (
                                        <div className="flex-1 flex items-center justify-end">
                                          <p
                                            className={cn(
                                              "text-sm ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            {option.commission_percent}%
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  {isMobile && (
                    <Drawer
                      shouldScaleBackground
                      setBackgroundColorOnScale
                      open={isOpen}
                      onOpenChange={setIsOpen}
                    >
                      <div className="relative md:hidden  w-full flex items-center">
                        {Icon && !selectedOption?.iconImage && (
                          <Icon
                            className={cn(
                              "absolute text-sm left-2 text-foreground z-10",
                              className?.icon
                            )}
                          />
                        )}
                        {!!selectedOption?.iconImage && (
                          <img
                            src={selectedOption.iconImage}
                            alt={selectedOption.label}
                            className={cn(
                              "absolute w-6 h-6 text-sm left-2 text-foreground z-10",
                              className?.optionImg
                            )}
                          />
                        )}
                        <DrawerTrigger asChild>
                          {/* <Input
                            ref={ref}
                            type="text"
                            placeholder={placeholder}
                            className={cn(
                              ` ps-[2.5rem] cursor-pointer text-foreground ${
                                errors[field.name] && "errInput"
                              }`,
                              className?.input
                            )}
                            value={field.value}
                            onChange={(e) => {
                              return;
                            }}
                          /> */}
                          <div
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                              "flex h-14 w-full rounded-[4px] border border-field bg-field px-[15px] py-3 text-[15px] leading-6 text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/60 disabled:cursor-not-allowed disabled:opacity-50",
                              ` ps-[2.5rem] cursor-pointer text-foreground ${
                                errors[field.name] && "errInput"
                              }`,
                              className?.input
                            )}
                          >
                            {selectedValueLabel}
                          </div>
                        </DrawerTrigger>
                        <div
                          onClick={() => setIsOpen(!isOpen)}
                          className="absolute right-2"
                        >
                          <DownArrow className="h-4 w-4 z-[100] text-foreground cursor-pointer" />
                        </div>
                      </div>
                      <DrawerContent className=" md:hidden block bg-background/80 backdrop-blur-md border  shadow-lg  max-h-[80vh] overflow-hidden">
                        <DrawerHeader>
                          <DrawerTitle>{label}</DrawerTitle>
                        </DrawerHeader>
                        <div className="flex flex-col justify-center items-center">
                          <Input
                            placeholder="Search"
                            className="px-4 py-1.5 h-10 w-[98%] rounded-md mb-2  bg-accent/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Separator className=" mb-2" />
                          <ScrollArea className="max-h-[80vh] h-full w-full">
                            <div className="flex mb-2 flex-col gap-2 w-full max-h-[80vh] p-1">
                              {!isFetching &&
                                options
                                  ?.filter((option) =>
                                    option.label
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase())
                                  )
                                  .map((option) => (
                                    <div
                                      key={option.id}
                                      className={cn(
                                        "px-4 py-2.5 text-foreground flex items-center gap-2 text-center text-[15px] hover:bg-field cursor-pointer w-full rounded-[4px]",
                                        field.value == option.value &&
                                          "bg-primary border-2 text-primary-foreground",
                                        option.disabled &&
                                          "opacity-50 cursor-not-allowed"
                                      )}
                                      onClick={() => {
                                        if (option.disabled) return;
                                        field.onChange(option.value);
                                        setSelectedOption(option);
                                        setIsOpen(false);
                                      }}
                                    >
                                      <img
                                        src={option.iconImage}
                                        alt={option.label}
                                        className={cn(
                                          "w-6 h-6",
                                          className?.optionImg,
                                          !option.iconImage && "hidden"
                                        )}
                                      />
                                      <div className="flex flex-col items-start justify-start">
                                        <p
                                          className={cn(
                                            "text-sm ",
                                            field.value == option.value &&
                                              " text-primary-foreground "
                                          )}
                                        >
                                          {option.label}
                                        </p>
                                        {option?.ID && (
                                          <p
                                            className={cn(
                                              "text-xs text-foreground ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            ID:{option.ID}
                                          </p>
                                        )}
                                        {option?.description && (
                                          <p
                                            className={cn(
                                              "text-xs text-foreground ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            {option.description}
                                          </p>
                                        )}
                                      </div>

                                      {typeof option?.hasMethod !==
                                        "undefined" && (
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            className={cn(
                                              "font-normal ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            {option?.hasMethod
                                              ? "Available"
                                              : "Not Available"}
                                          </Badge>
                                        </div>
                                      )}
                                      {typeof option?.amount !==
                                        "undefined" && (
                                        <div className="flex-1 flex items-center justify-end">
                                          <p
                                            className={cn(
                                              "text-sm ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            {option.amount}
                                          </p>
                                        </div>
                                      )}
                                         {typeof option?.commission_percent !==
                                        "undefined" && (
                                        <div className="flex-1 flex items-center justify-end">
                                          <p
                                             className={cn(
                                              "text-sm ",
                                              field.value == option.value &&
                                                " text-primary-foreground "
                                            )}
                                          >
                                            {option.commission_percent}%
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                            </div>
                          </ScrollArea>
                        </div>
                        {!isFetching &&
                          options?.filter((option) =>
                            option.label
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 text-sm py-1 text-foreground">
                              No results found
                            </div>
                          )}
                        {isFetching && (
                          <div className="px-4 text-sm py-1 flex items-center justify-center text-foreground">
                            <Spinner
                              size="sm"
                              className="text-foreground"
                              color="secondary"
                            />
                          </div>
                        )}
                      </DrawerContent>
                    </Drawer>
                  )}
                </div>
                <FormMessage />
              </div>
            </FormControl>
          </div>
        </FormItem>
      );

    case "textarea":
      return (
        <FormItem className={className?.main}>
          <div
            className={cn(
              "flex flex-col gap-2 text-background/80",
              className?.main
            )}
          >
            <FormLabel
              className={cn(
                "flex items-center gap-1 text-[15px] leading-6 font-normal text-muted-foreground",
                className?.label
              )}
            >
              {label && label}
              {label && <span className="text-primary">*</span>}
            </FormLabel>
            <FormControl>
              <div className="relative flex items-start">
                {Icon && (
                  <Icon
                    className={cn(
                      "absolute text-sm left-2 top-3 text-foreground",
                      className?.icon
                    )}
                  />
                )}
                <Textarea
                  id={`textarea-${label}`}
                  placeholder={placeholder}
                  rows={lines || 4}
                  maxLength={maxLength}
                  className={cn(
                    ` px-[1.7rem] rounded-[4px] text-foreground resize-none ${
                      errors[field.name] && "errInput"
                    }`,
                    className?.input
                  )}
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      );
    case "checkbox":
      return (
        <FormItem className={className?.main}>
          <div
            className={cn(
              "flex items-start gap-2 text-background/80",
              className?.main
            )}
          >
            <FormControl>
              <Checkbox
                id={`checkbox-${label}`}
                checked={checked}
                className={cn(
                  ` data-[state=checked]:bg-primary ${
                    errors[field.name] && "border-red-500"
                  }`,
                  className?.input
                )}
                {...field}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel
                htmlFor={`checkbox-${label}`}
                className={cn(
                  "text-[15px] leading-6 font-normal text-muted-foreground cursor-pointer",
                  className?.label
                )}
              >
                {label}
                {label && <span className="text-primary"></span>}
              </FormLabel>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      );
    case "date":
      return (
        <FormItem className={className?.main}>
          <div
            className={cn(
              "flex flex-col gap-2 text-background/80",
              className?.main
            )}
          >
            <FormLabel
              className={cn(
                "flex items-center gap-1 text-[15px] leading-6 font-normal text-muted-foreground",
                className?.label
              )}
            >
              {label && label}
              {label && isRequired && <span className="text-primary">*</span>}
            </FormLabel>
            <Popover>
              <FormControl>
                <div className="relative w-full flex items-center justify-end">
                  {Icon ? (
                    <Icon
                      className={cn(
                        "absolute text-sm left-2 text-foreground",
                        className?.icon
                      )}
                    />
                  ) : (
                    <CalendarIcon className="absolute text-sm left-2 text-foreground" />
                  )}
                  <Input
                    type="text"
                    placeholder={dateFormat || "dd-mm-yyyy"}
                    className={cn(
                      `w-full h-14 text-[15px] px-[1.7rem] py-3 text-left font-normal rounded-[4px] border ${
                        errors[field.name] && "border-red-500"
                      }`,
                      className?.input
                    )}
                    value={field.value || ""}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, "");

                      if (value.length > 8) return;

                      if (value.length > 4)
                        value = `${value.slice(0, 2)}-${value.slice(
                          2,
                          4
                        )}-${value.slice(4)}`;
                      else if (value.length > 2) {
                        value = `${value.slice(0, 2)}-${value.slice(2)}`;
                      }

                      field.onChange(value);
                    }}
                  />
                  <PopoverTrigger>
                    <DownArrow className="h-4 w-4 z-10 -translate-y-1.5 cursor-pointer absolute right-2" />
                  </PopoverTrigger>
                </div>
              </FormControl>
              <PopoverContent className="w-auto p-0" align="end">
                <>
                  <Calendar
                    className=" "
                    mode="single"
                    selected={
                      field.value
                        ? (() => {
                            const [day, month, year] = field.value.split("-");
                            return new Date(+year, +month - 1, +day);
                          })()
                        : undefined
                    }
                    onSelect={(e) => {
                      field.onChange(
                        format(e as Date, dateFormat || "dd-MM-yyyy")
                      );
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </div>
        </FormItem>
      );

    case "time":
      return (
        <FormItem className={className?.main}>
          <div
            className={cn(
              "flex flex-col gap-2 text-background/80",
              className?.main
            )}
          >
            <FormLabel
              className={cn(
                "flex items-center gap-1 text-[15px] leading-6 font-normal text-muted-foreground",
                className?.label
              )}
            >
              {label && label}
              {label && <span className="text-primary">*</span>}
            </FormLabel>
            <FormControl>
              <div className="relative flex items-center justify-end">
                {Icon ? (
                  <Icon
                    className={cn(
                      "absolute text-sm left-2  text-foreground",
                      className?.icon
                    )}
                  />
                ) : (
                  <Clock className="absolute text-sm left-2  text-muted-foreground" />
                )}
                <Input
                  type="time"
                  id={`time-${label}`}
                  className={cn(
                    ` text-foreground pl-8 ${errors[field.name] && "errInput"}`,
                    className?.input
                  )}
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      );

    case "switch":
      return (
        <FormItem className={className?.main}>
          <div
            className={cn(
              "flex items-center gap-2 text-background/80",
              className?.main
            )}
          >
            <FormControl>
              <Switch
                checked={checked}
                id={`switch-${label}`}
                className={cn(
                  `data-[state=checked]:bg-primary ${
                    errors[field.name] && "border-red-500"
                  }`,
                  className?.input
                )}
                {...field}
              />
            </FormControl>
            <FormLabel
              htmlFor={`switch-${label}`}
              className={cn(
                "text-[15px] leading-6 font-normal text-muted-foreground cursor-pointer",
                className?.label
              )}
            >
              {label}
              {label && <span className="text-primary"></span>}
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      );

    case "upload":
      return (
        <FormItem className={className?.main}>
          <div
            className={cn(
              "flex flex-col gap-2 text-background/80",
              className?.main
            )}
          >
            <FormLabel
              className={cn(
                "flex items-center gap-1 text-[15px] leading-6 font-normal text-muted-foreground",
                className?.label
              )}
            >
              {label && label}
              {label && isRequired && <span className="text-primary">*</span>}
            </FormLabel>
            <FormControl>
              <>
                <div className="relative flex items-center justify-end">
                  {Icon ? (
                    <Icon
                      className={cn(
                        "text-sm absolute left-2 text-foreground",
                        className?.icon
                      )}
                    />
                  ) : (
                    <UploadIcon className="text-sm absolute left-2 text-foreground" />
                  )}
                  <div
                    className={cn(
                      `  items-center justify-between  flex h-14 w-full rounded-[4px] border border-field bg-field text-[15px] shadow-none transition-colors text-foreground ps-[1.8rem] ${
                        errors[field.name] && "errInput"
                      } flex-1`,
                      className?.input
                    )}
                  >
                    <div className="flex items-center gap-2 text-foreground">
                      <span className="truncate max-w-[200px]">
                        {fileName || placeholder || "No file selected"}
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id={`upload-${label}`}
                      accept={acceptedFileTypes}
                      className="hidden"
                      onChange={async (e) => {
                        try {
                          setIsLoading(true);
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > maxFileSize * 1024 * 1024) {
                              e.target.value = "";
                              throw new Error(
                                `File size must be less than ${maxFileSize}MB`
                              );
                            }
                            const data = uploadFile(file);
                            setFileName(e.target.files?.[0]?.name || "");
                            setImagePreview(URL.createObjectURL(file));
                            field.onChange(file);
                            setIsLoading(false);
                            toast.success("File uploaded successfully");
                          }
                        } catch (error: any) {
                          toast.error(
                            error?.response?.data?.message ||
                              error?.message ||
                              "Something went wrong"
                          );
                          setFileName("");
                          field.onChange("");
                          setIsLoading(false);
                        }
                      }}
                    />
                  </div>
                  <AnimatedButton
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      " absolute w-3  md:text-sm text-xs text-foreground  rounded-2xl px-8 py-4",
                      className?.button
                    )}
                    spinner={
                      <Spinner
                        size="sm"
                        className="text-foreground"
                        color="secondary"
                      />
                    }
                    disabled={isLoading}
                    isLoading={isLoading}
                    text={field.value ? "Change" : buttonText}
                  />
                </div>
                {imagePreview && (
                  <div className="w-full  flex border border-foreground/10 rounded-lg p-2 gap-2 border-dashed items-center justify-center">
                    <div className="fitImage w-[50px] h-[50px] aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="image"
                        className="  "
                        width={500}
                        height={500}
                      />
                    </div>
                    <p className="text-sm text-foreground/50">
                      {fileName || placeholder || "No file selected"}
                    </p>
                    {/* <FaTrash className="w-4 h-4 text-foreground" /> */}
                  </div>
                )}
              </>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      );

    default:
      return null;
  }
};

export default FormGeneratorV2;
