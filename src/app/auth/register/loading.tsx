import { Skeleton } from "@/components/ui/skeleton";
const Authloading = () => {
  return (
    <div className="flex h-lvh md:w-[90%] w-full  md:h-lvh flex-col items-center  pt-10">
      <div className="grid w-full gap-5 mb-4 text-start">
        <Skeleton className="h-8  backdrop-blur-3xl  w-[50%] rounded-full" />
        <Skeleton className="h-8  w-[30%] rounded-full" />
      </div>
      <div className="grid w-full gap-4">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full  rounded-full" />
          <Skeleton className="h-10 w-full  rounded-full" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Skeleton className="h-10 w-full  rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full  rounded-full" />
          <Skeleton className="h-10 w-full  rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-10 w-full  rounded-full" />
          <Skeleton className="h-10 w-full col-span-2 rounded-full" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Skeleton className="h-10 w-full  rounded-full" />
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Skeleton className="h-10 w-full  rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-[50%]  rounded-full" />
      </div>
    </div>
  );
};

export default Authloading;
