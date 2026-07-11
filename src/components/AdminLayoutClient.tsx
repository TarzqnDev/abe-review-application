"use client";

import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <AdminNavbar />
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-5 py-10 md:grid-cols-[250px_1fr]">
        <AdminSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
