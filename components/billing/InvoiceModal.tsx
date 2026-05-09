"use client";

import React from "react";
import { FiCreditCard, FiPrinter, FiLoader } from "react-icons/fi";
import { Tagihan } from "@/lib/types";

import InvoiceContent from "./InvoiceContent";
import InvoiceSummary from "./InvoiceSummary";
import BaseModal from "../ui/BaseModal";
import { useInvoiceData } from "@/lib/hooks/useInvoiceData";
import { useInvoiceActions } from "@/lib/hooks/useInvoiceActions";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan: Tagihan | null;
  onSuccess?: () => void;
  role: "pasien" | "kasir";
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, tagihan, onSuccess, role }) => {
  const { rincian, pasien, loading: loadingData } = useInvoiceData(tagihan, isOpen);
  const { handlePayTunai, handleXenditPayment, isProcessing } = useInvoiceActions(
    tagihan, 
    rincian, 
    pasien, 
    onSuccess, 
    onClose
  );

  if (!isOpen || !tagihan) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex-1 overflow-y-auto">
        {loadingData ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <FiLoader className="w-10 h-10 text-violet-600 animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menyiapkan Rincian Invoice...</p>
          </div>
        ) : (
          <InvoiceContent tagihan={tagihan} pasien={pasien} rincian={rincian} />
        )}
      </div>

      <InvoiceSummary 
        rincian={rincian} 
        tagihanTotal={tagihan.total_biaya} 
        loadingRincian={loadingData}
      >
        {tagihan.status === "pending" ? (
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-8 py-4 border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-white transition text-xs uppercase tracking-widest active:scale-95"
            >
              Batal
            </button>
            
            {role === "pasien" ? (
              <button 
                onClick={handleXenditPayment}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-violet-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:opacity-90 transition uppercase text-xs tracking-widest disabled:opacity-50 active:scale-95"
              >
                {isProcessing ? <FiLoader className="animate-spin" /> : <FiCreditCard size={18} />} 
                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
              </button>
            ) : (
              <button 
                onClick={handlePayTunai}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition uppercase text-xs tracking-widest disabled:opacity-50 active:scale-95"
              >
                {isProcessing ? <FiLoader className="animate-spin" /> : <FiCreditCard size={18} />} 
                {isProcessing ? "Konfirmasi Tunai" : "Bayar Cash"}
              </button>
            )}
          </div>
        ) : (
          <button className="inline-flex items-center justify-center gap-3 bg-slate-800 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-700 transition uppercase text-xs tracking-widest active:scale-95">
            <FiPrinter size={18} /> Cetak Struk PDF
          </button>
        )}
      </InvoiceSummary>
    </BaseModal>
  );
};

export default InvoiceModal;