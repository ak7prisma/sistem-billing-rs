import React from "react";
import Link from "next/link";
import { FiFileText, FiChevronRight } from "react-icons/fi";
import { Tagihan } from "@/lib/types";
import StatusBadge from "../ui/StatusBadge";

interface InvoiceCardProps {
  tagihan: Tagihan;
  showPayButton?: boolean;
  onPay?: (id: string) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ tagihan, showPayButton, onPay }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all border-l-4 border-l-violet-500 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0 group-hover:bg-violet-50 transition-colors">
            <FiFileText className="text-slate-400 w-6 h-6 group-hover:text-violet-500 transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={tagihan.status === 'lunas' && tagihan.total_biaya === 0 ? "BPJS Cover" : tagihan.status} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tagihan.id}</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{tagihan.poli}</h3>
            <p className="text-xs text-slate-500">{tagihan.tanggal}</p>
          </div>
        </div>

        <div className="flex flex-col md:items-end w-full md:w-auto">
          <div className="text-xl font-black text-slate-800 mb-2">
            {formatCurrency(tagihan.total_biaya)}
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link
              href={`/pasien/invoice/${tagihan.id}`}
              className="flex-1 md:flex-none text-center px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cek Detail
            </Link>
            {showPayButton && tagihan.status === "pending" && (
              <button
                onClick={() => onPay?.(tagihan.id)}
                className="flex-1 md:flex-none bg-gradient-to-r from-emerald-500 to-violet-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition shadow-sm"
              >
                Bayar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-2 transition-all text-slate-300 hidden md:block">
        <FiChevronRight className="w-6 h-6" />
      </div>
    </div>
  );
};

export default InvoiceCard;
