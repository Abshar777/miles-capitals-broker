"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import React from "react";


import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import Mt5ToMt5Form from "@/components/forms/mt5Tomt5Form";

const Mt5ToMt5Card = () => {
  return (
    <motion.div className="md:col-span-2" variants={item_variants}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl ">MT5 To MT5 Transfer</CardTitle>
          <CardDescription className="-translate-y-2">
            Transfer funds between your MT5 accounts
          </CardDescription>
        </CardHeader>
        <div className="w-full px-4 mb-4">
          <Separator />
        </div>
        <CardContent className="relative pb-[6rem] overflow-hidden">
          <Alert className="mb-4 bg-blue-600/10 border-blue-500/20">
            <AlertTitle>Note!</AlertTitle>
            <AlertDescription>
              You can transfer funds between your MT5 accounts.
            </AlertDescription>
          </Alert>
          <Mt5ToMt5Form />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Mt5ToMt5Card;
