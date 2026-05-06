"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { MOCK_TAGIHAN } from "@/lib/service/billing";
import InvoiceCard from "@/components/billing/InvoiceCard";
import ActiveInvoiceCard from "@/components/billing/ActiveInvoiceCard";

export default function PasienHome() {
  const [isPaid, setIsPaid] = useState(false);
  
  const activeBill = MOCK_TAGIHAN.find(t => t.status === "pending");
  const recentHistory = MOCK_TAGIHAN.filter(t => t.status !== "pending").slice(0, 2);

  const handlePay = (id: string) => {
    if (confirm(`Lanjutkan pembayaran ${id} menggunakan QRIS?`)) {
      setIsPaid(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-slate-800 mb-2">
          Tagihan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500">Aktif</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base">Selesaikan pembayaran administrasi rumah sakit Anda.</p>
      </div>

      {!isPaid && activeBill ? (
        <ActiveInvoiceCard 
          tagihan={activeBill} 
          onPay={() => handlePay(activeBill.id)} 
        />
      ) : isPaid ? (
        <div className="bg-emerald-50 p-6 md:p-8 rounded-2xl border border-emerald-200 flex items-center shadow-md gap-4 animate-in fade-in zoom-in duration-500">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <FiCheckCircle className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h3 className="font-black text-lg md:text-xl text-emerald-800 uppercase tracking-wide">Pembayaran Berhasil!</h3>
            <p className="text-xs md:text-sm font-medium text-emerald-600">Terima kasih. Bukti bayar telah dikirim ke Email Anda.</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-12 text-center rounded-2xl border border-dashed border-slate-200">
           <p className="text-slate-400 font-bold">Tidak ada tagihan aktif saat ini.</p>
        </div>
      )}

      <div className="mt-8 md:mt-12">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-6 border-b border-slate-100 pb-2">Riwayat Terakhir</h3>
        <div className="space-y-4">
          {recentHistory.map((tagihan) => (
            <InvoiceCard key={tagihan.id} tagihan={tagihan} />
          ))}
        </div>
      </div>
    </div>
  );
}
