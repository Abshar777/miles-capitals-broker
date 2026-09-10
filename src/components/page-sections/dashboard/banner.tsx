"use client";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import banner from "@/../public/banner1.png";
import React from "react";

const Banner = () => {
  return (
    <motion.div
      variants={item_variants}
      className="w-full h-40 md:flex hidden  fitImage relative  rounded-lg overflow-hidden"
    >
      <Image
        src={banner}
        alt="banner"
        className=""
        width={500}
        height={500}
      />
    </motion.div>
  );
};

export default Banner;
