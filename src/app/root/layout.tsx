import DashProvider from "@/components/providers/dashProvider";
import { Suspense } from "react";
import DashboardLoader from "./loading";
import DashboardWall from "@/components/providers/DashboardWall";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashProvider>
      <DashboardWall>
        <Suspense fallback={<DashboardLoader />}>{children}</Suspense>
      </DashboardWall>
    </DashProvider>
  );
}
