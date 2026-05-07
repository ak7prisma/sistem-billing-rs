"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import { getTagihanByPasien, getTagihanById } from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";
import InvoiceCard from "@/components/billing/InvoiceCard";
import ActiveInvoiceCard from "@/components/billing/ActiveInvoiceCard";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";
import { Tagihan } from "@/lib/types";

export default function PasienHome() {
  const { user, profile, loading: authLoading } = useAuth();
  const [tagihans, setTagihans] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getTagihanByPasien(user.uid);
      setTagihans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeBill = tagihans.find(t => t.status === "pending");
  const recentHistory = tagihans.filter(t => t.status !== "pending").slice(0, 3);

  const handlePay = async (id: string) => {
    const data = await getTagihanById(id);
    if (data) {
      setSelectedTagihan(data);
      setIsInvoiceModalOpen(true);
    }
  };

  const handleViewDetail = async (id: string) => {
    const data = await getTagihanById(id);
    if (data) {
      setSelectedTagihan(data);
      if (data.status === 'lunas') {
        setIsReceiptModalOpen(true);
      } else {
        setIsInvoiceModalOpen(true);
      }
    }
  };

  if (authLoading || (loading && tagihans.length === 0)) {
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
          Tagihan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500">Aktif</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base">Halo {profile?.nama?.split(' ')[0] || "Pasien"}, selesaikan pembayaran Anda.</p>
      </div>

      {activeBill ? (
        <ActiveInvoiceCard 
          tagihan={activeBill} 
          onPay={() => handlePay(activeBill.id_tagihan)} 
          onViewDetail={handleViewDetail}
        />
      ) : (
        <div className="bg-slate-50 p-12 text-center rounded-2xl border border-dashed border-slate-200">
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada tagihan aktif saat ini.</p>
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
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        </div>
      )}

      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        tagihan={selectedTagihan}
        onSuccess={fetchData}
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
