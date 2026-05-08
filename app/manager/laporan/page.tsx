"use client";

import React, { useState } from "react";
import { FiDownload, FiLoader } from "react-icons/fi";
import PageHeader from "@/components/ui/PageHeader";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";
import { useFinancialData } from "@/lib/hooks/useFinancialData";
import { generateFinancialReport } from "@/lib/utils/pdf";

// Manager Components
import ReportControls from "@/components/manager/ReportControls";
import TransactionTable from "@/components/manager/TransactionTable";

export default function LaporanManager() {
  const [search, setSearch] = useState("");
  const [timeRange, setTimeRange] = useState("Semua Waktu");
  const [selectedPoli, setSelectedPoli] = useState("Semua Poli");
  const [isExporting, setIsExporting] = useState(false);
  
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { stats, charts, allDepartments, filteredTagihans, loading } = useFinancialData(timeRange, selectedPoli);

  const departments = ["Semua Poli", ...allDepartments];

  const searchFilteredData = filteredTagihans.filter(item => 
    (item.poli || "").toLowerCase().includes(search.toLowerCase()) || 
    item.id_tagihan.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewReceipt = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan);
    setIsReceiptModalOpen(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      generateFinancialReport(stats, charts, timeRange, selectedPoli);
    } catch (error) {
      console.error(error);
      alert("Gagal mengexport laporan.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header with Title & Export Action */}
      <PageHeader 
        title="Laporan Transaksi" 
        subtitle="Audit dan rekapitulasi data pembayaran pasien."
        badge="Audit Mode"
      >
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 h-[46px] rounded-2xl text-[10px] font-black shadow-lg hover:bg-slate-800 transition uppercase tracking-[0.2em] disabled:opacity-50 whitespace-nowrap active:scale-95"
        >
          {isExporting ? <FiLoader className="animate-spin" /> : <FiDownload />}
          <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
        </button>
      </PageHeader>

      {/* 2. Unified Search & Filter Controls */}
      <ReportControls 
        search={search}
        setSearch={setSearch}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        selectedPoli={selectedPoli}
        setSelectedPoli={setSelectedPoli}
        departments={departments}
      />

      {/* 3. Transaction Data Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-100 flex flex-col">
        <TransactionTable 
          data={searchFilteredData}
          loading={loading}
          onViewDetail={handleViewReceipt}
        />
      </div>

      {/* Detail Modal */}
      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        tagihan={selectedTagihan}
      />
    </div>
  );
}
