"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { navItemsAdmin } from "@/lib/data/navItems";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout 
      navItems={navItemsAdmin} 
      allowedRole="admin"
      gradient="from-slate-800 to-slate-900"
    >
      {children}
    </DashboardLayout>
  );
}
