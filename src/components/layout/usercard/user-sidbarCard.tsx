"use client";

import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { Button, CircularProgress } from "@heroui/react";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useUserStore } from "@/store/userStore";
import { IoLogOut } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "nextjs-toploader/app";

const UserSidbarCard = () => {
  const { state } = useSidebar();
  const { isKYCVerified } = useUserStore();
  const { data: session } = useSession();
  const { user, isLoading, isError } = useUser();
  const router = useRouter();
  const progress =
    user?.kyc_status === "pending"
      ? 50
      : user?.kyc_status === "approved"
      ? 100:
      user?.kyc_status === "submitted"
      ? 75
      : 50;
    
  const strokeDasharray = 283;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  return (
    <>
      {state == "expanded" && (
       <div className="px-2">
         <Card className="w-full bg-background overflow-hidden relative border-none flex flex-col  items-center justify-center gap-2">
          <div className="relative">
            
          <CircularProgress
                  value={
                    user?.kyc_status === "pending"
                      ? 50
                      : user?.kyc_status === "approved"
                      ? 100
                      : 0
                  }
                  size="lg"
                  classNames={{
                    svg: "w-22 h-22  drop-shadow-md",
                    indicator: "stroke-primary stroke-2",
                    track: "stroke-primary/10 stroke-2",
                    value: "text-sm  font-bold text-primary",
                  }}
                  color="primary"
                  // showValueLabel={true}
                /> 

            {/* Avatar in center of progress circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="w-[4rem] h-[4rem] opacity-50">
                <AvatarImage src={session?.user?.image || "/avatar.png"} />
                <AvatarFallback className="bg-foreground/80 text-background">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute   text-primary text-xs font-bold px-2 py-1 rounded-full">
                {progress}%
              </div>
            </div>

            {/* Progress percentage - positioned at top right */}
          </div>

          {/* User Info */}
          <div className="text-center space-y-1">
            <h3 className="text-foreground font-medium text-lg">
              {session?.user?.name || "User Name"}
            </h3>
            <p className="text-muted-foreground text-xs">
              {session?.user?.email || "user@example.com"}
            </p>
          </div>

          {/* Profile Manage Button */}
          <Button
            size="sm"
            onPress={()=>{

              router.push("/root/profile");
            }}
            variant="solid"
            className="w-[80%] cursor-pointer bg-primary  capitalize   text-white border-none"
          >
            profile manage
          </Button>
          <img src="/svgs/waveBg.svg" className="absolute pointer-events-none top-[20%] w-full h-full brightness-[.5] "/>
        </Card>
       </div>
      )}
      {state == "collapsed" && (
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent bg-sidebar-accent hover:bg-sidebar-accent/70 data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || ""}
                />
                <AvatarFallback className="rounded-lg">
                  {session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {session?.user?.name || ""}
                </span>
                <span className="truncate text-xs">
                  {session?.user?.email || ""}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            side="right"
            // sideOffset={20}
            // alignOffset={20} 
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 focus:bg-white/5 focus:border-white/10">
                verification
                <DropdownMenuShortcut className="opacity-100">
                  {" "}
                  {isKYCVerified ? (
                    <Badge className="bg-green-500/20 border hover:bg-green-500/30 border-green-500/30 text-green-500">
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 border text-red-500 border-red-500/30 hover:bg-red-500/30 hover:border-red-500/40">
                      Pending
                    </Badge>
                  )}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="bg-red-600/20 focus:bg-red-600/30 focus:border-red-600/40 backdrop-blur-sm border border-red-600/30"
              onClick={() => signOut()}
            >
              Log out
              <DropdownMenuShortcut>
                <IoLogOut className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserSidbarCard;
