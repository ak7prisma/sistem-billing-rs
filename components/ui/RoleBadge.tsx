import React from "react";
import { FiShield } from "react-icons/fi";
import { UserRole } from "@/lib/types";

interface RoleBadgeProps {
  role: UserRole;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const styles: Record<string, string> = {
    admin: "bg-slate-900 text-white border-slate-900",
    manajer: "bg-violet-50 text-violet-600 border-violet-100",
    kasir: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pasien: "bg-blue-50 text-blue-600 border-blue-100",
    developer: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${styles[role] || "bg-slate-50 text-slate-500"}`}>
      {role === "admin" && <FiShield size={10} />}
      {role}
    </span>
  );
}