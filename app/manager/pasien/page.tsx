"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { usePasien } from "@/lib/hooks/usePasien";

// Manager Components
import PatientList from "@/components/manager/PatientList";

export default function PasienManager() {
  const [search, setSearch] = useState("");
  const { pasiens, loading } = usePasien();

  const filteredPasien = pasiens.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase()) || 
    p.no_rm.includes(search)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      <PatientList 
        data={filteredPasien}
        loading={loading}
        baseHref="/manager/pasien"
      />
    </div>
  );
}
