"use client";

import React from "react";
import { FiPrinter } from "react-icons/fi";
import StatusBadge from "@/components/ui/StatusBadge";
import { Tagihan } from "@/lib/types";
import { formatRupiah } from "@/lib/utils/currency";

interface BillingTableProps {
  data: Tagihan[];
  onAction: (item: Tagihan) => void;
}

const BillingTable: React.FC<BillingTableProps> = ({ data, onAction }) => {
  return (
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
          {data.map((item) => (
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
                  onClick={() => onAction(item)}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shadow-sm active:scale-95 ${
                    item.status === "pending" 
                    ? "bg-slate-900 text-white hover:bg-blue-600" 
                    : "bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white"
                  }`}
                >
                  {item.status === "pending" ? (
                    <>Konfirmasi Bayar</>
                  ) : (
                    <>
                      <FiPrinter size={14} /> Cetak Struk
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;