"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { navItems } from "@/lib/data/navItems";

export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <DashboardLayout 
      navItems={navItems} 
      allowedRole="manajer" 
      brandName="Satria" 
      brandSubName="Manager"
      gradient="from-blue-600 to-indigo-600"
    >
      {children}
    </DashboardLayout>
  );
}