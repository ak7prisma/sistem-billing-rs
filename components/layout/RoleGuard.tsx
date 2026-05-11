"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserRole } from "@/lib/types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: Readonly<RoleGuardProps>) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in
        router.push("/auth/login");
      } else if (role && !allowedRoles.includes(role)) {
        // Role not authorized for this section
        if (role === "kasir") router.push("/kasir");
        else if (role === "manajer") router.push("/manager");
        else router.push("/pasien");
      }
    }
  }, [user, role, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">Verifikasi Akses...</p>
        </div>
      </div>
    );
  }

  // Only render children if authorized
  if (user && role && allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return null;
}