"use client";

import React, { useState, useEffect } from "react";
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiUsers, 
  FiActivity,
  FiFileText,
  FiLoader,
  FiCalendar,
  FiFilter
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
import PageHeader from "@/components/ui/PageHeader";
import { useFinancialData } from "@/lib/hooks/useFinancialData";
import { formatRupiah } from "@/lib/utils/currency";
import { statItems } from "@/lib/data/stats";

const COLORS = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function ManagerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("7 Hari Terakhir");
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPoli, setSelectedPoli] = useState("Semua Poli");
  const { stats, charts, allDepartments, loading } = useFinancialData(timeRange, selectedPoli);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menganalisa Data Keuangan...</p>
      </div>
    );
  }

  const departments = ["Semua Poli", ...allDepartments];

  return (
    <div className="space-y-10 pb-10">
      <PageHeader 
        title="Financial Analytics" 
        subtitle="Laporan performa keuangan rumah sakit real-time."
        badge="Live"
      >
        <div className="relative">
          <button 
            onClick={() => {
              setIsRangeDropdownOpen(!isRangeDropdownOpen);
              setIsFilterOpen(false);
            }}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition uppercase tracking-widest"
          >
            <FiCalendar /> {timeRange}
          </button>
          
          {isRangeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsRangeDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                {["7 Hari Terakhir", "30 Hari Terakhir", "Semua Waktu"].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setIsRangeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${
                      timeRange === range ? "text-violet-600 bg-violet-50" : "text-slate-500"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsRangeDropdownOpen(false);
            }}
            className={`p-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2 ${
              isFilterOpen || selectedPoli !== "Semua Poli" 
              ? "bg-violet-600 text-white shadow-violet-500/20" 
              : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800"
            }`}
          >
            <FiFilter size={18} />
            {selectedPoli !== "Semua Poli" && (
              <span className="text-[9px] font-black uppercase tracking-tighter pr-1">{selectedPoli}</span>
            )}
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter Departemen</p>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedPoli(dept);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${
                        selectedPoli === dept ? "text-violet-600 bg-violet-50" : "text-slate-500"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems(stats).map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600`}>
                {stat.delta}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Revenue Trend */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">Tren Pendapatan Mingguan</h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue Growth</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueTrend}>
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

        {/* Department Share Bar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">Distribusi Billing Per Poli</h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Department Share</span>
          </div>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.departmentShare}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '10px'}}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                  {charts.departmentShare.map((entry, index) => (
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
        <FiFileText className="absolute -right-10 -bottom-10 text-white/5 w-80 h-80 transform rotate-12" />
      </div>
    </div>
  );
}
