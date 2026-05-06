"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiActivity, FiPieChart, FiFileText, FiUsers, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import RoleGuard from "@/components/layout/RoleGuard";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard Keuangan", href: "/manager", icon: FiPieChart },
    { label: "Laporan Transaksi", href: "/manager/laporan", icon: FiFileText },
    { label: "Data Pasien", href: "/manager/pasien", icon: FiUsers },
    { label: "Pengaturan", href: "/manager/setting", icon: FiSettings },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <RoleGuard allowedRoles={["manajer"]}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden text-slate-800">
        {/* Mobile Top Header */}
        <header className="md:hidden bg-slate-900 p-4 flex justify-between items-center z-30 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded flex items-center justify-center">
              <FiActivity className="text-white w-4 h-4" />
            </div>
            <span className="text-white font-bold tracking-wider uppercase text-sm">Manager Billing</span>
          </div>
          <button onClick={toggleSidebar} className="text-white p-2">
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </header>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-slate-900 flex flex-col justify-between h-full shadow-2xl z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative transition-transform duration-300 ease-in-out`}
        >
          <div>
            <div className="p-8 hidden md:flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded flex items-center justify-center shadow-lg">
                <FiActivity className="text-white w-4 h-4" />
              </div>
              <div className="leading-none">
                <h1 className="text-lg font-black uppercase tracking-wider text-white">Manager</h1>
                <h1 className="text-sm font-bold uppercase tracking-widest text-blue-400">Keuangan</h1>
              </div>
            </div>

            <div className="px-8 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest mt-4 md:mt-0">Finance Menu</div>

            <nav className="px-4 space-y-2 mt-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className="w-5 h-5" /> {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 text-red-500 font-bold hover:text-red-400 transition">
              <FiLogOut className="w-5 h-5" /> Logout
            </Link>
          </div>
        </aside>

        {isSidebarOpen && (
          <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
