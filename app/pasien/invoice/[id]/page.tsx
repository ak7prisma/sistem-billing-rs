"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiCreditCard, FiLoader } from "react-icons/fi";
import { useTagihanDetail } from "@/lib/hooks/useTagihan";
import { usePasienDetail } from "@/lib/hooks/usePasien";

// Shared Billing Components
import InvoiceContent from "@/components/billing/InvoiceContent";
import InvoiceSummary from "@/components/billing/InvoiceSummary";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [isPaying, setIsPaying] = useState(false);
  
  const { tagihan, loading: loadingTagihan } = useTagihanDetail(id);
  const { pasien, loading: loadingPasien } = usePasienDetail(tagihan?.pasien_id || "");

  const handlePayment = async () => {
    if (!tagihan || !pasien) return;
    
    setIsPaying(true);
    try {
      const response = await fetch("/api/payment/xendit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagihanId: tagihan.id_tagihan,
          amount: tagihan.total_biaya,
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
      setIsPaying(false);
    }
  };

  if (loadingTagihan || loadingPasien) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-violet-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Menyiapkan Tagihan...</p>
      </div>
    );
  }

  if (!tagihan) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-12 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Tagihan tidak ditemukan</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 mb-8">Maaf, data invoice yang Anda cari tidak tersedia.</p>
        <button 
          onClick={() => router.push("/pasien")} 
          className="text-violet-600 font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button
        onClick={() => router.back()}
        className="group inline-flex items-center gap-2 text-slate-400 hover:text-violet-600 font-black transition text-[10px] uppercase tracking-widest"
      >
        <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali
      </button>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        {/* Core Invoice Content (Header & Breakdown) */}
        <InvoiceContent 
          tagihan={tagihan} 
          pasien={pasien} 
          rincian={tagihan.rincian || []} 
        />

        {/* Financial Summary & Payment Action */}
        <InvoiceSummary 
          rincian={tagihan.rincian || []} 
          tagihanTotal={tagihan.total_biaya}
          dark={true}
        >
          {tagihan.status === "pending" && (
            <button
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-white text-slate-900 px-12 py-5 rounded-[1.5rem] font-black shadow-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {isPaying ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiCreditCard className="w-5 h-5" />}
              {isPaying ? "Memproses..." : "Bayar Sekarang"}
            </button>
          )}
        </InvoiceSummary>
      </div>
    </div>
  );
}
