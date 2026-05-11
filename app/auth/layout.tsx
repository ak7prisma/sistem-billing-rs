"use client";

import React from "react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="relative w-20 h-20 transform">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            fill 
            className="object-contain"
            priority 
          />
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