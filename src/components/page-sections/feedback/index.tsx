"use client";
import { Icon } from "@/components/ui/icon";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFeedback } from "@/hooks/useFeedback";
import { item_variants } from "@/constants/framer-motion";
import AnimatedButton from "@/components/global/animatedButton";

// ─── Emoji data ──────────────────────────────────────────────────────────────
const EMOJIS = [
  { value: 1, emoji: "😢", label: "Terrible", color: "#ef4444", glow: "rgba(239,68,68,0.4)", pulse: "rgba(239,68,68,0.15)" },
  { value: 2, emoji: "😔", label: "Bad", color: "#f97316", glow: "rgba(249,115,22,0.4)", pulse: "rgba(249,115,22,0.15)" },
  { value: 3, emoji: "😑", label: "Neutral", color: "#eab308", glow: "rgba(234,179,8,0.4)", pulse: "rgba(234,179,8,0.15)" },
  { value: 4, emoji: "🙂", label: "Good", color: "#22c55e", glow: "rgba(34,197,94,0.4)", pulse: "rgba(34,197,94,0.15)" },
  { value: 5, emoji: "🥰", label: "Excellent", color: "#16a34a", glow: "rgba(22,163,74,0.4)", pulse: "rgba(22,163,74,0.15)" },
] as const;

// Stagger variants for the emoji row entrance
const rowVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const emojiVariants: any = {
  hidden: { opacity: 0, y: 20, scale: 0.6 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

// ─── Emoji picker ─────────────────────────────────────────────────────────────
function EmojiPicker({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (v: number) => void;
}) {
  const selected = EMOJIS.find((e) => e.value === rating)!;

  return (
    // LayoutGroup lets the shared layoutId="glow" morph between emoji positions
    <LayoutGroup>
      <motion.div
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        className="flex items-end justify-center gap-3 sm:gap-5 py-5 sm:py-8"
      >
        {EMOJIS.map((item) => {
          const isSelected = rating === item.value;

          return (
            <motion.div
              key={item.value}
              variants={emojiVariants}
              className="relative flex flex-col items-center"
            >

              {/* ── Shared glow — layoutId causes it to slide between emojis ── */}
              {isSelected && (
                <motion.div
                  layoutId="feedback-glow"
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-22%",
                    background: `radial-gradient(circle, ${item.glow} 15%, transparent 68%)`,
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 30 }}
                />
              )}

              {/* ── Emoji button ── */}
              <motion.button
                type="button"
                onClick={() => setRating(item.value)}
                animate={{
                  scale: isSelected ? 1.3 : 1,
                  filter: isSelected
                    ? "grayscale(0%) drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
                    : "grayscale(85%) brightness(0.88)",
                }}
                whileHover={{
                  scale: isSelected ? 1.35 : 1.14,
                  filter: "grayscale(0%) brightness(1.05)",
                }}
                whileTap={{ scale: isSelected ? 1.22 : 1.05 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="relative z-10 text-4xl sm:text-5xl leading-none select-none transition-all duration-300 ease-in-out cursor-pointer outline-none"
                aria-label={item.label}
              >
                {item.emoji}
              </motion.button>

              {/* ── Label pill ── */}
              <div className="mt-3 h-9 flex items-start justify-center">
                <AnimatePresence mode="wait">
                  {isSelected && (
                    <motion.div
                      key={`label-${item.value}`}
                      initial={{ opacity: 0, y: -10, scale: 0.75 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 340, damping: 28 }}
                      className="flex flex-col items-center"
                    >
                      {/* Arrow */}
                      <div
                        className="w-0 h-0 mb-[3px]"
                        style={{
                          borderLeft: "5px solid transparent",
                          borderRight: "5px solid transparent",
                          borderBottom: `5px solid ${item.color}`,
                        }}
                      />
                      {/* Pill */}
                      <motion.span
                        layoutId="feedback-label"
                        className="px-2 h-4 inline-flex items-center rounded-[4px] text-[10px] leading-4 text-black whitespace-nowrap"
                        style={{ backgroundColor: item.color }}
                        transition={{ type: "spring", stiffness: 220, damping: 30 }}
                      >
                        {item.label}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </LayoutGroup>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      className="flex flex-col items-center gap-5 py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 220, damping: 18 }}
        className="flex size-10 items-center justify-center rounded-full bg-field"
      >
        <Icon name="success-16" size={16} className="size-4 text-positive" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, type: "spring", stiffness: 160 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-[24px] leading-8 font-medium text-foreground">Thank you!</h2>
        <p className="text-[15px] leading-6 text-muted-foreground max-w-xs mx-auto">
          Your feedback has been submitted. We really appreciate you taking the
          time to share your thoughts.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, type: "spring", stiffness: 160 }}
      >
        <Button
          variant="outline"
          className="gap-2"
          onClick={onReset}
        >
          <Icon name="reset-16" size={16} />
          Submit another
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function FeedbackSection() {
  const {
    rating,
    setRating,
    comment,
    setComment,
    submitted,
    isPending,
    onSubmit,
    onReset,
  } = useFeedback();

  return (
    <motion.div
      variants={item_variants}
      className="flex w-full items-start justify-center pt-4"
    >
      <div className="w-full max-w-[480px] rounded-[4px] border border-border bg-background overflow-x-clip">
        {/* Header */}


        {/* Body */}
        <div className="px-6 pb-6 pt-6">
          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessScreen key="success" onReset={onReset} />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 140 }}
                  className="text-center"
                >
                  <h1 className="text-[18px] leading-6 font-medium text-foreground">
                    How was your experience?
                  </h1>
                  <p className="mt-2 text-[15px] leading-6 text-muted-foreground max-w-xs mx-auto">
                    Your input is valuable in helping us better understand your
                    needs and tailor our service accordingly.
                  </p>
                </motion.div>

                {/* Emoji picker */}
                <EmojiPicker rating={rating} setRating={setRating} />

                {/* Comment */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 140 }}
                >
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment… (optional)"
                    rows={4}
                    className="w-full resize-none rounded-[4px] border-field bg-field text-[15px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary/60"
                  />
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, type: "spring", stiffness: 140 }}
                  className="mt-4"
                >
                  {/* <Button
                    onClick={onSubmit}
                    disabled={isPending}
                    className="w-full gap-2 rounded-xl py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    {isPending ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
                        className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isPending ? "Submitting…" : "Submit Now"}
                  </Button> */}
                  <AnimatedButton
                    onClick={onSubmit}
                    disabled={isPending}
                    text={isPending ? "Submitting…" : "Submit Now"}
                    isLoading={isPending}

                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
