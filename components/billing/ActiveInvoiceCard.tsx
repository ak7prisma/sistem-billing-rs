"use client";

import React from "react";
import { FiFileText, FiCreditCard, FiSearch } from "react-icons/fi";
import { Tagihan } from "@/lib/types";

interface ActiveInvoiceCardProps {
  tagihan: Tagihan;
  onPay: (id: string) => void;
  onViewDetail: (id: string) => void;
}

const ActiveInvoiceCard: React.FC<ActiveInvoiceCardProps> = ({ tagihan, onPay, onViewDetail }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center shadow-xl border-l-8 border-l-amber-500 gap-6 transition-all hover:shadow-2xl">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 flex-shrink-0 shadow-inner">
          <FiFileText className="text-amber-500 w-8 h-8 md:w-10 md:h-10" />
        </div>
        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-md mb-2 inline-block uppercase tracking-widest">
            Belum Dibayar
          </span>
          <h3 className="font-black text-slate-800 text-xl md:text-2xl tracking-tight leading-none mb-1">
            {tagihan.id}
          </h3>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            {tagihan.poli} — {tagihan.tanggal}
          </p>
        </div>
      </div>
      
      <div className="text-left md:text-right w-full md:w-auto flex flex-col gap-4">
        <div className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">
          {formatCurrency(tagihan.total_biaya)}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetail(tagihan.id)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition"
          >
            <FiSearch className="w-4 h-4" /> Detail
          </button>
          <button
            onClick={() => onPay(tagihan.id)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-violet-500 hover:opacity-90 text-white px-8 py-3 rounded-xl text-sm font-black transition shadow-lg shadow-violet-500/20 uppercase tracking-wider"
          >
            <FiCreditCard className="w-4 h-4" /> Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveInvoiceCard;
