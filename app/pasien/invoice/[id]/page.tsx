"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiActivity, FiCreditCard } from "react-icons/fi";
import { getTagihanById } from "@/lib/service/mock";
import BillingBreakdown from "@/components/billing/BillingBreakdown";
import StatusBadge from "@/components/ui/StatusBadge";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const tagihan = getTagihanById(id);

  if (!tagihan) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Tagihan tidak ditemukan</h2>
        <p className="text-slate-500 mb-6">Maaf, data invoice yang Anda cari tidak tersedia.</p>
        <Link href="/pasien" className="text-violet-600 font-bold hover:underline">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 font-bold transition text-sm"
      >
        <FiArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-tr from-emerald-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                <FiActivity className="text-white w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Rincian <span className="text-violet-600">Layanan</span></h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{tagihan.id}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={tagihan.status === 'lunas' && tagihan.total_biaya === 0 ? "BPJS Cover" : tagihan.status} />
              <p className="text-xs text-slate-400 font-medium">{tagihan.tanggal}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Pasien</p>
              <h3 className="text-xl font-bold text-slate-800">Budi Santoso</h3>
              <p className="text-sm text-slate-500">No. RM: 00-12-34-56</p>
            </div>
            <div className="space-y-1 md:text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Poli / Layanan</p>
              <h3 className="text-xl font-bold text-slate-800">{tagihan.poli}</h3>
              <p className="text-sm text-slate-500">Penjamin: BPJS Kesehatan</p>
            </div>
          </div>
        </div>

        <div className="p-0">
          <BillingBreakdown rincian={tagihan.rincian} tipePenjamin="bpjs" />
        </div>

        <div className="p-6 md:p-10 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
              <p>Pastikan data di atas sudah sesuai. Untuk pertanyaan lebih lanjut, silakan hubungi CS melalui menu <strong>About</strong>.</p>
            </div>
            <div className="text-center md:text-right w-full md:w-auto">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Yang Harus Dibayar</p>
              <h2 className="text-4xl font-black text-violet-600 tracking-tight mb-6">
                {formatCurrency(tagihan.total_biaya)}
              </h2>
              {tagihan.status === "pending" && (
                <Link
                  href="/pasien"
                  className="inline-flex items-center gap-3 bg-linear-to-r from-emerald-500 to-violet-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-violet-500/20 hover:scale-105 transition-transform text-sm uppercase tracking-wider"
                >
                  <FiCreditCard className="w-5 h-5" /> Bayar Sekarang
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
