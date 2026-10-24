"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// Fades and lifts children into place once they scroll into view.
export function Reveal({
  delay = 0,
  y = 28,
  rotate = 0,
  as = "div",
  ...rest
}: { delay?: number; y?: number; rotate?: number; as?: "div" | "li" | "article" | "figure" } & HTMLMotionProps<"div">) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y, rotate: rotate ? rotate * 2 : 0 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ delay, type: "spring", stiffness: 140, damping: 20 }}
      {...rest}
    />
  );
}
