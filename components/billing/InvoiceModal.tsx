import React, { useState, useEffect } from "react";
import { FiX, FiActivity, FiCreditCard, FiPrinter, FiShield, FiLoader, FiUser } from "react-icons/fi";
import { Tagihan, RincianTagihan, Pasien } from "@/lib/types";
import { prosesPembayaran } from "@/lib/service/payment";
import { getRinciTagihanByTagihan, getData } from "@/lib/firebase/firestore";
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
  const [rincian, setRincian] = useState<RincianTagihan[]>([]);
  const [loadingRincian, setLoadingRincian] = useState(false);
  const [pasien, setPasien] = useState<Pasien | null>(null);

  useEffect(() => {
    if (!isOpen || !tagihan) return;

    const fetchData = async () => {
      setLoadingRincian(true);
      try {
        const pData = await getData("pasien", tagihan.pasien_id) as Pasien;
        setPasien(pData);

        if (tagihan.rincian && tagihan.rincian.length > 0) {
          setRincian(tagihan.rincian);
        } else {
          const data = await getRinciTagihanByTagihan(tagihan.id_tagihan);
          setRincian(data);
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoadingRincian(false);
      }
    };

    fetchData();
  }, [isOpen, tagihan]);

  if (!isOpen || !tagihan) return null;

  const handlePay = async (metode: "tunai" | "qris" | "transfer") => {
    setLoading(true);
    try {
      await prosesPembayaran(tagihan, metode, rincian);
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

  const tipePenjamin = (pasien?.tipe_penjamin?.toLowerCase() === "bpjs") ? "bpjs" : "umum";

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
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                <FiUser size={24} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Pasien</p>
                <h3 className="text-lg font-bold text-slate-800">{pasien?.nama || "Loading..."}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {pasien?.no_rm || "-"} • <span className={tipePenjamin === "bpjs" ? "text-emerald-600" : "text-slate-600"}>
                    {tipePenjamin === "bpjs" ? "BPJS Kesehatan" : "Pasien Umum (Mandiri)"}
                  </span>
                </p>
              </div>
            </div>
            <div className="space-y-1 md:text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layanan</p>
              <h3 className="text-lg font-bold text-slate-800">{tagihan.poli}</h3>
              <p className="text-xs text-slate-500">{tagihan.tanggal}</p>
            </div>
          </div>

          <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm min-h-[100px]">
            {loadingRincian ? (
              <div className="flex items-center justify-center p-8 gap-3 text-slate-400">
                <FiLoader className="animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">Memuat Rincian...</span>
              </div>
            ) : (
              <BillingBreakdown rincian={rincian} tipePenjamin={tipePenjamin} />
            )}
          </div>
        </div>


        {tagihan.status === "pending" && role === "kasir" && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Metode Pembayaran</p>
              <p className="text-sm font-bold text-slate-700">Pembayaran Tunai (Cash)</p>
              <p className="text-[10px] text-slate-400 mt-0.5">QRIS &amp; Transfer diproses otomatis oleh payment service.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button 
                onClick={async () => {
                  if (confirm("Batalkan tagihan ini?")) {
                    setLoading(true);
                    try {
                      const { updateTagihanStatus } = await import("@/lib/firebase/firestore");
                      await updateTagihanStatus(tagihan.id_tagihan, "gagal");
                      onSuccess?.();
                      onClose();
                    } catch (e) {
                      alert("Gagal membatalkan tagihan.");
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
                disabled={loading}
                className="shrink-0 flex items-center justify-center gap-3 bg-white border border-slate-200 text-rose-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all disabled:opacity-50"
              >
                Batalkan
              </button>
              <button 
                onClick={() => handlePay("tunai")}
                disabled={loading}
                className="shrink-0 flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 active:scale-95"
              >
                {loading 
                  ? <><FiLoader className="animate-spin" /> Memproses...</>
                  : <><FiCreditCard /> Konfirmasi Bayar</>
                }
              </button>
            </div>
          </div>
        )}


        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            {(() => {
              const totalTagihan = rincian.reduce((sum, r) => sum + r.subtotal, 0);
              const totalCover = rincian.reduce((sum, r) => sum + (r.is_covered_bpjs ? r.subtotal : 0), 0);
              const iurBiaya = totalTagihan - totalCover;
              return (
                <>
                  {totalCover > 0 && (
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ditanggung BPJS</p>
                      <p className="text-sm font-black text-emerald-500">- {formatCurrency(totalCover)}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Iur Biaya Pasien</p>
                    <div className="text-3xl font-black text-violet-600 tracking-tighter">
                      {formatCurrency(loadingRincian ? (tagihan.total_biaya ?? 0) : iurBiaya)}
                    </div>
                  </div>
                </>
              );
            })()}
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
