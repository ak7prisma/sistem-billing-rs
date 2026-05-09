"use client";

import React from "react";
import { FiActivity } from "react-icons/fi";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/20 transform -rotate-6">
          <FiActivity className="text-white w-8 h-8" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Satria Billing</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Sistem Informasi Rumah Sakit</p>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        {children}
      </div>

      <footer className="mt-12 text-center text-slate-400 text-xs font-medium">
        &copy; 2026 RS Satria Medika. All Rights Reserved.
      </footer>
    </div>
  );
}