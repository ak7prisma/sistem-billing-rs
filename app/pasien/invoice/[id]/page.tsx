"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft, FiActivity, FiCreditCard, FiLoader } from "react-icons/fi";
import { useTagihanDetail } from "@/lib/hooks/useTagihan";
import { usePasienDetail } from "@/lib/hooks/usePasien";
import BillingBreakdown from "@/components/billing/BillingBreakdown";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatRupiah } from "@/lib/utils/currency";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [isPaying, setIsPaying] = useState(false);
  
  const { tagihan, loading: loadingTagihan } = useTagihanDetail(id);
  const { pasien, loading: loadingPasien } = usePasienDetail(tagihan?.pasien_id || "");

  const handlePayment = async () => {
    if (!tagihan || !pasien) return;
    
    setIsPaying(true);
    try {
      const response = await fetch("/api/payment/xendit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagihanId: tagihan.id_tagihan,
          amount: tagihan.total_biaya,
          customerName: pasien.nama,
          customerEmail: pasien.email || `${pasien.nama.replace(/\s/g, "").toLowerCase()}@hospital.com`,
        }),
      });

      const data = await response.json();
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        alert("Gagal membuat invoice pembayaran: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat memproses pembayaran.");
    } finally {
      setIsPaying(false);
    }
  };

  if (loadingTagihan || loadingPasien) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-violet-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menyiapkan Tagihan...</p>
      </div>
    );
  }

  if (!tagihan) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Tagihan tidak ditemukan</h2>
        <p className="text-slate-500 mb-6">Maaf, data invoice yang Anda cari tidak tersedia.</p>
        <Link href="/pasien" className="text-violet-600 font-black text-[10px] uppercase tracking-widest hover:underline">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-violet-600 font-black transition text-[10px] uppercase tracking-widest"
      >
        <FiArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-6 md:p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-linear-to-tr from-emerald-500 to-violet-600 rounded-[1.5rem] flex items-center justify-center shadow-xl transform -rotate-6">
                <FiActivity className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Rincian <span className="text-violet-600">Layanan</span></h1>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">#{tagihan.id_tagihan.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={tagihan.status} />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {tagihan.tanggal?.seconds ? new Date(tagihan.tanggal.seconds * 1000).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Informasi Pasien</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{pasien?.nama || "Pasien"}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No. RM: {pasien?.no_rm || "N/A"}</p>
            </div>
            <div className="space-y-2 md:text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Poli / Layanan</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{tagihan.poli}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Penjamin: {pasien?.tipe_penjamin.toUpperCase() || "UMUM"}</p>
            </div>
          </div>
        </div>

        <div className="p-0">
          <BillingBreakdown rincian={tagihan.rincian} tipePenjamin={pasien?.tipe_penjamin || "umum"} />
        </div>

        <div className="p-8 md:p-12 bg-slate-900 text-white border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-slate-400 text-xs font-medium leading-relaxed max-w-sm">
              <p className="uppercase tracking-widest font-black text-[9px] mb-2 text-slate-500">Security Note</p>
              <p>Pembayaran akan diproses secara aman melalui gateway **Xendit**. Pastikan data tagihan sudah sesuai sebelum melanjutkan.</p>
            </div>
            <div className="text-center md:text-right w-full md:w-auto space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total yang harus dibayar</p>
                <h2 className="text-5xl font-black text-white tracking-tighter">
                  {formatRupiah(tagihan.total_biaya)}
                </h2>
              </div>
              
              {tagihan.status === "pending" && (
                <button
                  onClick={handlePayment}
                  disabled={isPaying}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-white text-slate-900 px-12 py-5 rounded-[1.5rem] font-black shadow-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                >
                  {isPaying ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiCreditCard className="w-5 h-5" />}
                  {isPaying ? "Memproses..." : "Bayar Sekarang"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
