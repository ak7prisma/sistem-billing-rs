"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  FiChevronLeft, 
  FiUser, 
  FiMail, 
  FiMapPin,
  FiClock, 
  FiCreditCard, 
  FiLoader,
  FiFileText
} from "react-icons/fi";
import { usePasienDetail } from "@/lib/hooks/usePasien";
import { useTagihanByPasien } from "@/lib/hooks/useTagihan";
import { formatRupiah } from "@/lib/utils/currency";
import StatusBadge from "@/components/ui/StatusBadge";

export default function PasienDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const { pasien, loading: loadingPasien } = usePasienDetail(id as string);
  const { history, loading: loadingHistory } = useTagihanByPasien(id as string);

  if (loadingPasien) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Mengambil Profil Pasien...</p>
      </div>
    );
  }

  if (!pasien) {
    return (
      <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pasien tidak ditemukan.</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Kembali</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition shadow-sm"
        >
          <FiChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Profil Pasien</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Detail identitas & histori kunjungan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-32 bg-linear-to-br from-blue-600 to-indigo-700 relative">
               <div className="absolute -bottom-10 left-8">
                 <div className="w-24 h-24 bg-white rounded-4xl p-1 shadow-xl">
                    <div className="w-full h-full bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-slate-200">
                       <FiUser size={40} />
                    </div>
                 </div>
               </div>
            </div>
            
            <div className="p-8 pt-16 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{pasien.nama}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                    RM: {pasien.no_rm}
                  </span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${pasien.tipe_penjamin === 'bpjs' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {pasien.tipe_penjamin}
                  </span>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-50 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <FiMail size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Email</p>
                    <p className="text-xs font-bold text-slate-600">{pasien.email || "Tidak ada email"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <FiMapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Alamat</p>
                    <p className="text-xs font-bold text-slate-600 line-clamp-2">{pasien.alamat || "Alamat belum diatur"}</p>
                  </div>
                </div>

                {pasien.no_bpjs && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-400">
                      <FiCreditCard size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No. BPJS</p>
                      <p className="text-xs font-bold text-slate-600">{pasien.no_bpjs}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">Histori Kunjungan & Billing</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daftar semua transaksi pasien ini</p>
              </div>
              <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {history.length} Transaksi
              </div>
            </div>

            <div className="space-y-4">
              {loadingHistory && (
                <div className="py-20 flex justify-center">
                  <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
              
              {!loadingHistory && history.length > 0 && (
                history.map((item) => (
                  <div key={item.id_tagihan} className="group p-6 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                        <FiFileText size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{item.id_tagihan}</p>
                        <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">
                          {item.poli || "Umum"}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                          <FiClock size={10} /> 
                          {item.createdAt?.seconds 
                            ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                            : 'Unknown Date'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Total Tagihan</p>
                        <p className="font-black text-slate-800">{formatRupiah(item.total_biaya)}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ))
              )}
              
              {!loadingHistory && history.length === 0 && (
                <div className="text-center py-20">
                   <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Belum ada histori kunjungan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}