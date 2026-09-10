import { Skeleton } from "@/components/ui/skeleton";
const Authloading = () => {
  return (
    <div className="flex h-lvh md:w-[90%] w-full  md:h-lvh flex-col items-center  pt-30">
      <div className="grid w-full gap-5 mb-4 text-start">
          <Skeleton   className="h-8  backdrop-blur-3xl  w-[50%] rounded-full" />
          <Skeleton className="h-8  w-[30%] rounded-full" />
        </div>
        <div className="grid w-full gap-4">
          <div className="grid w-[80%] grid-cols-6 gap-2">
            <Skeleton className="h-18 w-full  rounded-3xl" />
            <Skeleton className="h-18 w-full  rounded-3xl" />
            <Skeleton className="h-18 w-full  rounded-3xl" />
            <Skeleton className="h-18 w-full  rounded-3xl" />
            <Skeleton className="h-18 w-full  rounded-3xl" />
            <Skeleton className="h-18 w-full  rounded-3xl" />
          </div>
          
          <Skeleton className="h-10 w-[80%]  rounded-full" />
        </div>
    </div>
  );
};

export default Authloading;
