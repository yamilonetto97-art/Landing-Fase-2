"use client";

import * as React from "react"
import { useEffect, useState } from "react";

/**
 * Props para el componente Typewriter
 */
export interface TypewriterProps {
  /** Texto o array de textos a mostrar */
  text: string | string[];
  /** Velocidad de escritura en ms */
  speed?: number;
  /** Carácter del cursor */
  cursor?: string;
  /** Si debe repetir en loop */
  loop?: boolean;
  /** Velocidad de borrado en ms */
  deleteSpeed?: number;
  /** Delay antes de borrar en ms */
  delay?: number;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente Typewriter - Efecto de máquina de escribir
 * Muestra texto letra por letra con animación
 * 
 * @example
 * <Typewriter
 *   text={["Hola mundo", "Bienvenido"]}
 *   speed={100}
 *   loop={true}
 *   className="text-xl font-medium"
 * />
 */
export function Typewriter({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  // Validate and process input text
  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    text,
    textArray.length,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}
