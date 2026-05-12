import { useState } from "react";
import { Tagihan, RincianTagihan, Pasien } from "@/lib/types";
import { prosesPembayaran } from "@/lib/service/payment";
import { useAuth } from "./useAuth";

export const useInvoiceActions = (
  tagihan: Tagihan | null, 
  rincian: RincianTagihan[], 
  pasien: Pasien | null,
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, profile } = useAuth();

  const handlePayTunai = async () => {
    if (!tagihan) return;
    setIsProcessing(true);
    try {
      // Sertakan informasi kasir dari auth state
      const kasirInfo = user && profile ? { 
        uid: user.uid, 
        nama: profile.nama || user.displayName || "Kasir" 
      } : undefined;

      await prosesPembayaran(tagihan, "tunai", rincian, kasirInfo);
      
      alert("Pembayaran Tunai Berhasil Konfirmasi!");
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error(error);
      alert("Gagal memproses pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleXenditPayment = async () => {
    if (!tagihan || !pasien) return;
    setIsProcessing(true);
    try {
      const totalTagihan = rincian.reduce((sum, r) => sum + r.subtotal, 0);
      const totalCover = rincian.reduce((sum, r) => sum + (r.is_covered_bpjs ? r.subtotal : 0), 0);
      const iurBiaya = totalTagihan - totalCover;

      const response = await fetch("/api/payment/xendit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagihanId: tagihan.id_tagihan,
          amount: iurBiaya,
          customerName: pasien.nama,
          customerEmail: pasien.email || `${pasien.nama.replace(/\s/g, "").toLowerCase()}@hospital.com`,
          // Xendit might need cashier info if we want to track it there too
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
      setIsProcessing(false);
    }
  };

  return { handlePayTunai, handleXenditPayment, isProcessing };
};