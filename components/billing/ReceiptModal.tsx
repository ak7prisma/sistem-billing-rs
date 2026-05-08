import React, { useEffect, useState } from "react";
import { FiX, FiPrinter, FiArrowLeft } from "react-icons/fi";
import { Tagihan, RincianTagihan, Pasien } from "@/lib/types";
import { getRinciTagihanByTagihan, getData } from "@/lib/firebase/firestore";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan: Tagihan | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, tagihan }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [rincian, setRincian] = useState<RincianTagihan[]>([]);
  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tagihan) {
      setCurrentDate(new Date().toLocaleString("id-ID"));
      fetchData();
    }
  }, [isOpen, tagihan]);

  const fetchData = async () => {
    if (!tagihan) return;
    setLoading(true);
    try {
      // Fetch Pasien
      const pData = await getData("pasien", tagihan.pasien_id) as Pasien;
      setPasien(pData);

      // Fetch Rincian
      if (tagihan.rincian && tagihan.rincian.length > 0) {
        setRincian(tagihan.rincian);
      } else {
        const data = await getRinciTagihanByTagihan(tagihan.id_tagihan);
        setRincian(data);
      }
    } catch (err) {
      console.error("Gagal memuat rincian struk:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !tagihan) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div 
      id="receipt-modal-overlay"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <div className="no-print absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div 
        id="receipt-modal-content"
        className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
      >
        <div className="no-print p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition flex items-center gap-1 font-bold text-xs"
          >
            <FiArrowLeft /> Tutup
          </button>
          <button
            onClick={() => window.print()}
            disabled={loading}
            className="bg-violet-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-violet-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiPrinter />
            )}
            {loading ? "Memuat..." : "Cetak"}
          </button>
        </div>

        <div
          id="receipt-content"
          className="flex-1 overflow-y-auto p-8 font-mono text-slate-800 bg-white print:p-0 print:overflow-visible print:max-h-none"
        >
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
              <span className="font-bold uppercase truncate ml-2">{pasien?.nama || "..."}</span>
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
              {loading ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-[9px] text-slate-400 animate-pulse uppercase font-black">Memuat Data...</td>
                </tr>
              ) : rincian.map((item) => (
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

    </div>
  );
};

export default ReceiptModal;
