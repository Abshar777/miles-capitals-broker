"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { TUserProfileApiResponse } from "@/types/api.response";
import { cn, formatIST } from "@/lib/utils";
import { item_variants } from "@/constants/framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@heroui/react";
import { statusBadge } from "@/constants/curency";
import {
  ShieldCheck,
  Mail,
  CalendarDays,
  UserRound,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

type Props = {
  user: TUserProfileApiResponse;
  isLoading: boolean;
  className?: string;
};

export function ProfileHeader({ user, className, isLoading }: Props) {
  const router = useRouter();

  const initials =
    (user?.firstname?.[0] || "").toUpperCase() +
    (user?.lastname?.[0] || "").toUpperCase();

  const kycVariant =
    statusBadge[user?.kyc_status?.toLowerCase() as keyof typeof statusBadge];

  return (
    <motion.div variants={item_variants} className={cn("h-full", className)}>
      <Card className="h-full overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-primary" />

        <CardContent className="flex flex-col items-center gap-5 pt-8 pb-6 px-5 h-full">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <>
              {/* ── Avatar with gradient ring ── */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.05,
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                }}
                className="relative"
              >
                {/* Soft gradient halo */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg scale-110 pointer-events-none" />
                {/* Ring */}
                <div className="relative p-[3px] rounded-full bg-gradient-to-br from-primary via-primary/60 to-primary/20">
                  <Avatar className="h-24 w-24 bg-card">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {initials || <UserRound className="h-10 w-10" />}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* Online dot */}
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card shadow-sm" />
              </motion.div>

              {/* ── Name & email ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.12,
                  type: "spring",
                  stiffness: 180,
                }}
                className="text-center space-y-1 w-full"
              >
                <h2 className="text-lg font-bold text-foreground leading-tight">
                  {user?.firstname} {user?.lastname}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[200px]">{user?.email}</span>
                </p>
              </motion.div>

              {/* ── Status badges ── */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, type: "spring", stiffness: 180 }}
                className="flex flex-wrap items-center justify-center gap-2"
              >
                <Badge
                  variant={user?.is_verified ? "success" : "warning"}
                  className="gap-1 text-xs font-medium"
                >
                  <ShieldCheck className="h-3 w-3" />
                  {user?.is_verified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant={kycVariant as any} className="text-xs font-medium capitalize">
                  KYC: {user?.kyc_status || "pending"}
                </Badge>
              </motion.div>

              {/* ── Joined date ── */}
              {user?.created_at && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.22 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Member since{" "}
                    {formatIST(user.created_at, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </motion.div>
              )}

              {/* ── Verification CTA ── */}
              {!user?.is_verified && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                  className="w-full"
                >
                  <Button
                    size="sm"
                    className="w-full gap-2 rounded-xl text-sm"
                    onClick={() => router.push("/root/verification")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Complete Verification
                    <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
                  </Button>
                </motion.div>
              )}

              {/* ── Verified user — view profile button ── */}
              {user?.is_verified && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                  className="w-full mt-auto"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 rounded-xl text-sm"
                    onClick={() => router.push("/root/verification")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                    View Verification
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
