"use client"
import { item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";

  interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <motion.div
     variants={item_variants}
     initial={"hidden"}
     animate={"visible"}
     >
      <h2 className='md:text-3xl text-2xl capitalize font-bold tracking-tight'>{title}</h2>
      <p className='md:text-sm text-xs w-full text-muted-foreground mt-1'>{description}</p>
    </motion.div>
  );
};
