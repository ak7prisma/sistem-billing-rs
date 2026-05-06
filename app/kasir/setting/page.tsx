"use client";

import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";

export default function KasirSetting() {
  const [qrisEnabled, setQrisEnabled] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">System Settings</h2>
        <p className="text-slate-500 font-medium mt-1">Konfigurasi operasional portal kasir billing.</p>
      </div>

      <div className="max-w-3xl bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <h3 className="text-lg md:text-xl font-black text-slate-800 mb-6 border-b border-slate-50 pb-6 flex items-center gap-2 uppercase tracking-wide">
          Integrasi Payment
        </h3>
        
        <div className="space-y-6">
          <label 
            className={`flex items-start md:items-center gap-4 p-5 md:p-6 border-2 rounded-2xl cursor-pointer transition-all ${
              qrisEnabled 
                ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-500/5" 
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={qrisEnabled} 
                onChange={() => setQrisEnabled(!qrisEnabled)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                qrisEnabled ? "bg-violet-600 border-violet-600" : "border-slate-300 bg-white"
              }`}>
                {qrisEnabled && <FiCheck className="text-white w-4 h-4" />}
              </div>
            </div>
            <div>
              <span className={`block font-black text-sm md:text-lg tracking-tight ${
                qrisEnabled ? "text-violet-900" : "text-slate-800"
              }`}>
                Aktifkan QRIS Dinamis
              </span>
              <span className={`text-xs md:text-sm font-medium ${
                qrisEnabled ? "text-violet-600" : "text-slate-500"
              }`}>
                Otomatis generate QR Code nominal untuk pasien guna mempercepat antrean.
              </span>
            </div>
          </label>

          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="text-sm font-bold text-slate-500">Device Printer Thermal</div>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-tighter">Connected</span>
                <button className="text-[10px] font-black text-violet-600 hover:underline uppercase">Change Device</button>
             </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
           <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-slate-800 transition shadow-lg">
             Simpan Perubahan
           </button>
        </div>
      </div>
    </div>
  );
}
