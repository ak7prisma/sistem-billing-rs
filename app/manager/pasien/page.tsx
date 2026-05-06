"use client";

import React, { useState } from "react";
import { FiSearch, FiUser, FiActivity, FiMapPin } from "react-icons/fi";

const MOCK_PASIEN = [
  { id: "P-001", rm: "00-11-22", nama: "Budi Santoso", tipe: "BPJS", lastVisit: "01 Mei 2024", totalBill: "Rp 750.000" },
  { id: "P-002", rm: "00-11-23", nama: "Siti Aminah", tipe: "UMUM", lastVisit: "02 Mei 2024", totalBill: "Rp 150.000" },
  { id: "P-003", rm: "00-11-24", nama: "Andi Wijaya", tipe: "BPJS", lastVisit: "28 April 2024", totalBill: "Rp 1.200.000" },
  { id: "P-004", rm: "00-11-25", nama: "Dewi Lestari", tipe: "UMUM", lastVisit: "25 April 2024", totalBill: "Rp 450.000" },
];

export default function PasienManager() {
  const [search, setSearch] = useState("");

  const filteredPasien = MOCK_PASIEN.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase()) || 
    p.rm.includes(search)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Database <span className="text-blue-600">Pasien</span></h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Kelola data identitas dan histori kunjungan pasien.</p>
        </div>
      </div>

      <div className="relative group">
        <FiSearch className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Cari Nama Pasien atau No. RM..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-bold shadow-sm transition text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPasien.map((p) => (
          <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-center md:items-start group">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
              <FiUser size={32} />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{p.nama}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${p.tipe === 'BPJS' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {p.tipe}
                  </span>
                </div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">RM: {p.rm}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
                    <FiActivity /> Terakhir
                  </p>
                  <p className="text-xs font-bold text-slate-600">{p.lastVisit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
                    <FiMapPin /> Total Billing
                  </p>
                  <p className="text-xs font-bold text-blue-600">{p.totalBill}</p>
                </div>
              </div>

              <button className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Lihat Profil Lengkap
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
