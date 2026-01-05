"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, RefObject, ElementType } from "react";

interface TimelineContentProps {
  children: React.ReactNode;
  className?: string;
  animationNum?: number;
  timelineRef?: RefObject<HTMLElement | null>;
  as?: ElementType;
  customVariants?: Variants;
}

/**
 * Componente de animación para contenido con scroll reveal.
 * Usa Framer Motion para animaciones suaves al entrar en viewport.
 */
export function TimelineContent({
  children,
  className = "",
  animationNum = 0,
  timelineRef,
  as: Component = "div",
  customVariants,
}: TimelineContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef || ref, {
    once: true,
    margin: "-100px",
  });

  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const variants = customVariants || defaultVariants;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={variants}
    >
      {Component === "div" ? (
        children
      ) : (
        <Component>{children}</Component>
      )}
    </motion.div>
  );
}
