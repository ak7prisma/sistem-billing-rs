"use client";

import React from "react";
import { FiGrid, FiFileText, FiPieChart, FiSettings } from "react-icons/fi";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function KasirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Overview", href: "/kasir", icon: FiGrid },
    { label: "Laporan", href: "/kasir/laporan", icon: FiFileText, disabled: true },
    { label: "Statistik", href: "/kasir/statistik", icon: FiPieChart, disabled: true },
    { label: "Pengaturan", href: "/kasir/setting", icon: FiSettings },
  ];

  return (
    <DashboardLayout 
      navItems={navItems} 
      allowedRole="kasir" 
      brandName="Satria" 
      brandSubName="Kasir"
      gradient="from-emerald-500 to-teal-600"
    >
      {children}
    </DashboardLayout>
  );
}
