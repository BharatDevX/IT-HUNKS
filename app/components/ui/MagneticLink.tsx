"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
};

export default function MagneticLink({
  href,
  children,
  className = "",
  strength = 0.2,
}: MagneticLinkProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.35 });

  const handleMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength);
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength);
  };

  return (
    <motion.div style={reduceMotion ? undefined : { x: springX, y: springY }}>
      <Link
        href={href}
        onPointerMove={handleMove}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}
