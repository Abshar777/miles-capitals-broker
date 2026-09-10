"use client"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { container_variants, item_variants } from "@/constants/framer-motion";

const SkeletonBox = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
  >
    <Skeleton className={className + " bg-accent/50"} />
  </motion.div>
)



export default function WalletsLoader() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={container_variants} className="mb-6">
        <motion.div variants={item_variants} className="flex items-center space-x-3">
          <SkeletonBox className="w-10 h-10 rounded-full" />
          <SkeletonBox className="w-40 h-8" delay={0.1} />
        </motion.div>
      </motion.div>

      {/* Estimated Total */}
      <motion.div variants={item_variants} className="mb-8">
        <SkeletonBox className="w-32 h-4 mb-2" />
        <SkeletonBox className="w-48 h-8" delay={0.1} />
      </motion.div>

      {/* Search + Filter */}
      <motion.div variants={item_variants} className="flex items-center space-x-4 mb-8">
        <SkeletonBox className="w-64 h-10 rounded-lg" />
        <SkeletonBox className="w-40 h-10 rounded-lg" delay={0.1} />
        <SkeletonBox className="w-10 h-10 rounded-lg" delay={0.2} />
      </motion.div>

      {/* Wallet Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container_variants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={item_variants}
            className="bg-card rounded-xl p-6 flex flex-col items-start space-y-4"
          >
            <SkeletonBox className="w-12 h-12 rounded-full" delay={i * 0.1} />
            <SkeletonBox className="w-24 h-6" delay={i * 0.1 + 0.1} />
            <SkeletonBox className="w-32 h-4" delay={i * 0.1 + 0.2} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
