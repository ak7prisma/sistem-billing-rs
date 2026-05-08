"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiCreditCard, FiPrinter, FiLoader } from "react-icons/fi";
import { Tagihan, RincianTagihan, Pasien } from "@/lib/types";
import { prosesPembayaran } from "@/lib/service/payment";
import { getRinciTagihanByTagihan, getData } from "@/lib/firebase/firestore";

// New Shared Components
import InvoiceContent from "./InvoiceContent";
import InvoiceSummary from "./InvoiceSummary";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan: Tagihan | null;
  onSuccess?: () => void;
  role: "pasien" | "kasir";
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, tagihan, onSuccess, role }) => {
  const [loading, setLoading] = useState(false);
  const [rincian, setRincian] = useState<RincianTagihan[]>([]);
  const [loadingRincian, setLoadingRincian] = useState(false);
  const [pasien, setPasien] = useState<Pasien | null>(null);

  useEffect(() => {
    if (!isOpen || !tagihan) return;

    const fetchData = async () => {
      setLoadingRincian(true);
      try {
        const pData = await getData("pasien", tagihan.pasien_id) as Pasien;
        setPasien(pData);

        if (tagihan.rincian && tagihan.rincian.length > 0) {
          setRincian(tagihan.rincian);
        } else {
          const data = await getRinciTagihanByTagihan(tagihan.id_tagihan);
          setRincian(data);
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoadingRincian(false);
      }
    };

    fetchData();
  }, [isOpen, tagihan]);

  if (!isOpen || !tagihan) return null;

  const handlePayTunai = async () => {
    setLoading(true);
    try {
      await prosesPembayaran(tagihan, "tunai", rincian);
      alert("Pembayaran Tunai Berhasil Konfirmasi!");
      onSuccess?.();
      onClose();
    } catch (error) {
      alert("Gagal memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const handleXenditPayment = async () => {
    if (!tagihan || !pasien) return;
    setLoading(true);
    try {
      const totalTagihan = rincian.reduce((sum, r) => sum + r.subtotal, 0);
      const totalCover = rincian.reduce((sum, r) => sum + (r.is_covered_bpjs ? r.subtotal : 0), 0);
      const iurBiaya = totalTagihan - totalCover;

      const response = await fetch("/api/payment/xendit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagihanId: tagihan.id_tagihan,
          amount: iurBiaya,
          customerName: pasien.nama,
          customerEmail: pasien.email || `${pasien.nama.replace(/\s/g, "").toLowerCase()}@hospital.com`,
        }),
      });

      const data = await response.json();
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        alert("Gagal membuat invoice pembayaran: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="absolute top-8 right-8 z-10">
          <button onClick={onClose} className="p-2 bg-white/50 backdrop-blur-md hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingRincian ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <FiLoader className="w-10 h-10 text-violet-600 animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menyiapkan Rincian Invoice...</p>
            </div>
          ) : (
            <InvoiceContent tagihan={tagihan} pasien={pasien} rincian={rincian} />
          )}
        </div>

        <InvoiceSummary rincian={rincian} tagihanTotal={tagihan.total_biaya} loadingRincian={loadingRincian}>
          {tagihan.status === "pending" ? (
             <>
               <button 
                 onClick={onClose}
                 className="px-8 py-4 border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-white transition text-xs uppercase tracking-widest active:scale-95"
               >
                 Batal
               </button>
               {role === "pasien" ? (
                  <button 
                    onClick={handleXenditPayment}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-violet-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:opacity-90 transition uppercase text-xs tracking-widest disabled:opacity-50 active:scale-95"
                  >
                    {loading ? <FiLoader className="animate-spin" /> : <FiCreditCard size={18} />} 
                    {loading ? "Memproses..." : "Bayar Sekarang"}
                  </button>
               ) : (
                  <button 
                    onClick={handlePayTunai}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition uppercase text-xs tracking-widest disabled:opacity-50 active:scale-95"
                  >
                    {loading ? <FiLoader className="animate-spin" /> : <FiCreditCard size={18} />} 
                    {loading ? "Konfirmasi Tunai" : "Bayar Cash"}
                  </button>
               )}
             </>
          ) : (
            <button className="inline-flex items-center justify-center gap-3 bg-slate-800 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-700 transition uppercase text-xs tracking-widest active:scale-95">
              <FiPrinter size={18} /> Cetak Struk PDF
            </button>
          )}
        </InvoiceSummary>
      </div>
    </div>
  );
};

export default InvoiceModal;
