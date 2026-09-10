"use client";
import FundTabs from "@/components/page-sections/funds/fundstabs";
import PageContainer from "@/components/providers/page-container";

/** Reference funds frame: underline tabs on top, then the page content. */
export default function FundsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-6 w-full">
        <FundTabs />
        {children}
      </div>
    </PageContainer>
  );
}
