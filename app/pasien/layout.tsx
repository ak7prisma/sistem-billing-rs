"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiClock, FiInfo, FiActivity } from "react-icons/fi";
import RoleGuard from "@/components/layout/RoleGuard";
import { useAuth } from "@/lib/hooks/useAuth";
import { logout } from "@/lib/firebase/auth";
import { navItems } from "@/lib/data/navItems";

export default function PasienLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { profile } = useAuth();

  const handleLogout = async () => {
    if (confirm("Yakin ingin keluar?")) {
      await logout();
      globalThis.location.href = "/";
    }
  };

  return (
    <RoleGuard allowedRoles={["pasien"]}>
      <div className="min-h-screen flex flex-col">
      {/* Desktop Navbar */}
      <nav className="bg-white px-4 md:px-8 py-4 shadow-sm flex justify-between items-center border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3 w-auto md:w-48">
          <div className="w-8 h-8 bg-linear-to-tr from-emerald-500 to-violet-500 rounded flex items-center justify-center">
            <FiActivity className="text-white w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-wide uppercase">Satria</span>
        </div>
        
        <div className="hidden md:flex gap-10 text-sm font-bold">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  isActive
                    ? "text-violet-600 border-b-2 border-violet-600 pb-1"
                    : "text-slate-500 hover:text-violet-600 transition pb-1"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="w-auto md:w-48 text-right flex items-center justify-end gap-2 md:gap-4">
          <span className="hidden sm:inline text-sm font-bold text-slate-700">Hai, {profile?.nama?.split(' ')[0] || "Pasien"}!</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center ${
                isActive ? "text-violet-600" : "text-slate-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
    </RoleGuard>
  );
}