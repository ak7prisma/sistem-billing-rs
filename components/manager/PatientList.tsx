"use client";

import React from "react";
import { FiLoader, FiUser } from "react-icons/fi";
import PatientCard from "@/components/ui/PatientCard";
import { Pasien } from "@/lib/types";

interface PatientListProps {
  data: Pasien[];
  loading: boolean;
  baseHref: string;
}

const PatientList: React.FC<PatientListProps> = ({ data, loading, baseHref }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Data Pasien...</p>
      </div>
    );
  }

  if (data.length > 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {data.map((p) => (
          <PatientCard 
            key={p.id} 
            patient={p} 
            href={`${baseHref}/${p.id}`} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white p-20 text-center rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center gap-4">
       <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
          <FiUser size={32} />
       </div>
       <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pasien tidak ditemukan.</p>
    </div>
  );
};

export default PatientList;