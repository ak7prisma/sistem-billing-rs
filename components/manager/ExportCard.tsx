"use client";

import React from "react";
import { FiFileText, FiLoader } from "react-icons/fi";

interface ExportCardProps {
  onExport: () => void;
  isExporting: boolean;
}

const ExportCard: React.FC<ExportCardProps> = ({ onExport, isExporting }) => {
  return (
    <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
      <div className="relative z-10 space-y-5 md:max-w-md">
        <h3 className="text-3xl font-black leading-none uppercase tracking-tighter">Export <br/>Financial Data</h3>
        <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-widest opacity-80">Download rekapitulasi data keuangan dalam format PDF atau Excel secara instan untuk kebutuhan audit.</p>
        <button 
          onClick={onExport}
          disabled={isExporting}
          className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {isExporting ? <><FiLoader className="animate-spin" /> Exporting...</> : "Download Report Now"}
        </button>
      </div>
      <FiFileText className="absolute -right-10 -bottom-10 text-white/5 w-80 h-80 transform rotate-12" />
    </div>
  );
};

export default ExportCard;
