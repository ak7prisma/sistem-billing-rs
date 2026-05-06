"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MOCK_TAGIHAN } from "@/lib/service/billing";
import InvoiceCard from "@/components/billing/InvoiceCard";

export default function HistoryPage() {
  const [search, setSearch] = useState("");

  const filteredHistory = MOCK_TAGIHAN.filter(item => 
    item.poli.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8 mb-20 md:mb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-slate-800 mb-2">
            Riwayat <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500">Transaksi</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Daftar seluruh riwayat tagihan dan pembayaran Anda.</p>
        </div>
        <div className="relative w-full md:w-64 group">
          <FiSearch className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari invoice atau poli..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((tagihan) => (
            <InvoiceCard key={tagihan.id} tagihan={tagihan} />
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
    </div>
  );
}
