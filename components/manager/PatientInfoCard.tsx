"use client";

import React from "react";
import { FiUser, FiMail, FiMapPin, FiCreditCard } from "react-icons/fi";
import { Pasien } from "@/lib/types";

interface PatientInfoCardProps {
  pasien: Pasien;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ pasien }) => {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="h-32 bg-linear-to-br from-blue-600 to-indigo-700 relative">
        <div className="absolute -bottom-10 left-8">
          <div className="w-24 h-24 bg-white rounded-4xl p-1 shadow-xl">
            <div className="w-full h-full bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-slate-200">
              <FiUser size={40} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8 pt-16 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{pasien.nama}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
              RM: {pasien.no_rm}
            </span>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${pasien.tipe_penjamin === 'bpjs' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
              {pasien.tipe_penjamin}
            </span>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-50 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
              <FiMail size={14} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Email</p>
              <p className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{pasien.email || "Tidak ada email"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
              <FiMapPin size={14} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Alamat</p>
              <p className="text-xs font-bold text-slate-600 line-clamp-2">{pasien.alamat || "Alamat belum diatur"}</p>
            </div>
          </div>

          {pasien.no_bpjs && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-400">
                <FiCreditCard size={14} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No. BPJS</p>
                <p className="text-xs font-bold text-slate-600">{pasien.no_bpjs}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
