"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils/currency";
import { RincianTagihan } from "@/lib/types";

interface InvoiceSummaryProps {
  rincian: RincianTagihan[];
  tagihanTotal?: number;
  loadingRincian?: boolean;
  children?: React.ReactNode;
  dark?: boolean;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ 
  rincian, 
  tagihanTotal, 
  loadingRincian, 
  children,
  dark = false 
}) => {
  const totalTagihan = rincian.reduce((sum, r) => sum + r.subtotal, 0);
  const totalCover = rincian.reduce((sum, r) => sum + (r.is_covered_bpjs ? r.subtotal : 0), 0);
  const iurBiaya = totalTagihan - totalCover;

  const displayTotal = loadingRincian ? (tagihanTotal || 0) : iurBiaya;

  return (
    <div className={`p-8 md:p-12 border-t ${dark ? 'bg-slate-900 text-white border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-10">
        <div className={`text-xs font-medium leading-relaxed max-w-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {totalCover > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ditanggung BPJS</p>
              <p className="text-sm font-black text-emerald-500">- {formatRupiah(totalCover)}</p>
            </div>
          )}
          <p className="uppercase tracking-widest font-black text-[9px] mb-2 text-slate-500">Informasi Pembayaran</p>
          <p>Pastikan rincian layanan dan nominal di samping sudah sesuai. Pembayaran yang sudah diproses tidak dapat dibatalkan secara sepihak.</p>
        </div>
        
        <div className="text-center md:text-right w-full md:w-auto space-y-6">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              Total Iur Biaya Pasien
            </p>
            <h2 className={`text-5xl font-black tracking-tighter ${dark ? 'text-white' : 'text-violet-600'}`}>
              {formatRupiah(displayTotal)}
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;