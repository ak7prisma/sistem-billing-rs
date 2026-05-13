import { useState, useEffect } from "react";
import { getAllPembayaran, getAllTagihan, getAllData } from "@/lib/firebase/firestore";
import { Pembayaran, Tagihan, RincianTagihan } from "@/lib/types";

export const useFinancialData = (
  timeRange: string = "7 Hari Terakhir",
  selectedPoli: string = "Semua Poli",
  selectedJenis: string = "semua"
) => {
  const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
  const [tagihans, setTagihans] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payData, tagData, rawRinciData] = await Promise.all([
        getAllPembayaran(),
        getAllTagihan(),
        getAllData("rinci_tagihan")
      ]);

      const rinciData = rawRinciData.map(r => ({
        ...r,
        id_rincian: r.id,
      })) as unknown as RincianTagihan[];

      const enrichedTagihans = tagData.map(t => ({
        ...t,
        rincian: rinciData.filter(r => r.id_tagihan === t.id_tagihan)
      }));

      setPembayarans(payData);
      setTagihans(enrichedTagihans);
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

  // ─── Filter Dasar (Poli, Waktu, Jenis) ───────────────────────────────────
  const filteredTagihans = tagihans.filter(t => {
    const matchesPoli = selectedPoli === "Semua Poli" || t.poli === selectedPoli;
    if (!matchesPoli) return false;

    const matchesJenis =
      selectedJenis === "semua" ||
      (t.rincian || []).some(r => r.jenis === selectedJenis);
    if (!matchesJenis) return false;

    // Fix Date Parsing
    let date: Date;
    if (t.tanggal?.seconds) {
      date = new Date(t.tanggal.seconds * 1000);
    } else if (t.tanggal instanceof Date) {
      date = t.tanggal;
    } else if (typeof t.tanggal === "string") {
      date = new Date(t.tanggal);
    } else {
      date = new Date();
    }

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

    let date: Date;
    if (p.tanggal_pembayaran?.seconds) {
      date = new Date(p.tanggal_pembayaran.seconds * 1000);
    } else if (p.tanggal_pembayaran instanceof Date) {
      date = p.tanggal_pembayaran;
    } else if (typeof p.tanggal_pembayaran === "string") {
      date = new Date(p.tanggal_pembayaran);
    } else {
      date = new Date();
    }

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

  const pembayaranMap: Record<string, Pembayaran> = {};
  filteredPembayarans.forEach(p => {
    pembayaranMap[p.tagihan_id] = p;
  });

  // ─── Financial Stats (Hanya yang LUNAS) ──────────────────────────────────
  const successfulPembayarans = filteredPembayarans.filter(p => {
    const associatedTagihan = tagihans.find(t => t.id_tagihan === p.tagihan_id);
    return associatedTagihan?.status === "lunas";
  });

  const totalRevenue = successfulPembayarans.reduce((sum, p) => sum + (p.iur_biaya || 0), 0);
  const totalClaims = successfulPembayarans.reduce((sum, p) => sum + (p.cover_bpjs || 0), 0);
  const totalTransactions = successfulPembayarans.length;
  const totalKunjungan = filteredTagihans.filter(t => t.status === "lunas").length;

  // ─── Per-jenis breakdown (Hanya yang LUNAS) ─────────────────────────────
  let totalBiayaObat = 0;
  let totalBiayaObatBpjs = 0;
  let totalBiayaMedis = 0;
  let totalBiayaMedisBpjs = 0;
  let totalBiayaLabor = 0;
  let totalBiayaLaborBpjs = 0;

  filteredTagihans.filter(t => t.status === "lunas").forEach(t => {
    (t.rincian || []).forEach(r => {
      if (r.jenis === "obat") {
        totalBiayaObat += r.subtotal || 0;
        if (r.is_covered_bpjs) totalBiayaObatBpjs += r.subtotal || 0;
      } else if (r.jenis === "medis") {
        totalBiayaMedis += r.subtotal || 0;
        if (r.is_covered_bpjs) totalBiayaMedisBpjs += r.subtotal || 0;
      } else if (r.jenis === "laboratorium") {
        totalBiayaLabor += r.subtotal || 0;
        if (r.is_covered_bpjs) totalBiayaLaborBpjs += r.subtotal || 0;
      }
    });
  });

  const totalPasienBpjs = filteredTagihans.filter(t =>
    t.status === "lunas" && (pembayaranMap[t.id_tagihan]?.cover_bpjs || 0) > 0
  ).length;
  const totalPasienNonBpjs = totalKunjungan - totalPasienBpjs;

  // Chart data filters
  const revenueByDay = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day, idx) => {
    const total = successfulPembayarans
      .filter(p => {
        const d = p.tanggal_pembayaran?.seconds ? new Date(p.tanggal_pembayaran.seconds * 1000) : new Date();
        return d.getDay() === idx;
      })
      .reduce((sum, p) => sum + (p.iur_biaya || 0), 0);
    return { name: day, total };
  });

  const sortedRevenue = [...revenueByDay.slice(1), revenueByDay[0]];

  const insuranceShare = [
    { name: "BPJS", value: totalClaims },
    { name: "Mandiri", value: totalRevenue }
  ];

  const statusCounts: Record<string, number> = { pending: 0, lunas: 0, gagal: 0 };
  filteredTagihans.forEach(t => {
    const s = t.status || "pending";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const allDepartments = Array.from(new Set(tagihans.map(t => t.poli || "Umum")));

  return {
    stats: {
      totalRevenue,
      totalClaims,
      totalTransactions,
      totalKunjungan,
      totalBiayaObat,
      totalBiayaObatBpjs,
      totalBiayaMedis,
      totalBiayaMedisBpjs,
      totalBiayaLabor,
      totalBiayaLaborBpjs,
      totalPasienBpjs,
      totalPasienNonBpjs,
    },
    charts: {
      revenueTrend: sortedRevenue,
      departmentShare: Object.entries(statusCounts).map(([name, count]) => ({ name, count })),
      insuranceShare,
      statusShare: [
        { name: "Pending", count: statusCounts.pending, color: "#f59e0b" },
        { name: "Berhasil", count: statusCounts.lunas, color: "#10b981" },
        { name: "Gagal", count: statusCounts.gagal, color: "#ef4444" }
      ]
    },
    allDepartments,
    filteredTagihans,
    pembayaranMap,
    loading,
    error,
    refresh: fetchData
  };
};