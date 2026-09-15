"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// The design experiment owns its landmarks; all other routes keep the site shell.
export function SiteFrame({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/home-exploracion") return <>{children}</>;

  return (
    <>
      {header}
      <main id="main-content">{children}</main>
      {footer}
    </>
  );
}
