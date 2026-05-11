"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { navItemsKasir } from "@/lib/data/navItems";

export default function KasirLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <DashboardLayout 
      navItems={navItemsKasir} 
      allowedRole="kasir"
      gradient="from-emerald-500 to-teal-600"
    >
      {children}
    </DashboardLayout>
  );
}