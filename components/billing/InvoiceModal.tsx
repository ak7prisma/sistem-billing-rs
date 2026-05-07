import React, { useState } from "react";
import { FiX, FiActivity, FiCreditCard, FiPrinter, FiShield, FiLoader } from "react-icons/fi";
import { Tagihan } from "@/lib/types";
import { prosesPembayaran } from "@/lib/service/payment";
import BillingBreakdown from "./BillingBreakdown";
import StatusBadge from "../ui/StatusBadge";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan: Tagihan | null;
  onSuccess?: () => void;
  role: "pasien" | "kasir";
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, tagihan, onSuccess, role }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !tagihan) return null;

  const handlePay = async (metode: "tunai" | "qris" | "transfer") => {
    setLoading(true);
    try {
      await prosesPembayaran(tagihan, metode);
      alert("Pembayaran Berhasil!");
      onSuccess?.();
      onClose();
    } catch (error) {
      alert("Gagal memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FiActivity className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Rincian <span className="text-violet-600">Invoice</span></h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tagihan.id_tagihan}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasien</p>
              <h3 className="text-lg font-bold text-slate-800">Budi Santoso</h3>
              <p className="text-xs text-slate-500">RM: 00-12-34-56 • BPJS Kesehatan</p>
            </div>
            <div className="space-y-1 md:text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layanan</p>
              <h3 className="text-lg font-bold text-slate-800">{tagihan.poli}</h3>
              <p className="text-xs text-slate-500">{tagihan.tanggal}</p>
            </div>
          </div>

          <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <BillingBreakdown rincian={tagihan.rincian} tipePenjamin="bpjs" />
          </div>
        </div>

        {tagihan.status === "pending" && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => handlePay("tunai")}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-800 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition shadow-sm disabled:opacity-50"
            >
              {loading ? <FiLoader className="animate-spin" /> : <><FiCreditCard /> Bayar Tunai</>}
            </button>
            <button 
              onClick={() => handlePay("qris")}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? <FiLoader className="animate-spin" /> : <><FiActivity /> Bayar QRIS</>}
            </button>
            <button 
              onClick={() => handlePay("transfer")}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-xl shadow-slate-900/20 disabled:opacity-50"
            >
              {loading ? <FiLoader className="animate-spin" /> : <><FiShield /> Transfer Bank</>}
            </button>
          </div>
        )}

        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Iur Biaya</p>
            <div className="text-3xl font-black text-violet-600 tracking-tighter">
              {formatCurrency(tagihan.total_biaya)}
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-white transition"
            >
              Batal
            </button>
            
            {tagihan.status !== "pending" && (
              <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-slate-700 transition uppercase text-xs tracking-wider">
                <FiPrinter size={18} /> Cetak Struk
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
