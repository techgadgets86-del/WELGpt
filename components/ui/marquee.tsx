import { cn } from "@/lib/utils";
import React from "react";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  direction?: "left" | "right" | "up" | "down";
  repeat?: number;
  className?: string;
}

export function Marquee({
  className,
  pauseOnHover = false,
  direction = "left",
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      style={{ '--gap': '1rem', '--duration': '40s', gap: '1rem', ...props.style } as React.CSSProperties}
      className={cn(
        "group flex overflow-hidden p-2 [gap:var(--gap)]",
        {
          "flex-row": direction === "left" || direction === "right",
          "flex-col": direction === "up" || direction === "down",
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            style={{ gap: '1rem' }}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": direction === "left",
              "animate-marquee-reverse flex-row": direction === "right",
              "animate-marquee-up flex-col": direction === "up",
              "animate-marquee-up-reverse flex-col": direction === "down",
              "group-hover-pause": pauseOnHover,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
