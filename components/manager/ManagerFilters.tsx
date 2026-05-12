"use client";

import React, { useState } from "react";
import { FiCalendar, FiFilter, FiGrid } from "react-icons/fi";
import PageHeader from "@/components/ui/PageHeader";

const JENIS_OPTIONS = [
  { label: "Semua Layanan", value: "semua" },
  { label: "Obat", value: "obat" },
  { label: "Tindakan Medis", value: "medis" },
  { label: "Layanan Labor", value: "laboratorium" },
];

interface ManagerFiltersProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  selectedPoli: string;
  setSelectedPoli: (poli: string) => void;
  departments: string[];
  selectedJenis: string;
  setSelectedJenis: (jenis: string) => void;
}

const ManagerFilters: React.FC<ManagerFiltersProps> = ({
  timeRange,
  setTimeRange,
  selectedPoli,
  setSelectedPoli,
  departments,
  selectedJenis,
  setSelectedJenis,
}) => {
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isPoliOpen, setIsPoliOpen] = useState(false);
  const [isJenisOpen, setIsJenisOpen] = useState(false);

  const closeAll = () => {
    setIsRangeOpen(false);
    setIsPoliOpen(false);
    setIsJenisOpen(false);
  };

  const activeJenis = JENIS_OPTIONS.find(j => j.value === selectedJenis)?.label ?? "Semua";

  return (
    <PageHeader
      title="Financial Analytics"
      subtitle="Laporan performa keuangan rumah sakit real-time."
      badge="Live"
    >
      {/* Time Range */}
      <div className="relative">
        <button
          onClick={() => { setIsRangeOpen(!isRangeOpen); closeAll(); setIsRangeOpen(true); }}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition uppercase tracking-widest whitespace-nowrap"
        >
          <FiCalendar /> {timeRange}
        </button>
        {isRangeOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeAll} />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
              {["7 Hari Terakhir", "30 Hari Terakhir", "Semua Waktu"].map((range) => (
                <button
                  key={range}
                  onClick={() => { setTimeRange(range); closeAll(); }}
                  className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${timeRange === range ? "text-violet-600 bg-violet-50" : "text-slate-500"}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Poli Filter */}
      <div className="relative">
        <button
          onClick={() => { setIsPoliOpen(!isPoliOpen); closeAll(); setIsPoliOpen(true); }}
          className={`p-2.5 h-[38px] rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2 max-w-[180px] ${
            selectedPoli !== "Semua Poli"
              ? "bg-violet-600 text-white shadow-violet-500/20"
              : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800"
          }`}
        >
          <FiFilter size={16} className="shrink-0" />
          {selectedPoli !== "Semua Poli" && (
            <span className="text-[9px] font-black uppercase truncate">{selectedPoli}</span>
          )}
        </button>
        {isPoliOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeAll} />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter Departemen</p>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => { setSelectedPoli(dept); closeAll(); }}
                    className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${selectedPoli === dept ? "text-violet-600 bg-violet-50" : "text-slate-500"}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Jenis Layanan Filter */}
      <div className="relative">
        <button
          onClick={() => { setIsJenisOpen(!isJenisOpen); closeAll(); setIsJenisOpen(true); }}
          className={`p-2.5 h-[38px] rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2 max-w-[200px] ${
            selectedJenis !== "semua"
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-slate-700 text-white shadow-slate-900/10 hover:bg-slate-600"
          }`}
        >
          <FiGrid size={16} className="shrink-0" />
          {selectedJenis !== "semua" && (
            <span className="text-[9px] font-black uppercase truncate">{activeJenis}</span>
          )}
        </button>
        {isJenisOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeAll} />
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter Jenis Layanan</p>
              </div>
              <div className="py-1">
                {JENIS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSelectedJenis(opt.value); closeAll(); }}
                    className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${selectedJenis === opt.value ? "text-emerald-600 bg-emerald-50" : "text-slate-500"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageHeader>
  );
};

export default ManagerFilters;