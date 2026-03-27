"use client";

import { useState, useEffect } from "react";

interface ClientDateProps {
  date: Date | string | number;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}

/**
 * Client-side date formatter to prevent hydration mismatches
 * Uses ISO string during SSR and applies locale formatting only on client
 */
export function ClientDate({ date, locale = "es-AR", options, className }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const dateObj = date instanceof Date ? date : new Date(date);

  // During SSR and initial render, use ISO string
  if (!mounted) {
    return <span className={className}>{dateObj.toISOString().replace('T', ' ').split('.')[0]}</span>;
  }

  // After hydration, use locale-specific formatting
  return <span className={className}>{dateObj.toLocaleString(locale, options)}</span>;
}
