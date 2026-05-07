"use client";

import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import PatientCard from "@/components/shared/PatientCard";
import { usePasien } from "@/lib/hooks/usePasien";

export default function PasienManager() {
  const [search, setSearch] = useState("");
  const { pasiens, loading } = usePasien();

  const filteredPasien = pasiens.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase()) || 
    p.no_rm.includes(search)
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Data Pasien...</p>
        </div>
      );
    }

    if (filteredPasien.length > 0) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPasien.map((p) => (
            <PatientCard 
              key={p.id} 
              patient={p} 
              href={`/manager/pasien/${p.id}`} 
            />
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white p-20 text-center rounded-[3rem] border border-dashed border-slate-200">
         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pasien tidak ditemukan.</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Database Pasien" 
        subtitle="Kelola data identitas dan histori kunjungan pasien."
        badge="Master Data"
      >
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Cari Nama / RM Pasien..." 
          className="md:min-w-100"
        />
      </PageHeader>

      {renderContent()}
    </div>
  );
}
