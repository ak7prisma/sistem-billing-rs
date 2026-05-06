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
      <div className="max-w-5xl w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <FiActivity className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-800">
            Satria <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500">Billing</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Sistem Informasi Billing Rumah Sakit Terintegrasi. Pilih portal akses Anda di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                {role.icon}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{role.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {role.description}
              </p>
              <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                Masuk ke Portal <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-12 text-slate-400 text-sm font-medium">
          &copy; 2026 RS Satria Medika. All rights reserved.
        </div>
      </div>
    </main>
  );
}
