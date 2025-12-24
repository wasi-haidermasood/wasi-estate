"use client";

import { useState, useEffect } from "react";

export const useCounter = (
  end: number,
  isVisible: boolean,
  duration: number = 2000
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Reset to 0 when not visible (so it re-animates each time)
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTime: number | undefined;
    let animationFrame = 0;

    const animate = (timestamp: number) => {
      if (startTime === undefined) startTime = timestamp;

      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeOut = 1 - Math.pow(1 - percentage, 4);

      setCount(Math.floor(end * easeOut));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return count;
};