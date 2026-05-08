import { FiDollarSign, FiActivity, FiTrendingUp, FiUsers } from "react-icons/fi";
import { formatRupiah } from "../utils/currency";

export const statItems = (stats: any) => [
  { label: "Non BPJS", value: formatRupiah(stats.totalRevenue), delta: "Real-time", icon: FiDollarSign, color: "bg-blue-500" },
  { label: "Klaim BPJS", value: formatRupiah(stats.totalClaims), delta: "Pending", icon: FiActivity, color: "bg-emerald-500" },
  { label: "Total Transaksi", value: stats.totalTransactions.toString(), delta: "Selesai", icon: FiTrendingUp, color: "bg-violet-500" },
  { label: "Total Kunjungan", value: stats.totalKunjungan.toString(), delta: "Terdaftar", icon: FiUsers, color: "bg-amber-500" },
];