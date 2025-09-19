"use client";

import { useState, useEffect, useMemo } from "react";

const useBreakpoint = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get current slides per view based on breakpoints
  const currentSlidesPerView = useMemo(() => {
    if (screenWidth === 0) return 1; // Initial state
    if (screenWidth >= 1536) return 6;
    if (screenWidth >= 1280) return 5;
    if (screenWidth >= 1024) return 4;
    if (screenWidth >= 768) return 3;
    if (screenWidth >= 400) return 2;
    // For screens < 400px return 1
    return 1;
  }, [screenWidth]);

  return {
    screenWidth,
    currentSlidesPerView,
  };
};

export default useBreakpoint;
