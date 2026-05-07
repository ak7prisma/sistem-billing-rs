import { useState, useEffect } from "react";
import { getAllPembayaran, getAllTagihan } from "@/lib/firebase/firestore";
import { Pembayaran, Tagihan } from "@/lib/types";

export const useFinancialData = () => {
  const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
  const [tagihans, setTagihans] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payData, tagData] = await Promise.all([
        getAllPembayaran(),
        getAllTagihan()
      ]);
      setPembayarans(payData);
      setTagihans(tagData);
    } catch (err) {
      setError("Gagal mengambil data keuangan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Aggregated Stats
  const totalRevenue = pembayarans.reduce((sum, p) => sum + (p.jumlah_pembayaran || 0), 0);
  const totalClaims = pembayarans.reduce((sum, p) => sum + (p.cover_bpjs || 0), 0);
  const totalTransactions = pembayarans.length;
  const totalKunjungan = tagihans.length;

  // Chart Data Preparation
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const revenueByDay = days.map((day, idx) => {
    const total = pembayarans
      .filter(p => {
        const d = p.tanggal_pembayaran?.seconds ? new Date(p.tanggal_pembayaran.seconds * 1000) : new Date();
        return d.getDay() === idx;
      })
      .reduce((sum, p) => sum + (p.jumlah_pembayaran || 0), 0);
    return { name: day, total };
  });

  const sortedRevenue = [...revenueByDay.slice(1), revenueByDay[0]];

  const poliCounts: Record<string, number> = {};
  tagihans.forEach(t => {
    const p = t.poli || "Umum";
    poliCounts[p] = (poliCounts[p] || 0) + 1;
  });
  const dataPoli = Object.entries(poliCounts).map(([name, count]) => ({ name, count }));

  return {
    stats: {
      totalRevenue,
      totalClaims,
      totalTransactions,
      totalKunjungan
    },
    charts: {
      revenueTrend: sortedRevenue,
      departmentShare: dataPoli
    },
    loading,
    error,
    refresh: fetchData
  };
};
