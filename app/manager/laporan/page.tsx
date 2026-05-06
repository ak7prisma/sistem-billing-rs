"use client";

import React, { useState } from "react";
import { FiSearch, FiFilter, FiDownload, FiEye, FiCalendar } from "react-icons/fi";
import { MOCK_TAGIHAN } from "@/lib/service/billing";
import StatusBadge from "@/components/ui/StatusBadge";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";

export default function LaporanManager() {
  const [search, setSearch] = useState("");
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const filteredData = MOCK_TAGIHAN.filter(item => 
    item.poli.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewReceipt = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan);
    setIsReceiptModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Laporan <span className="text-blue-600">Transaksi</span></h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Audit dan rekapitulasi data pembayaran pasien.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black text-slate-600 shadow-sm hover:bg-slate-50 transition uppercase tracking-widest">
            <FiDownload /> Export PDF
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition uppercase tracking-widest">
            <FiCalendar /> Filter Tanggal
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari Invoice ID atau Poli..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-bold shadow-sm transition text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-400 hover:text-blue-600 transition shadow-sm">
          <FiFilter size={20} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="p-6 pl-10">Invoice ID</th>
                <th className="p-6">Poli / Layanan</th>
                <th className="p-6">Tanggal</th>
                <th className="p-6">Total Tagihan</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 pr-10 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition group">
                  <td className="p-6 pl-10">
                    <span className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{item.id}</span>
                  </td>
                  <td className="p-6 font-bold text-slate-600">{item.poli}</td>
                  <td className="p-6 text-slate-400 font-medium">{item.tanggal}</td>
                  <td className="p-6 font-black text-slate-800">{formatCurrency(item.total_biaya)}</td>
                  <td className="p-6 text-center">
                    <StatusBadge status={item.status as any} />
                  </td>
                  <td className="p-6 pr-10 text-right">
                    <button 
                      onClick={() => handleViewReceipt(item)}
                      className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest"
                    >
                      <FiEye /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        tagihan={selectedTagihan}
      />
    </div>
  );
}
