"use client";

import { useState } from "react";
import { seedInitialData } from "@/lib/firebase/seed";
import { FiDatabase, FiCheckCircle, FiLoader, FiKey, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uids, setUids] = useState({ manager: "", kasir: "", pasien: "" });

  const handleSeed = async () => {
    const { manager, kasir, pasien } = uids;
    if (!manager || !kasir || !pasien) {
      alert("Semua UID wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await seedInitialData(uids);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Gagal melakukan seeding.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "manager", label: "Manager UID", color: "text-blue-400", border: "focus:border-blue-500" },
    { id: "kasir", label: "Kasir UID", color: "text-emerald-400", border: "focus:border-emerald-500" },
    { id: "pasien", label: "Pasien UID (Budi)", color: "text-violet-400", border: "focus:border-violet-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-violet-600/10 rounded-3xl flex items-center justify-center border border-violet-500/20 shadow-inner">
              <FiDatabase className="text-violet-500 w-10 h-10" />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Database Setup</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Inisialisasi Master Data & Role</p>
        </div>

        <div className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${field.color} flex items-center gap-2`}>
                <FiKey /> {field.label}
              </label>
              <input 
                className={`w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-mono ${field.border} outline-none transition-all focus:ring-4 focus:ring-white/5`}
                placeholder={`Paste ${field.label}...`}
                value={uids[field.id as keyof typeof uids]}
                onChange={(e) => setUids({...uids, [field.id]: e.target.value})}
              />
            </div>
          ))}
        </div>

        {!success ? (
          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-white text-slate-900 py-5 rounded-3xl font-black uppercase tracking-widest transition shadow-2xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <FiLoader className="animate-spin" /> : "Sinkronkan Sekarang"}
          </button>
        ) : (
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl flex flex-col items-center gap-4 text-center animate-in zoom-in-95">
            <FiCheckCircle className="text-emerald-500 w-12 h-12" />
            <div className="space-y-1">
              <p className="text-emerald-500 font-black uppercase tracking-widest text-sm">Setup Berhasil</p>
              <p className="text-slate-500 text-xs font-medium">Data master dan role telah disinkronkan.</p>
            </div>
            <Link href="/auth/login" className="mt-4 flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest hover:text-emerald-400 transition">
              <FiArrowLeft /> Kembali ke Login
            </Link>
          </div>
        )}

        <p className="text-center text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">
          PROTOTYPE ENVIRONMENT • DO NOT DEPLOY
        </p>
      </div>
    </div>
  );
}
