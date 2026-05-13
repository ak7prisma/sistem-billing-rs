"use client";

import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { FiUsers, FiShield, FiActivity, FiKey } from "react-icons/fi";
import { useAdminStats } from "@/lib/hooks/useAdminStats";
import StatCard from "@/components/admin/StatCard";
import ActionCard from "@/components/admin/ActionCard";

export default function AdminDashboard() {
  const { userStats } = useAdminStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Admin Control Center" 
        subtitle="Manage billing system staff and permissions"
        badge="System Administrator"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={FiUsers} 
          label="Total Staff" 
          value={userStats.kasir + userStats.manajer + userStats.admin} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={FiKey} 
          label="Kasir Aktif" 
          value={userStats.kasir} 
          color="bg-emerald-500" 
        />
        <StatCard 
          icon={FiShield} 
          label="Finance Managers" 
          value={userStats.manajer} 
          color="bg-violet-500" 
        />
        <StatCard 
          icon={FiActivity} 
          label="System Admins" 
          value={userStats.admin} 
          color="bg-slate-800" 
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard 
            title="Generate Akun Staff" 
            desc="Buat akun baru untuk kasir atau manajer keuangan secara langsung."
            href="/admin/create"
            icon={FiKey}
          />
          <ActionCard 
            title="Kelola Akun Staff" 
            desc="Ubah role, reset password, atau nonaktifkan akun kasir dan manajer."
            href="/admin/users"
            icon={FiUsers}
          />
        </div>
      </div>
    </div>
  );
}