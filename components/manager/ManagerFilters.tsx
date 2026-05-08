"use client";

import React, { useState } from "react";
import { FiCalendar, FiFilter } from "react-icons/fi";
import PageHeader from "@/components/ui/PageHeader";

interface ManagerFiltersProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  selectedPoli: string;
  setSelectedPoli: (poli: string) => void;
  departments: string[];
}

const ManagerFilters: React.FC<ManagerFiltersProps> = ({ 
  timeRange, 
  setTimeRange, 
  selectedPoli, 
  setSelectedPoli, 
  departments 
}) => {
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <PageHeader 
      title="Financial Analytics" 
      subtitle="Laporan performa keuangan rumah sakit real-time."
      badge="Live"
    >
      <div className="relative">
        <button 
          onClick={() => {
            setIsRangeDropdownOpen(!isRangeDropdownOpen);
            setIsFilterOpen(false);
          }}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition uppercase tracking-widest whitespace-nowrap"
        >
          <FiCalendar /> {timeRange}
        </button>
        
        {isRangeDropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsRangeDropdownOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
              {["7 Hari Terakhir", "30 Hari Terakhir", "Semua Waktu"].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setTimeRange(range);
                    setIsRangeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${
                    timeRange === range ? "text-violet-600 bg-violet-50" : "text-slate-500"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="relative">
        <button 
          onClick={() => {
            setIsFilterOpen(!isFilterOpen);
            setIsRangeDropdownOpen(false);
          }}
          className={`p-2.5 h-[38px] rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2 max-w-[180px] ${
            isFilterOpen || selectedPoli !== "Semua Poli" 
            ? "bg-violet-600 text-white shadow-violet-500/20" 
            : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800"
          }`}
        >
          <FiFilter size={18} className="shrink-0" />
          {selectedPoli !== "Semua Poli" && (
            <span className="text-[9px] font-black uppercase truncate">{selectedPoli}</span>
          )}
        </button>

        {isFilterOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter Departemen</p>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedPoli(dept);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${
                      selectedPoli === dept ? "text-violet-600 bg-violet-50" : "text-slate-500"
                    }`}
                  >
                    {dept}
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
