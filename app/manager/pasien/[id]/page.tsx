"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { FiChevronLeft, FiLoader } from "react-icons/fi";
import { usePasienDetail } from "@/lib/hooks/usePasien";
import { useTagihanByPasien } from "@/lib/hooks/useTagihan";

// Manager Components
import PatientInfoCard from "@/components/manager/PatientInfoCard";
import PatientHistory from "@/components/manager/PatientHistory";

export default function PasienDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const { pasien, loading: loadingPasien } = usePasienDetail(id as string);
  const { history, loading: loadingHistory } = useTagihanByPasien(id as string);

  if (loadingPasien) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Mengambil Profil Pasien...</p>
      </div>
    );
  }

  if (!pasien) {
    return (
      <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pasien tidak ditemukan.</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline active:scale-95 transition-transform">
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header & Back Button */}
      <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition shadow-sm active:scale-90"
        >
          <FiChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Profil Pasien</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Detail identitas & histori kunjungan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <PatientInfoCard pasien={pasien} />
        </div>

        {/* 3. Right Column: Billing History */}
        <div className="lg:col-span-2">
          <PatientHistory 
            history={history} 
            loading={loadingHistory} 
          />
        </div>
      </div>
    </div>
  );
}