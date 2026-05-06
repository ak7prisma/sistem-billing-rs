"use client";

import React, { useState } from "react";
import { FiSearch, FiPrinter, FiPlus } from "react-icons/fi";
import { MOCK_TAGIHAN } from "@/lib/service/billing";
import StatusBadge from "@/components/ui/StatusBadge";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";
import PageHeader from "@/components/shared/PageHeader";

export default function KasirDashboard() {
  const [search, setSearch] = useState("");
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const filteredData = MOCK_TAGIHAN.filter(item => 
    item.poli.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
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
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition uppercase tracking-widest">
          <FiSearch /> Cari Tagihan
        </button>
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition uppercase tracking-widest">
          <FiPlus /> Buat Baru
        </button>
      </PageHeader>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black">24</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Menunggu Bayar</p>
            <p className="text-sm font-black text-slate-800 tracking-tight">Tagihan Pending</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black">15</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sudah Lunas</p>
            <p className="text-sm font-black text-slate-800 tracking-tight">Transaksi Hari Ini</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">08</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Revisi / Gagal</p>
            <p className="text-sm font-black text-slate-800 tracking-tight">Butuh Perhatian</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
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
                  <td className="p-6 pl-10 font-black text-slate-800">{item.id}</td>
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
      </div>

      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        tagihan={selectedTagihan}
      />

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        tagihan={selectedTagihan}
      />
    </div>
  );
}
