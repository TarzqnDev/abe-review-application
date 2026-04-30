"use client";

import AdminHeader from "@/components/AdminHeader";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-2 pl-2 pr-8 bg-stone-100 h-screen flex gap-8">
      <AdminNavbar />
      <main className="w-full">
        <AdminHeader />
        <div>{children}</div>
      </main>
    </div>
  );
}
