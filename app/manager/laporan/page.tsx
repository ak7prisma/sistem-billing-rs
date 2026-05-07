"use client";

import React, { useEffect, useState } from "react";
import { FiSearch, FiDownload, FiEye } from "react-icons/fi";
import { getAllTagihan } from "@/lib/firebase/firestore";
import StatusBadge from "@/components/ui/StatusBadge";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";

export default function LaporanManager() {
  const [search, setSearch] = useState("");
  const [tagihans, setTagihans] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllTagihan();
      setTagihans(data);
    } catch (error) {
      console.error("Error fetching tagihan:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = tagihans.filter(item => 
    (item.poli || "").toLowerCase().includes(search.toLowerCase()) || 
    item.id_tagihan.toLowerCase().includes(search.toLowerCase())
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

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat Data Audit...</p>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
            <FiSearch className="text-slate-300 w-8 h-8" />
          </div>
          <p className="text-slate-800 font-black uppercase tracking-tight">Data Tidak Ditemukan</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
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
              <tr key={item.id_tagihan} className="hover:bg-slate-50/50 transition group">
                <td className="p-6 pl-10">
                  <span className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{item.id_tagihan}</span>
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
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Laporan Transaksi" 
        subtitle="Audit dan rekapitulasi data pembayaran pasien."
        badge="Audit Mode"
      >
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Cari Invoice / Poli..." 
          className="md:min-w-75"
        />
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition uppercase tracking-[0.2em]">
          <FiDownload /> Export PDF
        </button>
      </PageHeader>


      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-100 flex flex-col">
        {renderTableContent()}
      </div>


      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        tagihan={selectedTagihan}
      />
    </div>
  );
}
