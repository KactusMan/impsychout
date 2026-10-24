"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// Fades and lifts children into place once they scroll into view.
export function Reveal({
  delay = 0,
  y = 18,
  rotate = 0,
  as = "div",
  ...rest
}: { delay?: number; y?: number; rotate?: number; as?: "div" | "li" | "article" | "figure" } & HTMLMotionProps<"div">) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    />
  );
}
