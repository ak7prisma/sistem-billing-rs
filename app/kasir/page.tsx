"use client";

import React, { useState } from "react";
import { FiSearch, FiPrinter } from "react-icons/fi";
import { useTagihans } from "@/lib/hooks/useTagihan";
import StatusBadge from "@/components/ui/StatusBadge";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import StatsCard from "@/components/shared/StatsCard";
import { formatRupiah } from "@/lib/utils/currency";

export default function KasirDashboard() {
  const [search, setSearch] = useState("");
  const { tagihans, loading, refresh } = useTagihans();
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Logic for Auto-Expiry and filtering can be memoized or kept here
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
        <StatsCard 
          label="Menunggu Bayar"
          value={tagihans.filter(t => t.status === "pending").length.toString().padStart(2, '0')}
          description="Tagihan Pending"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatsCard 
          label="Sudah Lunas"
          value={tagihans.filter(t => t.status === "lunas").length.toString().padStart(2, '0')}
          description="Transaksi Selesai"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard 
          label="Butuh Perhatian"
          value={tagihans.filter(t => t.status === "gagal").length.toString().padStart(2, '0')}
          description="Status Gagal"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

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
                    <td className="p-6 font-black text-slate-800">{formatRupiah(item.total_biaya)}</td>
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
        onSuccess={refresh}
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
