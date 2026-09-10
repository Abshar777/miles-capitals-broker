import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const TooltipReuse = ({
  children,
  trigger,
  className,
  placement,

  arowClassName,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  placement?: "top" | "bottom" | "left" | "right";
  color?:
    | "default"
    | "secondary"
    | "foreground"
    | "success"
    | "danger"
    | "warning"
    | "info";
  arowClassName?: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      
      <TooltipContent   className={className} arowClassName={arowClassName}>
        {children}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipReuse;
