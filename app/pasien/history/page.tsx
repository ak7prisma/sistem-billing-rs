"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MOCK_TAGIHAN, getTagihanById } from "@/lib/service/mock";
import InvoiceCard from "@/components/billing/InvoiceCard";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const filteredHistory = MOCK_TAGIHAN.filter(item => 
    (item.poli || "").toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetail = (id: string) => {
    const data = getTagihanById(id);
    if (data) {
      setSelectedTagihan(data);
      if (data.status === 'lunas') {
        setIsReceiptModalOpen(true);
      } else {
        setIsInvoiceModalOpen(true);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8 mb-20 md:mb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-slate-800 mb-2">
            Riwayat <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500">Transaksi</span>
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
              key={tagihan.id} 
              tagihan={tagihan} 
              onViewDetail={handleViewDetail}
            />
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">Transaksi tidak ditemukan.</p>
            <button 
              onClick={() => setSearch("")}
              className="text-violet-600 mt-2 font-bold hover:underline"
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
