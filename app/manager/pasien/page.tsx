"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiUser, FiActivity, FiMapPin, FiLoader, FiMail, FiCheckCircle, FiChevronLeft, FiCreditCard, FiClock } from "react-icons/fi";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import { getAllPasien } from "@/lib/firebase/firestore";
import { Pasien } from "@/lib/types";

export default function PasienManager() {
  const [search, setSearch] = useState("");
  const [pasiens, setPasiens] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllPasien();
      setPasiens(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPasien = pasiens.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase()) || 
    p.no_rm.includes(search)
  );

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
          className="md:min-w-[400px]"
        />
      </PageHeader>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Data Pasien...</p>
        </div>
      ) : filteredPasien.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPasien.map((p) => (
            <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-center md:items-start group">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner relative">
                <FiUser size={32} />
                {p.email && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-lg shadow-emerald-500/20">
                    <FiCheckCircle size={10} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{p.nama}</h3>
                    <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.tipe_penjamin === 'bpjs' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {p.tipe_penjamin}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-x-4 gap-y-1">
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">RM: {p.no_rm}</p>
                    {p.email && (
                      <p className="text-slate-400 font-bold text-[10px] flex items-center gap-1 justify-center md:justify-start lowercase italic">
                        <FiMail className="text-blue-500" /> {p.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
                      <FiMapPin /> Alamat
                    </p>
                    <p className="text-xs font-bold text-slate-500 line-clamp-1">{p.alamat || "Alamat belum diatur"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
                      <FiActivity /> Akun Portal
                    </p>
                    <p className={`text-xs font-black uppercase ${p.email ? 'text-emerald-500' : 'text-slate-300'}`}>
                      {p.email ? 'Terhubung' : 'Belum Ada'}
                    </p>
                  </div>
                </div>

                <Link 
                  href={`/manager/pasien/${p.id}`}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600 shadow-lg shadow-slate-900/10 active:scale-95 text-center block"
                >
                  Lihat Profil Lengkap
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 text-center rounded-[3rem] border border-dashed border-slate-200">
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pasien tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}
