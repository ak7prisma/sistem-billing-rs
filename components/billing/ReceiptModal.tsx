"use client";

import React from "react";
import { FiArrowLeft, FiLoader, FiUser, FiCalendar } from "react-icons/fi";
import { Tagihan } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/currency";
import { formatDateTime } from "@/lib/utils/date";
import BaseModal from "../ui/BaseModal";
import { useInvoiceData } from "@/lib/hooks/useInvoiceData";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan: Tagihan | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, tagihan }) => {
  const { rincian, pasien, pembayaran, loading } = useInvoiceData(tagihan, isOpen);

  if (!isOpen || !tagihan) return null;

  const itemBayar = rincian.filter(r => !r.is_covered_bpjs);
  const totalBayar = itemBayar.reduce((s, r) => s + (r.subtotal || 0), 0);
  const totalBpjs = rincian.filter(r => r.is_covered_bpjs).reduce((s, r) => s + (r.subtotal || 0), 0);
  
  // Ambil tanggal dari pembayaran jika ada, jika tidak pakai waktu sekarang
  const displayDate = formatDateTime(pembayaran?.tanggal_pembayaran || new Date());

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      showCloseButton={false}
      id="receipt-modal-content"
      className="print:max-h-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
    >
      <div className="no-print p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition flex items-center gap-1 font-bold text-xs">
          <FiArrowLeft /> Tutup
        </button>
        <button
          onClick={() => window.print()}
          disabled={loading}
          className="bg-violet-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-violet-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <FiLoader className="animate-spin" /> : null}
          {loading ? "Memuat..." : "Cetak"}
        </button>
      </div>

      <div id="receipt-content" className="flex-1 overflow-y-auto p-8 font-mono text-slate-800 bg-white print:p-0 print:overflow-visible print:max-h-none">
        <div className="text-center mb-6 border-b-2 border-dashed border-slate-300 pb-4">
          <h2 className="font-bold text-xl uppercase leading-tight tracking-tight">RS Satria Medika</h2>
          <p className="text-[10px] mt-1 text-slate-500 font-sans">Jl. Kesehatan No. 99, Jakarta</p>
        </div>

        <div className="text-[11px] mb-6 space-y-2 border-b border-dashed border-slate-200 pb-4">
          <div className="flex justify-between items-start">
            <span className="text-slate-400">TGL KONFIRMASI:</span>
            <span className="font-bold text-right leading-tight">{displayDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">NO. INVOICE:</span>
            <span className="font-bold uppercase">#{tagihan.id_tagihan.slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">KASIR:</span>
            <span className="font-bold uppercase">{pembayaran?.nama_kasir || "AUTHORIZED"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">PASIEN:</span>
            <span className="font-bold uppercase truncate ml-2">{pasien?.nama || "..."}</span>
          </div>
          {pasien?.tipe_penjamin === "bpjs" && (
            <div className="flex justify-between">
              <span className="text-slate-400">JAMINAN:</span>
              <span className="font-bold uppercase text-emerald-600">BPJS KESEHATAN</span>
            </div>
          )}
        </div>

        <table className="w-full text-[11px] mb-4">
          <thead className="border-b-2 border-dashed border-slate-300">
            <tr>
              <th className="text-left py-2 uppercase tracking-tighter">Item Layanan</th>
              <th className="text-right py-2 uppercase tracking-tighter">Rp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-slate-100">
            {loading ? (
              <tr><td colSpan={2} className="py-4 text-center text-[9px] text-slate-400 animate-pulse uppercase font-black">Memuat Data...</td></tr>
            ) : itemBayar.length === 0 ? (
              <tr><td colSpan={2} className="py-4 text-center text-[9px] text-emerald-600 font-black uppercase">Semua biaya ditanggung BPJS</td></tr>
            ) : (
              itemBayar.map((item) => (
                <tr key={item.id_rincian}>
                  <td className="py-2 text-slate-600 max-w-[150px] break-words uppercase">{item.nama_layanan}</td>
                  <td className="text-right py-2 font-bold tracking-tighter text-[12px]">{formatRupiah(item.subtotal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>


        <div className="border-t-2 border-dashed border-slate-300 pt-4 mb-8 flex justify-between items-center">
          <span className="font-bold text-xs uppercase">Total Bayar</span>
          <span className="text-lg font-black text-slate-900 tracking-tighter">
            {loading ? "..." : formatRupiah(pembayaran?.jumlah_pembayaran || totalBayar)}
          </span>
        </div>

        <div className="text-center text-[10px] border-t-2 border-dashed border-slate-300 pt-6">
          <p className="font-bold mb-1 uppercase tracking-widest">Terima Kasih</p>
          <p className="italic text-slate-500 font-sans">Semoga Cepat Sembuh</p>
          <div className="mt-4 flex flex-col items-center justify-center gap-1 text-[8px] text-slate-400 uppercase font-black tracking-widest">
             <div className="flex items-center gap-1">
                <FiUser size={8} /> KASIR: {pembayaran?.nama_kasir || "AUTHORIZED STAFF"}
             </div>
             <div className="flex items-center gap-1">
                <FiCalendar size={8} /> {displayDate}
             </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ReceiptModal;