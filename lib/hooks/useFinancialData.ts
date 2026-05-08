import { useState, useEffect } from "react";
import { getAllPembayaran, getAllTagihan } from "@/lib/firebase/firestore";
import { Pembayaran, Tagihan } from "@/lib/types";

export const useFinancialData = (timeRange: string = "7 Hari Terakhir", selectedPoli: string = "Semua Poli") => {
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

  // Filter Data
  const filteredTagihans = tagihans.filter(t => {
    const matchesPoli = selectedPoli === "Semua Poli" || t.poli === selectedPoli;
    
    // Time filtering
    if (!matchesPoli) return false;
    
    const date = t.tanggal?.seconds ? new Date(t.tanggal.seconds * 1000) : new Date(t.tanggal);
    const now = new Date();
    if (timeRange === "7 Hari Terakhir") {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      return date >= sevenDaysAgo;
    }
    if (timeRange === "30 Hari Terakhir") {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      return date >= thirtyDaysAgo;
    }
    return true;
  });

  const filteredPembayarans = pembayarans.filter(p => {
    const associatedTagihan = tagihans.find(t => t.id_tagihan === p.tagihan_id);
    const matchesPoli = selectedPoli === "Semua Poli" || associatedTagihan?.poli === selectedPoli;
    
    if (!matchesPoli) return false;

    const date = p.tanggal_pembayaran?.seconds ? new Date(p.tanggal_pembayaran.seconds * 1000) : new Date();
    const now = new Date();
    if (timeRange === "7 Hari Terakhir") {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      return date >= sevenDaysAgo;
    }
    if (timeRange === "30 Hari Terakhir") {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      return date >= thirtyDaysAgo;
    }
    return true;
  });

  // Aggregated Stats
  const totalRevenue = filteredPembayarans.reduce((sum, p) => sum + (p.iur_biaya || 0), 0);
  const totalClaims = filteredPembayarans.reduce((sum, p) => sum + (p.cover_bpjs || 0), 0);
  const totalTransactions = filteredPembayarans.length;
  const totalKunjungan = filteredTagihans.length;

  // Chart Data Preparation
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const revenueByDay = days.map((day, idx) => {
    const total = filteredPembayarans
      .filter(p => {
        const d = p.tanggal_pembayaran?.seconds ? new Date(p.tanggal_pembayaran.seconds * 1000) : new Date();
        return d.getDay() === idx;
      })
      .reduce((sum, p) => sum + (p.iur_biaya || 0), 0);
    return { name: day, total };
  });

  const sortedRevenue = [...revenueByDay.slice(1), revenueByDay[0]];

  // Insurance Share (BPJS vs Non-BPJS)
  const insuranceShare = [
    { name: "BPJS", value: totalClaims },
    { name: "Mandiri", value: totalRevenue }
  ];

  // Transaction Status Share
  const statusCounts: Record<string, number> = { pending: 0, lunas: 0, gagal: 0 };
  filteredTagihans.forEach(t => {
    const s = t.status || "pending";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });
  const statusShare = [
    { name: "Pending", count: statusCounts.pending, color: "#f59e0b" },
    { name: "Berhasil", count: statusCounts.lunas, color: "#10b981" },
    { name: "Gagal", count: statusCounts.gagal, color: "#ef4444" }
  ];

  // Department Distribution Data
  const poliCounts: Record<string, number> = {};
  filteredTagihans.forEach(t => {
    const p = t.poli || "Umum";
    poliCounts[p] = (poliCounts[p] || 0) + 1;
  });
  const dataPoli = Object.entries(poliCounts).map(([name, count]) => ({ name, count }));

  // Get ALL unique departments for filtering
  const allDepartments = Array.from(new Set(tagihans.map(t => t.poli || "Umum")));

  return {
    stats: {
      totalRevenue,
      totalClaims,
      totalTransactions,
      totalKunjungan
    },
    charts: {
      revenueTrend: sortedRevenue,
      departmentShare: dataPoli,
      insuranceShare,
      statusShare
    },
    allDepartments,
    loading,
    error,
    refresh: fetchData
  };
};
