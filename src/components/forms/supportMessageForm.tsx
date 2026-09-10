"use client"
import React, { useRef, useEffect } from "react";
import { Form, FormField } from "@/components/ui/form";
import FormGeneratorV2 from "../global/form-generator/v2"; // Adjust path
import { FaTag, FaMessage, FaPaperPlane } from "react-icons/fa6";
import AnimatedButton from "../global/animatedButton"; // Adjust path
import { useRaiseTicket, useSendMesaage } from "@/hooks/useSupport"; // Adjust path
import { motion } from "framer-motion";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { useSupportUiStore } from "@/store/supportUiStore";
import { FileText, Paperclip, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SupportMessageForm = ({ ticketId }: { ticketId: string }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { form, onFormSubmit, errors, isSending, fileInputRef } = useSendMesaage(ticketId as string);

    const messageValue = form.watch("message");
    useEffect(() => {
        if (!messageValue && textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }, [messageValue]);

    return (
        <Form {...form}>
            <form
                onSubmit={onFormSubmit}
                className=" w-full "
            >  {form.watch("attachment") && (
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-medium w-fit">
                    <FileText className="w-3 h-3" />
                    <span className="truncate max-w-[200px]">{form.watch("attachment")?.name || "Untitled"}</span>
                    <button
                        type="button"
                        onClick={() => form.setValue("attachment", undefined)}
                        className="hover:text-destructive transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
                <div
                    className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant={"outline"}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending}
                        className="p-2 hover:bg-accent mt-2 border-none rounded-xl transition-colors text-muted-foreground"
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <textarea
                                ref={textareaRef}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (field.value.trim() && !isSending) {
                                            e.currentTarget.form?.requestSubmit();
                                        }
                                    }
                                }}
                                placeholder="Type your message… (Shift+Enter for new line)"
                                rows={1}
                                disabled={isSending}
                                style={{ maxHeight: "120px", overflowY: "auto" }}
                                className="flex-1 bg-muted border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none w-full"
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="attachment"
                        render={({ field }) => (
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                className="hidden"

                            />
                        )}
                    />
                    <Button
                        type="submit"

                        disabled={!form.watch("message").trim() || isSending}
                        className="p-2 mt-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {isSending ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default SupportMessageForm;