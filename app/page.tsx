import Link from "next/link";
import { FiUser, FiBriefcase, FiDollarSign, FiActivity } from "react-icons/fi";

export default function LandingPage() {
  const roles = [
    {
      title: "Pasien",
      description: "Lihat tagihan, riwayat pembayaran, dan bantuan.",
      icon: <FiUser className="w-8 h-8" />,
      href: "/pasien",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Kasir",
      description: "Proses pembayaran pasien (Tunai & QRIS).",
      icon: <FiDollarSign className="w-8 h-8" />,
      href: "/kasir",
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Manajer Keuangan",
      description: "Laporan harian, statistik, dan export data.",
      icon: <FiBriefcase className="w-8 h-8" />,
      href: "/manager",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/20 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
              <FiActivity className="text-white w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Satria <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500">Billing</span>
          </h1>
          <p className="text-slate-500 font-bold text-lg md:text-xl max-w-2xl mx-auto uppercase tracking-widest opacity-80">
            Sistem Informasi Rumah Sakit Terintegrasi
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link 
            href="/auth/login"
            className="group relative bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-4 hover:scale-105"
          >
            Masuk ke Sistem <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
          <p className="text-slate-400 text-sm font-medium italic">
            Silakan login untuk mengakses portal Pasien, Kasir, atau Manajer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-700 pointer-events-none">
          {roles.map((role) => (
            <div key={role.title} className="bg-white p-8 rounded-3xl border border-slate-200 text-left">
              <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                {role.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{role.title}</h2>
              <p className="text-slate-500 text-xs leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>

        <div className="pt-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          &copy; 2026 RS Satria Medika. Professional Healthcare Billing.
        </div>
      </div>
    </main>
  );
}
