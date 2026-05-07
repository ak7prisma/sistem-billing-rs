"use client";

import React, { useState } from "react";
import { seedInitialData } from "@/lib/firebase/seed";
import { FiDatabase, FiUserCheck, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function SetupPage() {
  const [uids, setUids] = useState({
    manager: "",
    kasir: "",
    pasien: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uids.manager || !uids.kasir || !uids.pasien) {
      alert("Harap isi semua UID dari Firebase Auth Dashboard!");
      return;
    }

    setStatus("loading");
    try {
      await seedInitialData(uids);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 p-8 md:p-12 border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <FiDatabase size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Database <span className="text-blue-600">Initializer</span></h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Setup Roles & ERD Data</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl mb-8 space-y-2">
          <p className="text-amber-800 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <FiAlertCircle /> Petunjuk Penting
          </p>
          <ol className="text-slate-600 text-sm font-medium list-decimal ml-4 space-y-1">
            <li>Buat 3 akun di Firebase Auth (Manager, Kasir, Pasien).</li>
            <li>Copy UID masing-masing akun dari dashboard Firebase.</li>
            <li>Klik tombol di bawah untuk sinkronisasi role dan <strong>generate data ERD (Tagihan, Pasien, Rincian)</strong>.</li>
          </ol>
        </div>

        <form onSubmit={handleSeed} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UID Akun Manager</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition"
                placeholder="Paste UID Manager di sini..."
                value={uids.manager}
                onChange={(e) => setUids({...uids, manager: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UID Akun Kasir</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition"
                placeholder="Paste UID Kasir di sini..."
                value={uids.kasir}
                onChange={(e) => setUids({...uids, kasir: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UID Akun Pasien</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition"
                placeholder="Paste UID Pasien di sini..."
                value={uids.pasien}
                onChange={(e) => setUids({...uids, pasien: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {status === "loading" ? "Proses Inisialisasi..." : "Sinkronkan & Generate Data ERD"}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
            <FiCheckCircle className="text-emerald-500 flex-shrink-0" size={32} />
            <div>
              <p className="font-black text-emerald-800 uppercase tracking-tight text-sm">Berhasil!</p>
              <p className="text-emerald-600 text-xs font-medium">Role telah disematkan dan data ERD telah dibuat di Firestore.</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
            <FiAlertCircle className="text-red-500 flex-shrink-0" size={32} />
            <div>
              <p className="font-black text-red-800 uppercase tracking-tight text-sm">Gagal!</p>
              <p className="text-red-600 text-xs font-medium">Terjadi kesalahan. Pastikan koneksi dan UID sudah benar.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
