"use client";

import React from "react";
import { FiSettings, FiBell, FiLock, FiDatabase, FiHelpCircle } from "react-icons/fi";

export default function ManagerSettings() {
  const sections = [
    { title: "Notifikasi", desc: "Kelola peringatan transaksi besar & laporan harian.", icon: FiBell },
    { title: "Keamanan Akun", desc: "Ganti password dan pengaturan 2FA.", icon: FiLock },
    { title: "Integrasi Data", desc: "Atur API endpoint Modul Antrean & Tindakan.", icon: FiDatabase },
    { title: "Bantuan", desc: "Pusat bantuan dan dokumentasi sistem billing.", icon: FiHelpCircle },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Pengaturan <span className="text-blue-600">Sistem</span></h2>
        <p className="text-slate-500 font-medium text-sm mt-1">Konfigurasi preferensi dashboard manajer keuangan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <button key={section.title} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left group">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-6 shadow-inner">
              <section.icon size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">{section.title}</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">{section.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] space-y-4">
        <h3 className="text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
          <FiSettings /> Zona Bahaya
        </h3>
        <p className="text-slate-600 text-sm font-medium">Pengaturan ini akan berdampak pada seluruh rekapitulasi data keuangan.</p>
        <button className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-600/20">
          Reset Semua Laporan
        </button>
      </div>
    </div>
  );
}
