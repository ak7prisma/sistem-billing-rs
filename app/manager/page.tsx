"use client";

import React, { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { useFinancialData } from "@/lib/hooks/useFinancialData";
import { generateFinancialReport } from "@/lib/utils/pdf";

// Manager Components
import ManagerFilters from "@/components/manager/ManagerFilters";
import StatGrid from "@/components/manager/StatGrid";
import { AnalyticsCharts } from "@/components/manager/AnalyticsCharts";
import ExportCard from "@/components/manager/ExportCard";

export default function ManagerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [timeRange, setTimeRange] = useState("7 Hari Terakhir");
  const [selectedPoli, setSelectedPoli] = useState("Semua Poli");

  const { stats, charts, allDepartments, loading } = useFinancialData(timeRange, selectedPoli);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      generateFinancialReport(stats, charts, timeRange, selectedPoli);
    } catch (error) {
      console.error("Export Error:", error);
      alert("Gagal mengexport laporan.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
          Menganalisa Data Keuangan...
        </p>
      </div>
    );
  }

  const departments = ["Semua Poli", ...allDepartments];

  return (
    <div className="space-y-10 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header & Filters */}
      <ManagerFilters 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        selectedPoli={selectedPoli}
        setSelectedPoli={setSelectedPoli}
        departments={departments}
      />

      {/* 2. Key Statistics Grid */}
      <StatGrid stats={stats} />

      {/* 3. Analytics & Data Visualizations */}
      <AnalyticsCharts charts={charts} />

      {/* 4. Action Card: Export Report */}
      <ExportCard 
        onExport={handleExport} 
        isExporting={isExporting} 
      />
    </div>
  );
}
