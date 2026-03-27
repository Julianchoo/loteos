"use client";

import { useState, useEffect } from "react";

interface ClientNumberProps {
  value: number;
  locale?: string;
  options?: Intl.NumberFormatOptions;
  className?: string;
}

/**
 * Client-side number formatter to prevent hydration mismatches
 * Uses a consistent format during SSR and applies locale formatting only on client
 */
export function ClientNumber({ value, locale = "es-AR", options, className }: ClientNumberProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // During SSR and initial render, use simple comma formatting
  if (!mounted) {
    return <span className={className}>{value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>;
  }

  // After hydration, use locale-specific formatting
  return <span className={className}>{value.toLocaleString(locale, options)}</span>;
}
