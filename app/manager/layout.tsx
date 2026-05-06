"use client";

import React from "react";
import { FiPieChart, FiFileText, FiUsers, FiSettings } from "react-icons/fi";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Overview", href: "/manager", icon: FiPieChart },
    { label: "Laporan", href: "/manager/laporan", icon: FiFileText },
    { label: "Data Pasien", href: "/manager/pasien", icon: FiUsers },
    { label: "Pengaturan", href: "/manager/setting", icon: FiSettings },
  ];

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
