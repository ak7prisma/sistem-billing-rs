"use client";

import React from "react";
import { FiX, FiLoader, FiShield, FiDollarSign } from "react-icons/fi";
import { Tagihan } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/currency";
import BaseModal from "@/components/ui/BaseModal";
import { useInvoiceData } from "@/lib/hooks/useInvoiceData";
import StatusBadge from "@/components/ui/StatusBadge";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan: Tagihan | null;
  filterJenis?: "obat" | "medis" | "laboratorium";
}

const JENIS_LABEL: Record<string, string> = {
  obat: "Obat",
  medis: "Tindakan Medis",
  laboratorium: "Layanan Labor",
};

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  tagihan,
  filterJenis 
}) => {
  const { rincian, pasien, loading } = useInvoiceData(tagihan, isOpen);

  if (!isOpen || !tagihan) return null;

  // Filter rincian jika sedang berada di page spesifik (Obat/Medis/Labor)
  const effectiveRincian = filterJenis 
    ? rincian.filter(r => r.jenis === filterJenis)
    : rincian;

  const totalBpjs = effectiveRincian.filter(r => r.is_covered_bpjs).reduce((s, r) => s + (r.subtotal || 0), 0);
  const totalIur = effectiveRincian.filter(r => !r.is_covered_bpjs).reduce((s, r) => s + (r.subtotal || 0), 0);

  const byJenis: Record<string, typeof rincian> = {};
  effectiveRincian.forEach(r => {
    const key = r.jenis || "lainnya";
    if (!byJenis[key]) byJenis[key] = [];
    byJenis[key].push(r);
  });

  const parseDate = (tanggal: any) => {
    if (!tanggal) return "—";
    let date: Date;
    if (tanggal.seconds) {
      date = new Date(tanggal.seconds * 1000);
    } else if (tanggal instanceof Date) {
      date = tanggal;
    } else {
      date = new Date(tanggal);
    }
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {filterJenis ? `Audit Detail ${JENIS_LABEL[filterJenis]}` : "Detail Transaksi Lengkap"}
          </p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            #{tagihan.id_tagihan.toUpperCase()}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={tagihan.status as any} />
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Pasien Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4 space-y-1 border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pasien</p>
            <p className="font-black text-slate-800 text-sm leading-tight">{loading ? "..." : (pasien?.nama || "—")}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{pasien?.tipe_penjamin || "—"}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 space-y-1 border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Poli / Tanggal</p>
            <p className="font-black text-slate-800 text-sm leading-tight">{tagihan.poli || "Umum"}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
              {parseDate(tagihan.tanggal)}
            </p>
          </div>
        </div>

        {/* BPJS Summary Banner (Hanya untuk Jenis yang dipilih) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-md shadow-emerald-500/20 shrink-0">
              <FiShield size={16} />
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Cover BPJS {filterJenis ? `(${JENIS_LABEL[filterJenis]})` : ""}</p>
              <p className="font-black text-emerald-700 text-sm">{loading ? "..." : formatRupiah(totalBpjs)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-2xl p-4">
            <div className="bg-violet-500 p-2 rounded-xl text-white shadow-md shadow-violet-500/20 shrink-0">
              <FiDollarSign size={16} />
            </div>
            <div>
              <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest">Iur Biaya {filterJenis ? `(${JENIS_LABEL[filterJenis]})` : ""}</p>
              <p className="font-black text-violet-700 text-sm">{loading ? "..." : formatRupiah(totalIur)}</p>
            </div>
          </div>
        </div>

        {/* Rincian per jenis */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <FiLoader className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Memuat Rincian...</p>
          </div>
        ) : effectiveRincian.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tidak ada item {filterJenis ? JENIS_LABEL[filterJenis] : ""} di transaksi ini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(byJenis).map(([jenis, items]) => {
              const subtotalJenis = items.reduce((s, r) => s + (r.subtotal || 0), 0);
              const subtotalBpjsJenis = items.filter(r => r.is_covered_bpjs).reduce((s, r) => s + (r.subtotal || 0), 0);
              return (
                <div key={jenis} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-3 bg-slate-50/50 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {JENIS_LABEL[jenis] || jenis}
                    </span>
                    <div className="flex items-center gap-2">
                      {subtotalBpjsJenis > 0 && (
                        <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 uppercase">
                          BPJS {formatRupiah(subtotalBpjsJenis)}
                        </span>
                      )}
                      <span className="text-[10px] font-black text-slate-700">{formatRupiah(subtotalJenis)}</span>
                    </div>
                  </div>

                  <table className="w-full text-sm">
                    <thead className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <tr>
                        <th className="px-5 py-2.5 text-left">Layanan</th>
                        <th className="px-5 py-2.5 text-right">Harga Asli</th>
                        <th className="px-5 py-2.5 text-right text-emerald-600">BPJS</th>
                        <th className="px-5 py-2.5 text-right text-violet-600">Iur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {items.map(item => {
                        const isCovered = item.is_covered_bpjs === true;
                        return (
                          <tr key={item.id_rincian} className="hover:bg-slate-50/50 transition">
                            <td className="px-5 py-3">
                              <span className="font-semibold text-slate-700">{item.nama_layanan}</span>
                              {isCovered && (
                                <span className="ml-2 text-[8px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded uppercase border border-emerald-100">
                                  BPJS
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-right text-slate-400 font-mono text-xs">
                              {formatRupiah(item.subtotal)}
                            </td>
                            <td className="px-5 py-3 text-right font-mono font-bold text-xs text-emerald-600">
                              {isCovered ? formatRupiah(item.subtotal) : "—"}
                            </td>
                            <td className="px-5 py-3 text-right font-mono font-black text-xs">
                              <span className={isCovered ? "text-slate-300" : "text-violet-600"}>
                                {isCovered ? "Rp 0" : formatRupiah(item.subtotal)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer total */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {filterJenis ? `Total ${JENIS_LABEL[filterJenis]}` : "Total Keseluruhan"}
          </p>
          <p className="text-xl font-black text-slate-900 tracking-tighter">
            {formatRupiah(filterJenis ? (totalBpjs + totalIur) : tagihan.total_biaya)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition active:scale-95 shadow-lg shadow-slate-900/10"
        >
          Tutup
        </button>
      </div>
    </BaseModal>
  );
};

export default TransactionDetailModal;
