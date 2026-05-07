"use client";

import { useState } from "react";
import { seedPasienData, seedDemoPasien, seedTransaksiSampleData } from "@/lib/firebase/seed";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string[]>([]);

  const addStatus = (msg: string) => {
    setStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const run = async (label: string, fn: () => Promise<void>) => {
    setLoading(true);
    addStatus(`Mulai: ${label}...`);
    try {
      await fn();
      addStatus(`✅ Selesai: ${label}`);
    } catch (e: any) {
      addStatus(`❌ Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seeds = [
    {
      label: "1. Pasien Demo (ID Tetap)",
      desc: "Seed 5 pasien dengan ID statis (DEMO-PASIEN-001 dst.) sebagai referensi FK tagihan.",
      color: "bg-blue-600 hover:bg-blue-700",
      fn: seedDemoPasien,
    },
    {
      label: "2. Pasien & Auth (10 Akun)",
      desc: "Daftarkan 10 pasien ke Firebase Auth + Firestore. Password default: password123",
      color: "bg-indigo-600 hover:bg-indigo-700",
      fn: seedPasienData,
    },
    {
      label: "3. Transaksi (Tagihan, Rinci, Pembayaran)",
      desc: "Seed 8 tagihan + 17 rinci_tagihan + 5 pembayaran ke Firestore sesuai ERD.",
      color: "bg-emerald-600 hover:bg-emerald-700",
      fn: seedTransaksiSampleData,
    },
  ];

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-50 p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Database Seeder</h1>
          <p className="text-slate-500 text-sm mt-1">Development tool — jalankan secara berurutan (1 → 2 → 3)</p>
        </div>

        <div className="p-8 space-y-4">
          {seeds.map((s) => (
            <div key={s.label} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl">
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{s.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
              </div>
              <button
                onClick={() => run(s.label, s.fn)}
                disabled={loading}
                className={`shrink-0 px-6 py-2.5 ${s.color} text-white rounded-xl font-bold text-xs uppercase tracking-wide transition disabled:opacity-40`}
              >
                Jalankan
              </button>
            </div>
          ))}

          <div className="mt-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Execution Logs</h2>
            <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl min-h-[280px] max-h-[400px] overflow-y-auto border border-slate-800 shadow-inner">
              {status.map((s, i) => (
                <div key={i} className="mb-1">
                  <span className="text-slate-500 mr-2">{">"}</span>
                  {s}
                </div>
              ))}
              {loading && <div className="animate-pulse text-indigo-400 mt-2">Processing...</div>}
              {status.length === 0 && !loading && <div className="text-slate-600 italic">No activity yet. Ready for seeding.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
