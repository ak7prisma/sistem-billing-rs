import React, { useEffect, useState } from "react";
import { FiX, FiPrinter, FiArrowLeft } from "react-icons/fi";
import { Tagihan } from "@/lib/types";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan: Tagihan | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, tagihan }) => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCurrentDate(new Date().toLocaleString("id-ID"));
    }
  }, [isOpen]);

  if (!isOpen || !tagihan) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="no-print p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition flex items-center gap-1 font-bold text-xs"
          >
            <FiArrowLeft /> Tutup
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-violet-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-violet-500/20 flex items-center gap-2"
          >
            <FiPrinter /> Cetak
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 font-mono text-slate-800 bg-white print:p-0 print:overflow-visible">
          <div className="text-center mb-6 border-b-2 border-dashed border-slate-300 pb-4">
            <h2 className="font-bold text-xl uppercase leading-tight tracking-tight">RS Satria Medika</h2>
            <p className="text-[10px] mt-1 text-slate-500 font-sans">Jl. Kesehatan No. 99, Jakarta</p>
          </div>
          
          <div className="text-[11px] mb-6 space-y-1.5 border-b border-dashed border-slate-200 pb-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Tgl:</span>
              <span className="font-bold">{currentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">No:</span>
              <span className="font-bold uppercase">{tagihan.id_tagihan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pas:</span>
              <span className="font-bold uppercase">Budi Santoso</span>
            </div>
          </div>

          <table className="w-full text-[11px] mb-6">
            <thead className="border-b-2 border-dashed border-slate-300">
              <tr>
                <th className="text-left py-2 uppercase tracking-tighter">Item</th>
                <th className="text-right py-2 uppercase tracking-tighter">Rp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-slate-100">
              {tagihan.rincian.map((item) => (
                <tr key={item.id_rincian}>
                  <td className="py-2 text-slate-600 max-w-[150px] break-words">{item.nama_layanan}</td>
                  <td className="text-right py-2 font-bold tracking-tighter text-[12px]">
                    {item.is_covered_bpjs ? (
                      <span className="text-emerald-600 text-[9px] uppercase">BPJS</span>
                    ) : (
                      formatCurrency(item.subtotal)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-dashed border-slate-300 pt-4 mb-8 flex justify-between items-center">
            <span className="font-bold text-xs uppercase">TOTAL</span>
            <span className="text-lg font-black text-slate-900 tracking-tighter">{formatCurrency(tagihan.total_biaya)}</span>
          </div>

          <div className="text-center text-[10px] border-t-2 border-dashed border-slate-300 pt-6">
            <p className="font-bold mb-1 uppercase tracking-widest">Terima Kasih</p>
            <p className="italic text-slate-500 font-sans">Semoga Cepat Sembuh</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body > *:not(.fixed) { display: none !important; }
          .fixed { position: absolute !important; inset: 0 !important; background: white !important; padding: 0 !important; }
          .backdrop-blur-sm, .bg-slate-900\\/60 { display: none !important; }
          .no-print { display: none !important; }
          .relative { box-shadow: none !important; width: 100% !important; max-width: none !important; border: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ReceiptModal;
