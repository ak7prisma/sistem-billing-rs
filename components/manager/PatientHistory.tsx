"use client";

import React from "react";
import { FiFileText, FiClock, FiLoader } from "react-icons/fi";
import { Tagihan } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/currency";
import StatusBadge from "@/components/ui/StatusBadge";

interface PatientHistoryProps {
  history: Tagihan[];
  loading: boolean;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ history, loading }) => {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center border-b border-slate-50 pb-6">
        <div>
          <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">Histori Kunjungan & Billing</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daftar semua transaksi pasien ini</p>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {history.length} Transaksi
        </div>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
            <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Memuat Histori...</p>
          </div>
        )}
        
        {!loading && history.length > 0 && (
          history.map((item) => (
            <div key={item.id_tagihan} className="group p-6 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                  <FiFileText size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">#{item.id_tagihan.slice(0, 8).toUpperCase()}</p>
                  <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">
                    {item.poli || "Umum"}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                    <FiClock size={10} /> 
                    {item.createdAt?.seconds 
                      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                      : 'Unknown Date'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Total Tagihan</p>
                  <p className="font-black text-slate-800">{formatRupiah(item.total_biaya)}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))
        )}
        
        {!loading && history.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-3">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                <FiFileText size={24} />
             </div>
             <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Belum ada histori kunjungan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;