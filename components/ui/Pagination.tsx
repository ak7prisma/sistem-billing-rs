import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemName?: string;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemName = "data",
  onPageChange,
  className = "p-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/30 gap-4"
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={className}>
      <p className="text-xs font-bold text-slate-400 text-center md:text-left">
        Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} {itemName}
      </p>
      <div className="flex gap-2 w-full md:w-auto">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          Sebelumnya
        </button>
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
