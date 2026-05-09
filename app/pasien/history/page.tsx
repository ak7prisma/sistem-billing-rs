"use client";

import { useState } from "react";
import { FiSearch, FiLoader, FiClock } from "react-icons/fi";
import { getTagihanById } from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTagihanByPasien } from "@/lib/hooks/useTagihan";
import InvoiceCard from "@/components/billing/InvoiceCard";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const { history: tagihans, loading: tagihanLoading, refresh } = useTagihanByPasien(user?.uid || "");
  const [search, setSearch] = useState("");
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const filteredHistory = tagihans.filter(item => 
    (item.poli || "").toLowerCase().includes(search.toLowerCase()) || 
    item.id_tagihan.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetail = async (id: string) => {
    const data = await getTagihanById(id);
    if (data) {
      setSelectedTagihan(data);
      if (data.status === 'lunas') {
        setIsReceiptModalOpen(true);
      } else {
        setIsInvoiceModalOpen(true);
      }
    }
  };

  const isLoading = authLoading || (tagihanLoading && tagihans.length === 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Riwayat...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8 mb-20 md:mb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-slate-800 mb-2">
            Riwayat <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-violet-500">Transaksi</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Daftar seluruh riwayat tagihan dan pembayaran Anda.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <FiSearch className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari invoice atau poli..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 font-bold shadow-sm transition text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((tagihan) => (
            <InvoiceCard 
              key={tagihan.id_tagihan} 
              tagihan={tagihan} 
              onViewDetail={handleViewDetail}
            />
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-200">
              <FiClock size={32} />
            </div>
            <p className="text-slate-800 font-black uppercase tracking-tight">Transaksi tidak ditemukan.</p>
            <p className="text-slate-400 text-xs mt-1 mb-4">Pastikan keyword pencarian sudah benar.</p>
            <button 
              onClick={() => setSearch("")}
              className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition uppercase tracking-widest"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>

      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        tagihan={selectedTagihan}
        onSuccess={refresh}
        role="pasien"
      />

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        tagihan={selectedTagihan}
      />
    </div>
  );
}