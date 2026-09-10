import React from "react";
import pkg from "@/../package.json";

const AuthFooter = () => (
  <footer className="h-12 shrink-0 flex items-center justify-end px-8 text-[12px] leading-5 text-muted-foreground select-none">
    {pkg.version}
  </footer>
);

export default AuthFooter;
