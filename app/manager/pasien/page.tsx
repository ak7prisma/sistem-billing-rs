"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { usePasien } from "@/lib/hooks/usePasien";

// Manager Components
import PatientList from "@/components/manager/PatientList";
import Pagination from "@/components/ui/Pagination";

export default function PasienManager() {
  const [search, setSearch] = useState("");
  const { pasiens, loading } = usePasien();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page on search
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredPasien = pasiens.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase()) || 
    p.no_rm.includes(search)
  );

  const totalPages = Math.ceil(filteredPasien.length / itemsPerPage);
  const currentItems = filteredPasien.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
        <PatientList 
          data={currentItems}
          loading={loading}
          baseHref="/manager/pasien"
        />
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPasien.length}
          itemsPerPage={itemsPerPage}
          itemName="pasien"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}