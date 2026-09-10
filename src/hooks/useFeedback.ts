"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutationData } from "./useMutation";
import { submitFeedback } from "@/api/feedback";
import { toast } from "sonner";

export const useFeedback = () => {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number>(3);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { mutate, isPending } = useMutationData(
    ["submitFeedback"],
    (data: { rating: number; comment?: string }) =>
      submitFeedback(session?.user?.token as string, data),
    ["submitFeedback"],
    () => {
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    },
    () => {
      toast.error("Failed to submit feedback. Please try again.");
    },
  );

  const onSubmit = () => {
    mutate({ rating, comment: comment.trim() || undefined });
  };

  const onReset = () => {
    setRating(3);
    setComment("");
    setSubmitted(false);
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    submitted,
    isPending,
    onSubmit,
    onReset,
  };
};
