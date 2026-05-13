"use client";

import React from "react";
import { FiActivity, FiUser, FiClock } from "react-icons/fi";
import { Tagihan, Pasien, RincianTagihan } from "@/lib/types";
import BillingBreakdown from "./BillingBreakdown";
import StatusBadge from "../ui/StatusBadge";

import { formatDate } from "@/lib/utils/date";

interface InvoiceContentProps {
  tagihan: Tagihan;
  pasien: Pasien | null;
  rincian: RincianTagihan[];
}

const InvoiceContent: React.FC<InvoiceContentProps> = ({ tagihan, pasien, rincian }) => {
  const tipePenjamin = (pasien?.tipe_penjamin?.toLowerCase() === "bpjs") ? "bpjs" : "umum";

  return (
    <div className="flex flex-col">
      {/* Invoice Header Information */}
      <div className="p-6 md:p-10 border-b border-slate-50 bg-slate-50/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-linear-to-tr from-emerald-500 to-violet-600 rounded-[1.5rem] flex items-center justify-center shadow-xl transform -rotate-6">
              <FiActivity className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
                Rincian <span className="text-violet-600">Layanan</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
                #{tagihan.id_tagihan.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={tagihan.status} />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              {formatDate(tagihan.tanggal)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <FiUser className="text-slate-300" size={14} />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Informasi Pasien</p>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{pasien?.nama || "Loading..."}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              No. RM: {pasien?.no_rm || "N/A"} • {tipePenjamin === "bpjs" ? "BPJS Kesehatan" : "Umum (Mandiri)"}
            </p>
          </div>
          <div className="space-y-2 md:text-right">
            <div className="flex items-center gap-2 mb-1 md:justify-end">
              <FiClock className="text-slate-300" size={14} />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Poli / Unit</p>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{tagihan.poli}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status: {tagihan.status.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="p-0">
        <BillingBreakdown rincian={rincian} tipePenjamin={tipePenjamin} />
      </div>
    </div>
  );
};

export default InvoiceContent;