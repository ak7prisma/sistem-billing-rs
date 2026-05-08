"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

const BillingEmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
        <FiSearch className="text-slate-300 w-8 h-8" />
      </div>
      <p className="text-slate-800 font-black uppercase tracking-tight">Tidak Ada Tagihan</p>
      <p className="text-slate-400 text-xs font-medium max-w-[200px] mt-1">
        Belum ada data tagihan yang masuk atau tidak ditemukan.
      </p>
    </div>
  );
};

export default BillingEmptyState;
