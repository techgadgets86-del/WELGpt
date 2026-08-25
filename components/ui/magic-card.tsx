"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#7c3aed",
  gradientOpacity = 0.8,
  gradientFrom = "#7c3aed",
  gradientTo = "#2dd4bf",
  ...props
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }
    },
    [mouseX, mouseY],
  );

  const handleMouseOut = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!e.relatedTarget) {
        document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
      }
    },
    [handleMouseMove, mouseX, gradientSize, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [handleMouseMove, mouseX, gradientSize, mouseY]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
    document.addEventListener("mouseout", handleMouseOut as unknown as EventListener);
    document.addEventListener("mouseenter", handleMouseEnter as unknown as EventListener);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
      document.removeEventListener("mouseout", handleMouseOut as unknown as EventListener);
      document.removeEventListener("mouseenter", handleMouseEnter as unknown as EventListener);
    };
  }, [handleMouseEnter, handleMouseMove, handleMouseOut]);

  return (
    <div
      ref={cardRef}
      className={cn("group relative flex size-full rounded-xl bg-neutral-900", className)}
      {...props}
    >
      <div className="absolute inset-px z-10 rounded-xl bg-[#111127] border border-white/10" />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl bg-border duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientFrom},
              ${gradientTo},
              transparent 100%
            )
          `,
          opacity: gradientOpacity / 2,
        }}
      />
      <div className="relative z-20 flex flex-col w-full h-full p-6">{children}</div>
    </div>
  );
}
