"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function OrbModel() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * 100;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 100;
      setMousePosition({ x: xPos, y: yPos });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 perspective-1000">
      {/* The interactive main orb */}
      <motion.div
        animate={{
          x: `${mousePosition.x}vw`,
          y: `${mousePosition.y}vh`,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 50, mass: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-violet-600 opacity-5 blur-[120px] mix-blend-screen"
      />

      {/* Background drifting particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: ["-50vw", "50vw", "-20vw", "40vw", "-50vw"],
            y: ["-30vh", "40vh", "30vh", "-40vh", "-30vh"],
            scale: [1, 1.5, 0.8, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: -Math.random() * 20,
          }}
          className={`absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full mix-blend-screen blur-[100px] -translate-x-1/2 -translate-y-1/2 ${
            i % 3 === 0
              ? "bg-purple-600/10"
              : i % 3 === 1
              ? "bg-fuchsia-500/10"
              : "bg-blue-500/10"
          }`}
        />
      ))}

      {/* Tiny dust particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          animate={{
            x: ["-100vw", "100vw"],
            y: ["-50vh", "50vh"],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: -Math.random() * 15,
          }}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-20 blur-[1px] -translate-x-1/2 -translate-y-1/2"
        />
      ))}
    </div>
  );
}
