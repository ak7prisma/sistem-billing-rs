"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { FiUsers, FiShield, FiActivity, FiKey } from "react-icons/fi";
import { getAllUsers } from "@/lib/firebase/firestore";

export default function AdminDashboard() {
  const [userStats, setUserStats] = useState({
    total: 0,
    kasir: 0,
    manajer: 0,
    admin: 0,
    pasien: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsers();
      const stats = {
        total: users.length,
        kasir: users.filter(u => u.role === "kasir").length,
        manajer: users.filter(u => u.role === "manajer").length,
        admin: users.filter(u => u.role === "admin").length,
        pasien: users.filter(u => u.role === "pasien").length,
      };
      setUserStats(stats);
    };
    fetchData();
  }, []);

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
            href="/admin/users/create"
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

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition duration-300">
      <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${color.split('-')[1]}-500/20`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h4>
    </div>
  );
}

function ActionCard({ title, desc, href, icon: Icon, disabled }: any) {
  return (
    <a 
      href={disabled ? "#" : href}
      className={`p-6 rounded-3xl border border-slate-100 flex items-start gap-4 transition group ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-50 hover:border-blue-100 cursor-pointer'}`}
    >
      <div className={`p-3 rounded-2xl ${disabled ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h5 className="font-black text-slate-800 text-sm mb-1">{title}</h5>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </a>
  );
}
