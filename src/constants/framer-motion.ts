"use client"
import { Variants } from "framer-motion";

export const item_variants:Variants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
        }

    }
}

export const container_variants: Variants = {
    hidden: {
        opacity: 0,
        y: 0
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.2,
        }
    }

}

export const button_variants:Variants = {
    hidden: {
        opacity: 0,
        y: 10
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
        }
    }
}
export const button_variants_opposite:Variants   = {
    hidden: {
        opacity: 0,
        y: -10

    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
        }
    }
}
