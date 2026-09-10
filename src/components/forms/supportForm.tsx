"use client"
import React from "react";
import { Form, FormField } from "@/components/ui/form";
import FormGeneratorV2 from "../global/form-generator/v2"; // Adjust path
import { FaTag, FaMessage, FaPaperPlane } from "react-icons/fa6";
import AnimatedButton from "../global/animatedButton"; // Adjust path
import { useRaiseTicket } from "@/hooks/useSupport"; // Adjust path
import { motion } from "framer-motion";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { FileText, Paperclip, X } from "lucide-react";
import { Button } from "../ui/button";

const SupportForm = () => {
    const { form, onFormSubmit, errors, isPending, fileInputRef } = useRaiseTicket();

    return (
        <Form {...form}>
            <form
                onSubmit={onFormSubmit}

            >
                <motion.div variants={container_variants} initial="hidden" animate="visible" className="space-y-6 ">
                    <div
                        className="flex flex-col gap-4">
                        <motion.div variants={item_variants} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormGeneratorV2
                                        inputType="input"
                                        label="Subject"
                                        Icon={FaTag}
                                        field={field}
                                        errors={errors}
                                        placeholder="What is this regarding?"
                                        className={{
                                            input: "w-full bg-muted-foreground/10 dark:bg-muted border-muted-foreground/20",
                                            main: "w-full",
                                        }}
                                    />
                                )}
                            />
                        </motion.div>

                        <motion.div variants={item_variants} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormGeneratorV2
                                        inputType="textarea"
                                        label="Message"
                                        Icon={FaMessage}
                                        field={field}
                                        errors={errors}
                                        lines={5}
                                        placeholder="Describe your issue or question in detail..."
                                        className={{
                                            input: "w-full bg-muted-foreground/10 dark:bg-muted border-muted-foreground/20",
                                            main: "w-full",
                                        }}
                                    />
                                )}
                            />
                        </motion.div>
                        <motion.div variants={item_variants} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="attachment"
                                render={({ field }) => (
                                    <>
                                        <label className="text-sm font-semibold">Attachment (Optional)</label>

                                        <div className="flex mt-1 items-center gap-2">
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center border-none "
                                            >
                                                <Paperclip className="w-4 h-4" />
                                                Choose File
                                            </Button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                                className="hidden"

                                            />
                                            {field.value && (
                                                <div className="flex items-center gap-2 bg-primary/10 h-full text-primary px-3 py-2 rounded-lg text-xs font-medium">
                                                    <FileText className="w-3 h-3" />
                                                    <span className="truncate max-w-[150px]">{field.value.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange(null)}
                                                        className="hover:text-destructive transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            />
                        </motion.div>
                    </div>


                    <motion.div variants={item_variants} className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p className="text-xs text-blue-500">
                            Our support team typically responds within 24 hours. Please provide as much detail as possible to help us assist you faster.
                        </p>
                    </motion.div >


                    <motion.div variants={item_variants} className="flex justify-end">
                        <AnimatedButton
                            size="md"
                            type="submit"
                            className="w-full md:w-min"
                            isLoading={isPending}
                            text="Submit Ticket"

                        />
                    </motion.div >
                </motion.div>
            </form>
        </Form>
    );
};

export default SupportForm;