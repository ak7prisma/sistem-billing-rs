"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiActivity, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import RoleGuard from "./RoleGuard";
import { UserRole } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  allowedRole: UserRole;
  brandName: string;
  brandSubName?: string;
  gradient?: string;
}

export default function DashboardLayout({
  children,
  navItems,
  allowedRole,
  brandName,
  brandSubName = "Billing",
  gradient = "from-blue-600 to-indigo-600"
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <RoleGuard allowedRoles={[allowedRole]}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden text-slate-800 bg-[#f8fafc]">
        {/* Mobile Top Header */}
        <header className="md:hidden bg-slate-900 p-4 flex justify-between items-center z-30 shadow-md">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-tr ${gradient} rounded flex items-center justify-center`}>
              <FiActivity className="text-white w-4 h-4" />
            </div>
            <span className="text-white font-bold tracking-wider uppercase text-sm">{brandName} {brandSubName}</span>
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
              <div className={`w-8 h-8 bg-gradient-to-tr ${gradient} rounded flex items-center justify-center shadow-lg`}>
                <FiActivity className="text-white w-4 h-4" />
              </div>
              <div className="leading-none">
                <h1 className="text-lg font-black uppercase tracking-wider text-white">{brandName}</h1>
                <h1 className="text-sm font-bold uppercase tracking-widest text-slate-500">{brandSubName}</h1>
              </div>
            </div>

            <div className="px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-4 md:mt-0">Main Portal</div>

            <nav className="px-4 space-y-2 mt-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                if (item.disabled) return null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} /> 
                    <span className="text-xs uppercase tracking-widest">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-8 border-t border-slate-800/50">
            <Link href="/" className="flex items-center gap-3 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-red-400 transition">
              <FiLogOut className="w-4 h-4" /> Sign Out
            </Link>
          </div>
        </aside>

        {isSidebarOpen && (
          <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-all"></div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-12 relative">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
