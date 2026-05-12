"use client";

import React, { useState } from "react";
import { FiDownload, FiShield, FiTrendingUp } from "react-icons/fi";
import PageHeader from "@/components/ui/PageHeader";
import { useFinancialData } from "@/lib/hooks/useFinancialData";
import { formatRupiah } from "@/lib/utils/currency";
import TransactionTable from "@/components/manager/TransactionTable";
import TransactionDetailModal from "@/components/manager/TransactionDetailModal";
import Pagination from "@/components/ui/Pagination";
import { Tagihan } from "@/lib/types";

interface JenisReportViewProps {
  jenis: "obat" | "medis" | "laboratorium";
  title: string;
  subtitle: string;
  icon: any;
  color: string;
}

const JenisReportView: React.FC<JenisReportViewProps> = ({ jenis, title, subtitle, icon: Icon, color }) => {
  const [timeRange, setTimeRange] = useState("Semua Waktu");
  const [selectedPoli, setSelectedPoli] = useState("Semua Poli");
  const [search, setSearch] = useState("");
  
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Stats filtered by hook (will only include 'lunas' status now)
  const { stats, filteredTagihans, pembayaranMap, loading, allDepartments } = useFinancialData(timeRange, selectedPoli);

  // Filter tagihans that have items of this 'jenis'
  const dataThisJenis = filteredTagihans.filter(t => 
    (t.rincian || []).some(r => r.jenis === jenis)
  ).filter(t => {
    if (!search) return true;
    return t.id_tagihan.toLowerCase().includes(search.toLowerCase()) || 
           (t.poli || "").toLowerCase().includes(search.toLowerCase());
  });

  // Calculate stats specifically for this jenis (Paid only)
  let jenisTotalRevenue = 0;
  let jenisTotalBpjs = 0;
  
  dataThisJenis.filter(t => t.status === "lunas").forEach(t => {
    (t.rincian || []).forEach(r => {
      if (r.jenis === jenis) {
        if (r.is_covered_bpjs) jenisTotalBpjs += r.subtotal || 0;
        else jenisTotalRevenue += r.subtotal || 0;
      }
    });
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(dataThisJenis.length / itemsPerPage);
  const currentItems = dataThisJenis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewDetail = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title={title}
        subtitle={subtitle}
        badge="Audit Per Bagian"
      >
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 h-[46px] rounded-2xl text-[10px] font-black shadow-lg hover:bg-slate-800 transition uppercase tracking-[0.2em] active:scale-95"
        >
          <FiDownload />
          <span>Export {title}</span>
        </button>
      </PageHeader>

      {/* Summary Cards with Real Distribution Split (Lunas Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
                <FiTrendingUp size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pemasukan Mandiri ({title})</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{formatRupiah(jenisTotalRevenue)}</h3>
            </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg">
                <FiShield size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cover BPJS ({title})</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{formatRupiah(jenisTotalBpjs)}</h3>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-100 flex flex-col">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daftar Audit {title}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Audit ini hanya menghitung data transaksi dengan status Lunas.</p>
            </div>
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    placeholder="Cari ID Invoice..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
            </div>
        </div>
        <TransactionTable
          data={currentItems}
          pembayaranMap={pembayaranMap}
          loading={loading}
          onViewDetail={handleViewDetail}
          filterJenis={jenis}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={dataThisJenis.length}
          itemsPerPage={itemsPerPage}
          itemName="transaksi"
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal is now also filtered by the same 'jenis' */}
      <TransactionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        tagihan={selectedTagihan}
        filterJenis={jenis}
      />
    </div>
  );
};

export default JenisReportView;
