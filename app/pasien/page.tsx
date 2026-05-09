"use client";

import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { getTagihanById } from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTagihanByPasien } from "@/lib/hooks/useTagihan";
import InvoiceCard from "@/components/billing/InvoiceCard";
import ActiveInvoiceCard from "@/components/billing/ActiveInvoiceCard";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";

export default function PasienHome() {
  const { user, profile, loading: authLoading } = useAuth();
  const { history: tagihans, loading: tagihanLoading, refresh } = useTagihanByPasien(user?.uid || "");
  
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  
  const activeBill = tagihans.find(t => t.status === "pending");
  const recentHistory = tagihans.filter(t => t.status !== "pending").slice(0, 3);

  const handleAction = async (id: string, isPayment: boolean) => {
    const data = await getTagihanById(id);
    if (data) {
      setSelectedTagihan(data);
      if (isPayment || data.status !== 'lunas') {
        setIsInvoiceModalOpen(true);
      } else {
        setIsReceiptModalOpen(true);
      }
    }
  };

  const isLoading = authLoading || (tagihanLoading && tagihans.length === 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Data Pasien...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-slate-800 mb-2">
          Tagihan <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-violet-500">Aktif</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base">Halo {profile?.nama?.split(' ')[0] || "Pasien"}, selesaikan pembayaran Anda.</p>
      </div>

      {activeBill ? (
        <ActiveInvoiceCard 
          tagihan={activeBill} 
          onPay={() => handleAction(activeBill.id_tagihan, true)} 
        />
      ) : (
        <div className="bg-slate-50 p-12 text-center rounded-2xl border border-dashed border-slate-200">
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tidak ada tagihan aktif saat ini.</p>
        </div>
      )}

      {recentHistory.length > 0 && (
        <div className="mt-8 md:mt-12">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-6 border-b border-slate-100 pb-2 uppercase tracking-wide">Riwayat Terakhir</h3>
          <div className="space-y-4">
            {recentHistory.map((tagihan) => (
              <InvoiceCard 
                key={tagihan.id_tagihan} 
                tagihan={tagihan} 
                onViewDetail={() => handleAction(tagihan.id_tagihan, false)}
              />
            ))}
          </div>
        </div>
      )}

      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        tagihan={selectedTagihan}
        onSuccess={refresh}
        role="pasien"
      />

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        tagihan={selectedTagihan}
      />
    </div>
  );
}