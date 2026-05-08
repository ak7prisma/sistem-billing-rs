"use client";

import React from "react";
import { FiEye, FiSearch, FiLoader } from "react-icons/fi";
import { Tagihan } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/currency";
import StatusBadge from "@/components/ui/StatusBadge";

interface TransactionTableProps {
  data: Tagihan[];
  loading: boolean;
  onViewDetail: (tagihan: Tagihan) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ data, loading, onViewDetail }) => {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20">
        <FiLoader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat Data Audit...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
          <FiSearch className="text-slate-300 w-10 h-10" />
        </div>
        <p className="text-slate-800 font-black uppercase tracking-tight text-sm">Data Tidak Ditemukan</p>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Coba sesuaikan kata kunci atau filter Anda</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
          <tr>
            <th className="p-6 pl-10">Invoice ID</th>
            <th className="p-6">Poli / Layanan</th>
            <th className="p-6">Tanggal</th>
            <th className="p-6">Total Tagihan</th>
            <th className="p-6 text-center">Status</th>
            <th className="p-6 pr-10 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-slate-50">
          {data.map((item) => (
            <tr key={item.id_tagihan} className="hover:bg-slate-50/50 transition group">
              <td className="p-6 pl-10">
                <span className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                  #{item.id_tagihan.slice(0, 8).toUpperCase()}
                </span>
              </td>
              <td className="p-6">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">{item.poli || "Umum"}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {(item.rincian?.length || 0)} Items
                  </span>
                </div>
              </td>
              <td className="p-6 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                {item.tanggal?.seconds ? new Date(item.tanggal.seconds * 1000).toLocaleDateString("id-ID", {
                   day: '2-digit',
                   month: 'short',
                   year: 'numeric'
                }) : "N/A"}
              </td>
              <td className="p-6 font-black text-slate-800">{formatRupiah(item.total_biaya)}</td>
              <td className="p-6 text-center">
                <StatusBadge status={item.status as any} />
              </td>
              <td className="p-6 pr-10 text-right">
                <button 
                  onClick={() => onViewDetail(item)}
                  className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shadow-sm active:scale-95"
                >
                  <FiEye /> Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
