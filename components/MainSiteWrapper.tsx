"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps children with main-site styles (dark background, etc.) only when
 * we're NOT on widget routes. Widget embed has its own styling and should
 * not inherit the main dashboard/page styles.
 */
export default function MainSiteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWidgetRoute = pathname?.startsWith("/widget") ?? false;

  if (isWidgetRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050509] text-zinc-100 selection:bg-zinc-800">
      {children}
    </div>
  );
}
