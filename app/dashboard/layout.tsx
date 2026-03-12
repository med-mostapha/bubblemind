import Sidebar from "@/components/dashboard/sidebar";
import { cookies } from "next/headers";
import React from "react";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const metadaCookie = cookieStore.get("metadata");
  return (
    <div className="bg-[#050509] min-h-screen font-sans antialiased text-zinc-100 selection:bg-zinc-800 flex">
      {metadaCookie?.value ? (
        <>
          <Sidebar />
          <div className="flex-1 flex w-full">
            {/* <Header /> */}
            <main className="flex-1">{children}</main>
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
