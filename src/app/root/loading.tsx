"use client"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { container_variants, item_variants } from "@/constants/framer-motion"
import PageContainer from "@/components/providers/page-container"

const SkeletonBox = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
 >
 <Skeleton className={className+" bg-accent-foreground/20"} />
 </motion.div>
)

const CircularProgress = ({ delay = 0 }: { delay?: number }) => (
  <motion.div  initial={{ opacity: 0, scale: 0.8, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ delay, duration: 0.8, ease: "easeOut" }} className="relative w-16 h-16">
    <Skeleton
    
      className="absolute bg-accent-foreground/20 inset-0 rounded-full "
     
     
    />
    <Skeleton
      className="absolute bg-accent-foreground/20 inset-0 rounded-full "
   
    />
  </motion.div>
)






export default function DashboardLoader() {
  const sidebarItems = [
    "Dashboard",
    "Wallet",
    "Mt5",
    "Funds",
    "Transactions",
    "Help Desk",
    "B2Copy",
    "IB Room",
    "Pamm",
    "Savings",
  ]

  return (
    <PageContainer  scrollable={true}>
    <div className="min-h-screen w-full bg-background text-foreground">
    

      <motion.div initial="hidden"
        animate="visible"
        variants={container_variants} className="flex">
     

        {/* Main Content */}
        <main className="flex-1 md:p-6 p-1">
          {/* Welcome Message */}
          <motion.div
            className="mb-6"
            variants={item_variants}
          >
            <motion.div initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }} className="flex items-center space-x-2">
              <SkeletonBox className="w-8 h-8" />
              <SkeletonBox className="w-48 h-8" delay={0.1} />
              <SkeletonBox className="w-8 h-8" delay={0.2} />
            </motion.div>
          </motion.div>

          {/* Identity Verification Card */}
          <motion.div
            className="bg-card   rounded-lg md:p-6 p-4 mb-6"
            variants={item_variants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CircularProgress delay={0.3} />
                <div>
                  <SkeletonBox className="w-64 h-6 mb-2" />
                  <SkeletonBox className="w-96 h-4" delay={0.1} />
                </div>
              </div>
              <SkeletonBox className="w-24 h-10 rounded-lg" delay={0.2} />
            </div>
          </motion.div>

          {/* Promotional Banner */}
          <motion.div
            variants={item_variants}
            className="bg-card rounded-lg p-6 mb-6 relative overflow-hidden"
           
          >
            <motion.div  initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }} className="relative z-10">
              <SkeletonBox className="w-80 h-8 mb-2" />
              <SkeletonBox className="w-96 h-6 mb-2" delay={0.1} />
              <SkeletonBox className="w-72 h-6 mb-4" delay={0.2} />
              <SkeletonBox className="w-64 h-1 rounded-full" delay={0.3} />
            </motion.div>
            <div className="absolute right-4 top-4">
              <SkeletonBox className="w-32 h-24 rounded" delay={0.4} />
            </div>
          </motion.div>

          {/* Balance and Transactions Section */}
          <motion.div variants={item_variants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Balance */}
            <motion.div
              className="bg-card rounded-lg p-6"
             
            >
              <motion.div initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }} className="flex items-center justify-between mb-4">
                <SkeletonBox className="w-32 h-6" />
                <div className="flex space-x-2">
                  <SkeletonBox className="w-12 h-8 rounded-full" />
                  <SkeletonBox className="w-16 h-8 rounded-full" delay={0.1} />
                  <SkeletonBox className="w-20 h-8 rounded-full" delay={0.2} />
                </div>
              </motion.div>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-accent rounded-lg"
                   
                  >
                    <SkeletonBox className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <SkeletonBox className="w-24 h-4 mb-2" />
                      <SkeletonBox className="w-32 h-3" delay={0.1} />
                    </div>
                    <SkeletonBox className="w-16 h-6" delay={0.2} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Last Transactions */}
            <motion.div
              className="bg-card rounded-lg p-6"
             
            >
              <motion.div initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }} className="flex items-center justify-between mb-4">
                <SkeletonBox className="w-40 h-6" />
                <div className="flex space-x-2">
                  <SkeletonBox className="w-12 h-8 rounded-full" />
                  <SkeletonBox className="w-16 h-8 rounded-full" delay={0.1} />
                  <SkeletonBox className="w-20 h-8 rounded-full" delay={0.2} />
                </div>
              </motion.div>
              <motion.div variants={item_variants} className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-accent rounded-lg"

                  >
                    <div className="flex items-center space-x-3">
                      <SkeletonBox className="w-10 h-10 rounded-full" />
                      <div>
                        <SkeletonBox className="w-20 h-4 mb-1" />
                        <SkeletonBox className="w-16 h-3" delay={0.1} />
                      </div>
                    </div>
                    <div className="text-right">
                      <SkeletonBox className="w-16 h-4 mb-1" />
                      <SkeletonBox className="w-12 h-3" delay={0.1} />
                    </div>
                  </div>
                ))}
              </motion.div>
              </motion.div>
          </motion.div>
        </main>
      </motion.div>
    </div>
    </PageContainer>
  )
}
