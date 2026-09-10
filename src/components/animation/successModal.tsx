"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"
import { useModalStore } from "@/store/successModalUiStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function SuccessModal({children}:{children:React.ReactNode}) {
  const { isOpen, title, message, closeSuccessModal } = useModalStore()

  return (
    <Dialog open={isOpen} onOpenChange={closeSuccessModal}>
      <DialogContent className=" border-0 p-0 overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                type: "spring",
                duration: 0.3,
                bounce: 0.1,
              }}
              className="relative rounded-lg"
            >
              {/* Header with close button */}
            

              {/* Success content */}
              <div className="flex flex-col items-center text-center p-8 pt-12">
                {/* Animated success icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    duration: 0.6,
                    delay: 0.1,
                    bounce: 0.3,
                  }}
                  className="mb-6"
                >
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                        delay: 0.3,
                      }}
                      className="absolute inset-0 bg-primary/20 scale-150 rounded-full"
                    />
                    <CheckCircle className="relative h-16 w-16 text-primary" />
                  </div>
                </motion.div>

                {/* Animated title */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    delay: 0.2,
                  }}
                >
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl text-center font-semibold ">{title}</DialogTitle>
                  </DialogHeader>
                </motion.div>

                {/* Animated message */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    delay: 0.3,
                  }}
                  className=" mb-8 max-w-sm"
                >
                  {message}
                </motion.p>

                {children}

                {/* Animated button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    delay: 0.4,
                  }}
                >
                  <Button
                
                    onClick={closeSuccessModal}
                    className="bg-primary mt-4 hover:bg-primary/50 text-white px-8 py-2 rounded-lg font-medium transition-colors"
                  >
                    Continue
                  </Button>
                </motion.div>
              </div>

              {/* Animated background decoration */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                transition={{
                  type: "spring",
                  duration: 1,
                  delay: 0.5,
                }}
                className="absolute -top-10 -right-20 w-32 h-32 bg-primary rounded-full "
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                transition={{
                  type: "spring",
                  duration: 1,
                  delay: 0.7,
                }}
                className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary rounded-full "
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
