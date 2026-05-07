"use client";

import React, { useState, useEffect } from "react";
import { FiSearch, FiPrinter, FiPlus } from "react-icons/fi";
import { getAllTagihan } from "@/lib/firebase/firestore";
import { konsolidasiTagihan } from "@/lib/service/billing";
import StatusBadge from "@/components/ui/StatusBadge";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";

export default function KasirDashboard() {
  const [search, setSearch] = useState("");
  const [tagihans, setTagihans] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllTagihan();
      
      // Auto-Expiry Logic (24 Hours)
      const now = new Date().getTime();
      const processedData = data.map(t => {
        if (t.status === "pending" && t.createdAt) {
          const createdTime = t.createdAt.seconds 
            ? t.createdAt.seconds * 1000 
            : new Date(t.tanggal).getTime();
          
          const diffHours = (now - createdTime) / (1000 * 60 * 60);
          if (diffHours > 24) {
            return { ...t, status: "gagal" as const };
          }
        }
        return t;
      });

      setTagihans(processedData);
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

  const handleActionClick = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan);
    if (tagihan.status === "pending") {
      setIsInvoiceModalOpen(true);
    } else {
      setIsReceiptModalOpen(true);
    }
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
      <PageHeader 
        title="Antrean Billing" 
        subtitle="Proses pembayaran pasien dari Poli, Lab, dan Farmasi."
        badge="Kasir"
      >
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Cari No. Invoice / Poli..." 
        />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black">
            {tagihans.filter(t => t.status === "pending").length.toString().padStart(2, '0')}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Menunggu Bayar</p>
            <p className="text-sm font-black text-slate-800 tracking-tight">Tagihan Pending</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black">
            {tagihans.filter(t => t.status === "lunas").length.toString().padStart(2, '0')}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sudah Lunas</p>
            <p className="text-sm font-black text-slate-800 tracking-tight">Transaksi Selesai</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
            {tagihans.filter(t => t.status === "gagal").length.toString().padStart(2, '0')}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Butuh Perhatian</p>
            <p className="text-sm font-black text-slate-800 tracking-tight">Status Gagal</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-violet-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat Data Tagihan...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
              <FiSearch className="text-slate-300 w-8 h-8" />
            </div>
            <p className="text-slate-800 font-black uppercase tracking-tight">Tidak Ada Tagihan</p>
            <p className="text-slate-400 text-xs font-medium max-w-[200px] mt-1">Belum ada data tagihan yang masuk atau tidak ditemukan.</p>
          </div>
        ) : (
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
                  <tr key={item.id_tagihan} className="hover:bg-slate-50/50 transition group">
                    <td className="p-6 pl-10 font-black text-slate-800">{item.id_tagihan}</td>
                    <td className="p-6 font-bold text-slate-600">{item.poli}</td>
                    <td className="p-6 text-slate-400 font-medium">{item.tanggal}</td>
                    <td className="p-6 font-black text-slate-800">{formatCurrency(item.total_biaya)}</td>
                    <td className="p-6 text-center">
                      <StatusBadge status={item.status as any} />
                    </td>
                    <td className="p-6 pr-10 text-right">
                      <button 
                        onClick={() => handleActionClick(item)}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shadow-sm active:scale-95 ${
                          item.status === "pending" 
                          ? "bg-slate-900 text-white hover:bg-blue-600" 
                          : "bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white"
                        }`}
                      >
                        {item.status === "pending" ? (
                          <>Konfirmasi Bayar</>
                        ) : (
                          <><FiPrinter size={14} /> Cetak Struk</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSuccess={fetchData}
        tagihan={selectedTagihan}
        role="kasir"
      />

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        tagihan={selectedTagihan}
      />
    </div>
  );
}
