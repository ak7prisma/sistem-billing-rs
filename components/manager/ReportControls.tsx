"use client";

import React, { useState } from "react";
import { FiCalendar, FiFilter } from "react-icons/fi";
import SearchBar from "@/components/ui/SearchBar";

interface ReportControlsProps {
  search: string;
  setSearch: (value: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  selectedPoli: string;
  setSelectedPoli: (poli: string) => void;
  departments: string[];
}

const ReportControls: React.FC<ReportControlsProps> = ({
  search,
  setSearch,
  timeRange,
  setTimeRange,
  selectedPoli,
  setSelectedPoli,
  departments,
}) => {
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isPoliOpen, setIsPoliOpen] = useState(false);

  const closeAll = () => { setIsRangeOpen(false); setIsPoliOpen(false); };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50/50 p-2 rounded-3xl border border-slate-100">
      <div className="flex-1 w-full">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari Invoice ID atau Poli..."
          className="w-full bg-white shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Time Range */}
        <div className="relative flex-1 md:flex-none">
          <button
            onClick={() => { setIsRangeOpen(!isRangeOpen); setIsPoliOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-3 h-[46px] rounded-2xl text-[10px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition uppercase tracking-widest whitespace-nowrap"
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
                    className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 ${timeRange === range ? "text-blue-600 bg-blue-50" : "text-slate-500"}`}
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
            onClick={() => { setIsPoliOpen(!isPoliOpen); setIsRangeOpen(false); }}
            className={`p-3 h-[46px] rounded-2xl shadow-lg transition active:scale-95 flex items-center gap-2 min-w-[46px] max-w-[200px] ${selectedPoli !== "Semua Poli" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
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
                <div className="max-h-60 overflow-y-auto py-1">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => { setSelectedPoli(dept); closeAll(); }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 ${selectedPoli === dept ? "text-blue-600 bg-blue-50" : "text-slate-500"}`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportControls;