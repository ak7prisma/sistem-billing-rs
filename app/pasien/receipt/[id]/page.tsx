"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import { getTagihanById } from "@/lib/service/billing";

export default function ReceiptPage() {
  const params = useParams();
  const id = params.id as string;
  const tagihan = getTagihanById(id);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleString("id-ID"));
  }, []);

  if (!tagihan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Struk tidak tersedia</h2>
          <Link href="/pasien/history" className="text-violet-600 hover:underline mt-4 block font-bold">Kembali ke Riwayat</Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10 flex flex-col items-center gap-6 font-mono">
      <div className="no-print flex flex-col sm:flex-row gap-3 md:gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 w-full max-w-sm sm:max-w-none justify-center font-sans">
        <Link 
          href="/pasien/history" 
          className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition text-center flex items-center justify-center gap-2"
        >
          <FiArrowLeft /> Kembali ke Riwayat
        </Link>
        <button 
          onClick={() => window.print()} 
          className="bg-violet-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-violet-700 transition flex items-center justify-center gap-2"
        >
          <FiPrinter /> Cetak Thermal (Print)
        </button>
      </div>

      <div className="bg-white p-8 w-full max-w-[350px] shadow-2xl print-area border border-slate-200 text-slate-800">
        <div className="text-center mb-6 border-b-2 border-dashed border-slate-300 pb-4">
          <h2 className="font-bold text-2xl uppercase leading-tight tracking-tight">RS Satria Medika</h2>
          <p className="text-[10px] mt-1 text-slate-500 font-sans">Jl. Kesehatan No. 99, Jakarta</p>
        </div>
        
        <div className="text-[11px] mb-6 space-y-1.5 border-b border-dashed border-slate-200 pb-4">
          <div className="flex justify-between">
            <span className="text-slate-400">Tgl:</span>
            <span className="font-bold">{currentDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">No:</span>
            <span className="font-bold uppercase">{tagihan.id}</span>
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
          <span className="font-bold text-sm uppercase">TOTAL BAYAR</span>
          <span className="text-xl font-black text-slate-900 tracking-tighter">{formatCurrency(tagihan.total_biaya)}</span>
        </div>

        <div className="text-center text-[10px] border-t-2 border-dashed border-slate-300 pt-6">
          <p className="font-bold mb-1 uppercase tracking-widest">Terima Kasih</p>
          <p className="italic text-slate-500 font-sans">Semoga Cepat Sembuh</p>
          <div className="mt-6 flex justify-center opacity-10">
             <div className="w-12 h-12 bg-slate-900"></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background-color: white !important; }
          .no-print { display: none !important; }
          .print-area { 
            box-shadow: none !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            border: none !important;
            width: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
}
