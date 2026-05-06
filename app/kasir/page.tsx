"use client";

import React, { useState, useEffect } from "react";
import { FiSearch, FiPrinter, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { getTagihanById, MOCK_TAGIHAN } from "@/lib/service/billing";
import { Tagihan } from "@/lib/types";

export default function KasirDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }));
  }, []);

  const handleAction = (id: string, action: 'pay' | 'print') => {
    const data = getTagihanById(id);
    if (data) {
      setSelectedTagihan(data);
      if (action === 'pay') {
        setIsInvoiceModalOpen(true);
      } else {
        setIsReceiptModalOpen(true);
      }
    }
  };

  const handleConfirmPayment = (id: string) => {
    setIsInvoiceModalOpen(false);
    setSuccessMessage(`Pembayaran untuk ${id} berhasil dikonfirmasi!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const filteredData = MOCK_TAGIHAN.filter(item => 
    item.poli.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-10">
      {successMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
           <FiCheckCircle size={24} />
           <span className="font-bold">{successMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mb-1 uppercase tracking-wider">{currentDate}</p>
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500">Antrean</span></h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Monitor dan proses pembayaran billing pasien.</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <FiSearch className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari Pasien / No Antrean..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 font-bold shadow-sm transition text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
              <tr>
                <th className="p-5 pl-8 text-center w-24">ID</th>
                <th className="p-5">Poli / Unit</th>
                <th className="p-5">Tanggal</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 pr-8 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50 font-medium">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition group">
                    <td className="p-5 pl-8 text-center">
                       <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-lg font-black text-[10px] group-hover:bg-violet-100 group-hover:text-violet-700 transition-colors">
                        {item.id}
                       </span>
                    </td>
                    <td className="p-5">
                      <div className="font-black text-slate-800 group-hover:text-violet-600 transition-colors">{item.poli}</div>
                    </td>
                    <td className="p-5 text-slate-500">{item.tanggal}</td>
                    <td className="p-5 text-center">
                      <StatusBadge status={item.status as any} />
                    </td>
                    <td className="p-5 pr-8 text-right">
                      {item.status === 'pending' ? (
                        <button 
                          onClick={() => handleAction(item.id, 'pay')}
                          className="inline-block bg-gradient-to-r from-emerald-500 to-violet-500 hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-[11px] font-black transition shadow-lg shadow-violet-500/10 uppercase tracking-wider"
                        >
                          Proses Bayar
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(item.id, 'print')}
                          className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-[11px] font-black transition shadow-sm uppercase tracking-wider"
                        >
                          <FiPrinter size={14} /> Cetak
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-bold italic">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        tagihan={selectedTagihan}
        onConfirmPayment={handleConfirmPayment}
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
