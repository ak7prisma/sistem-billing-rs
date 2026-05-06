"use client";

import React, { useState, useEffect } from "react";
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiUsers, 
  FiActivity,
  FiCalendar,
  FiFilter,
  FiFileText
} from "react-icons/fi";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from "recharts";
import PageHeader from "@/components/shared/PageHeader";

const DATA_REVENUE = [
  { name: "Senin", total: 4500000 },
  { name: "Selasa", total: 5200000 },
  { name: "Rabu", total: 3800000 },
  { name: "Kamis", total: 6100000 },
  { name: "Jumat", total: 5900000 },
  { name: "Sabtu", total: 4200000 },
  { name: "Minggu", total: 2100000 },
];

const DATA_POLI = [
  { name: "Poli Jantung", count: 45 },
  { name: "Poli Umum", count: 120 },
  { name: "Radiologi", count: 35 },
  { name: "Laboratorium", count: 85 },
  { name: "Farmasi", count: 200 },
];

const COLORS = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function ManagerDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: "Total Pendapatan", value: "Rp 31.850.000", delta: "+12.5%", icon: FiDollarSign, color: "bg-blue-500" },
    { label: "Transaksi Berhasil", value: "1,240", delta: "+8.2%", icon: FiTrendingUp, color: "bg-emerald-500" },
    { label: "Pasien Terdaftar", value: "8,432", delta: "+4.1%", icon: FiUsers, color: "bg-violet-500" },
    { label: "Rata-rata Billing", value: "Rp 256.000", delta: "-2.4%", icon: FiActivity, color: "bg-amber-500" },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-10">
      <PageHeader 
        title="Financial Analytics" 
        subtitle="Laporan performa keuangan rumah sakit real-time."
        badge="Live"
      >
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition uppercase tracking-widest">
          <FiCalendar /> 7 Hari Terakhir
        </button>
        <button className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition">
          <FiFilter size={18} />
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.delta.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.delta}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">Tren Pendapatan Mingguan</h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue Growth</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_REVENUE}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} tickFormatter={(value) => `${value/1000000}M`} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '10px'}}
                  formatter={(value: any) => [`Rp ${value.toLocaleString()}`, 'Total']}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">Distribusi Billing Per Poli</h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Department Share</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_POLI}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '10px'}}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                  {DATA_POLI.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-5 md:max-w-md">
          <h3 className="text-3xl font-black leading-none uppercase tracking-tighter">Export <br/>Financial Data</h3>
          <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-widest opacity-80">Download rekapitulasi data keuangan dalam format PDF atau Excel secara instan untuk kebutuhan audit.</p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition shadow-xl hover:scale-105 active:scale-95">
            Download Report Now
          </button>
        </div>
        <FiFileText className="absolute right-[-40px] bottom-[-40px] text-white/5 w-80 h-80 transform rotate-12" />
      </div>
    </div>
  );
}
