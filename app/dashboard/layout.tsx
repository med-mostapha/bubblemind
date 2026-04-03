import Sidebar from "@/components/dashboard/sidebar";
import { isAuthorized } from "@/lib/isAuthorized";
import React from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await isAuthorized();
  return (
    <div
      className="min-h-screen font-sans antialiased text-zinc-800 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 flex transition-colors duration-200"
      style={{ backgroundColor: "var(--db-bg)" }}
    >
      {user ? (
        <>
          <Sidebar />
          <div className="flex-1 flex w-full">
            <main className="flex-1">{children}</main>
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
