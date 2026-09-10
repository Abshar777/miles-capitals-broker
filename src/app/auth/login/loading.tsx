import { Skeleton } from "@/components/ui/skeleton";

const Authloading = () => {
  return (
    <div className="flex-1 flex flex-col items-center px-4 pt-6 sm:pt-10">
      <div className="w-full max-w-[480px] rounded-lg border border-border p-6 sm:p-10 flex flex-col gap-4">
        <Skeleton className="h-8 w-1/2 mx-auto rounded-[4px] bg-field" />
        <Skeleton className="h-4 w-1/3 mx-auto rounded-[4px] bg-field" />
        <Skeleton className="h-6 w-16 mt-2 rounded-[4px] bg-field" />
        <Skeleton className="h-14 w-full rounded-[4px] bg-field" />
        <Skeleton className="h-6 w-20 rounded-[4px] bg-field" />
        <Skeleton className="h-14 w-full rounded-[4px] bg-field" />
        <Skeleton className="h-14 w-32 mt-2 rounded-[4px] bg-field" />
      </div>
    </div>
  );
};

export default Authloading;
