"use client";

import React from "react";
import { FiEye, FiSearch, FiLoader, FiShield, FiCheckCircle, FiClock } from "react-icons/fi";
import { Tagihan, Pembayaran } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/currency";
import StatusBadge from "@/components/ui/StatusBadge";

interface TransactionTableProps {
  data: Tagihan[];
  pembayaranMap: Record<string, Pembayaran>;
  loading: boolean;
  onViewDetail: (tagihan: Tagihan) => void;
  filterJenis?: "obat" | "medis" | "laboratorium";
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  data, 
  pembayaranMap, 
  loading, 
  onViewDetail,
  filterJenis 
}) => {
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

  const parseDate = (tanggal: any) => {
    if (!tanggal) return "N/A";
    let date: Date;
    if (tanggal.seconds) {
      date = new Date(tanggal.seconds * 1000);
    } else if (tanggal instanceof Date) {
      date = tanggal;
    } else if (typeof tanggal === "string") {
      date = new Date(tanggal);
    } else {
      date = new Date(tanggal);
    }
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[960px]">
        <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
          <tr>
            <th className="p-6 pl-10">Invoice ID</th>
            <th className="p-6">Poli / Layanan</th>
            <th className="p-6">Tgl Buat</th>
            <th className="p-6">Tgl Konfirmasi</th>
            <th className="p-6 text-right text-emerald-600">
              {filterJenis ? `BPJS ${filterJenis}` : "Cover BPJS"}
            </th>
            <th className="p-6 text-right text-violet-600">
              {filterJenis ? `Pemasukan ${filterJenis}` : "Iur Biaya"}
            </th>
            <th className="p-6 text-center">Status</th>
            <th className="p-6 pr-10 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-slate-50">
          {data.map((item) => {
            const pembayaran = pembayaranMap[item.id_tagihan];
            const isLunas = item.status === "lunas";
            
            let totalBpjs = 0;
            let totalIur = 0;

            if (filterJenis) {
              const rincianFiltered = (item.rincian || []).filter(r => r.jenis === filterJenis);
              totalBpjs = rincianFiltered.filter(r => r.is_covered_bpjs).reduce((s, r) => s + (r.subtotal || 0), 0);
              totalIur = rincianFiltered.filter(r => !r.is_covered_bpjs).reduce((s, r) => s + (r.subtotal || 0), 0);
            } else {
              totalBpjs = pembayaran?.cover_bpjs || 0;
              totalIur = pembayaran?.iur_biaya ?? item.total_biaya;
            }

            const hasBpjs = totalBpjs > 0;

            return (
              <tr key={item.id_tagihan} className="hover:bg-slate-50/50 transition group">
                <td className="p-6 pl-10">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                      #{item.id_tagihan.toUpperCase()}
                    </span>
                    {hasBpjs && (
                      <span className="inline-flex items-center gap-1 text-[8px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100 uppercase">
                        <FiShield size={8} /> BPJS
                      </span>
                    )}
                  </div>
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
                   <div className="flex items-center gap-1.5">
                     <FiClock className="text-slate-300" />
                     {parseDate(item.tanggal)}
                   </div>
                </td>
                <td className="p-6">
                   {isLunas ? (
                     <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-lg w-fit border border-emerald-100/50">
                       <FiCheckCircle size={12} />
                       {pembayaran?.tanggal_pembayaran 
                         ? parseDate(pembayaran.tanggal_pembayaran)
                         : parseDate(item.updatedAt)}
                     </div>
                   ) : (
                     <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">— Belum Konfirmasi —</span>
                   )}
                </td>
                <td className="p-6 text-right font-bold text-emerald-600 font-mono text-xs">
                  {totalBpjs > 0 ? formatRupiah(totalBpjs) : <span className="text-slate-300">—</span>}
                </td>
                <td className="p-6 text-right font-black text-violet-600 font-mono text-xs">
                  {formatRupiah(totalIur)}
                </td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;