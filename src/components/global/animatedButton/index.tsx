"use client";
import { Spinner } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";
import { useWebHaptics, } from "web-haptics/react";
import { defaultPatterns } from "web-haptics";

interface Props {
  isLoading: boolean;
  text: string;
  loadingText?: string;
  color?:
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  spinner?: React.JSX.Element;
  disabled?: boolean;
  link?: string;
  onClick?: (e?: any) => void;
  icon?: React.JSX.Element;
}

const AnimatedButton = ({
  isLoading,
  text,
  loadingText = "Loading",
  color = "primary",
  size = "lg",
  className,
  type = "button",
  spinner = <Spinner size="sm" className="text-primary-foreground" color="white" />,
  disabled = false,
  onClick,
  link,
  icon,
}: Props) => {
  const { trigger, isSupported, } = useWebHaptics();

  const handleClick = (e: any) => {
    if (onClick) {
      console.log("click");
      onClick(e);
    }
    if (isSupported) {

      trigger(defaultPatterns.success)
    }
    // audioRef.current?.play();
  };
  return (
    <>
      {/* <audio
        src="/audio/tap.mp3"
        ref={audioRef}
        autoPlay
      /> */}
      <Button
        suppressHydrationWarning
        disabled={disabled}
        isLoading={isLoading}
        type={type}
        color={color}
        size={size}
        // style={{color:"black"}}
        onPress={(e) => {
          console.log("click");
          handleClick(e);

          // audioRef.current?.play();
        }}
        className={cn(
          "w-full font-normal text-[13.33px] rounded-[4px] cursor-pointer outline outline-1 -outline-offset-1 outline-transparent transition-[outline-color,filter] duration-150 ease-in-out disabled:cursor-not-allowed data-[hover=true]:opacity-100 data-[pressed=true]:scale-100",
          color === "primary" && "bg-primary text-black data-[hover=true]:brightness-110 data-[hover=true]:outline-primary disabled:text-black/30 disabled:opacity-100 [&_p]:text-black",
          color === "secondary" && "bg-field text-foreground data-[hover=true]:outline-primary/40 disabled:opacity-50 [&_p]:text-foreground",
          className,
          color === "primary" && ""
        )}
        spinner={null}
        startContent={icon}
      >
        <AnimatePresence mode="wait">
          {!isLoading ? (
            <motion.p
              key={text}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {link ? (
                // <Link className="no-underline" href={link}>
                <>{text}</>
                // </Link>
              ) : (
                text
              )}
            </motion.p>
          ) : (
            <motion.div
              key="loading"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center gap-2"
            >
              {loadingText}
              {spinner}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </>
  );
};

export default AnimatedButton;
