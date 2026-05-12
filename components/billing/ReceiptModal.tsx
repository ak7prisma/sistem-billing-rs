"use client";

import React from "react";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { Tagihan } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/currency";
import BaseModal from "../ui/BaseModal";
import { useInvoiceData } from "@/lib/hooks/useInvoiceData";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan: Tagihan | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, tagihan }) => {
  const { rincian, pasien, loading } = useInvoiceData(tagihan, isOpen);

  if (!isOpen || !tagihan) return null;

  // Only show items the patient must actually pay
  const itemBayar = rincian.filter(r => !r.is_covered_bpjs);
  const totalBayar = itemBayar.reduce((s, r) => s + (r.subtotal || 0), 0);
  const totalBpjs = rincian.filter(r => r.is_covered_bpjs).reduce((s, r) => s + (r.subtotal || 0), 0);
  const currentDate = new Date().toLocaleString("id-ID");

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

        <div className="text-[11px] mb-6 space-y-1.5 border-b border-dashed border-slate-200 pb-4">
          <div className="flex justify-between">
            <span className="text-slate-400">Tgl:</span>
            <span className="font-bold">{currentDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">No:</span>
            <span className="font-bold uppercase">{tagihan.id_tagihan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Pas:</span>
            <span className="font-bold uppercase truncate ml-2">{pasien?.nama || "..."}</span>
          </div>
          {pasien?.tipe_penjamin === "bpjs" && (
            <div className="flex justify-between">
              <span className="text-slate-400">Jaminan:</span>
              <span className="font-bold uppercase text-emerald-600">BPJS Kesehatan</span>
            </div>
          )}
        </div>

        <table className="w-full text-[11px] mb-4">
          <thead className="border-b-2 border-dashed border-slate-300">
            <tr>
              <th className="text-left py-2 uppercase tracking-tighter">Item</th>
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
                  <td className="py-2 text-slate-600 max-w-[150px] break-words">{item.nama_layanan}</td>
                  <td className="text-right py-2 font-bold tracking-tighter text-[12px]">{formatRupiah(item.subtotal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && totalBpjs > 0 && (
          <div className="text-[10px] text-emerald-600 font-bold mb-4 border border-dashed border-emerald-200 rounded px-3 py-2 bg-emerald-50">
            *Biaya BPJS {formatRupiah(totalBpjs)} telah ditanggung.
          </div>
        )}

        <div className="border-t-2 border-dashed border-slate-300 pt-4 mb-8 flex justify-between items-center">
          <span className="font-bold text-xs uppercase">Total Bayar</span>
          <span className="text-lg font-black text-slate-900 tracking-tighter">
            {loading ? "..." : formatRupiah(totalBayar)}
          </span>
        </div>

        <div className="text-center text-[10px] border-t-2 border-dashed border-slate-300 pt-6">
          <p className="font-bold mb-1 uppercase tracking-widest">Terima Kasih</p>
          <p className="italic text-slate-500 font-sans">Semoga Cepat Sembuh</p>
        </div>
      </div>
    </BaseModal>
  );
};

export default ReceiptModal;