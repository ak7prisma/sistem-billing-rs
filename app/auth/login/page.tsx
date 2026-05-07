"use client";

import React, { useState } from "react";
import { FiMail, FiLock, FiArrowRight, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
import { useLogin } from "@/lib/hooks/useLogin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { performLogin, loading, error, setError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    await performLogin(email, password);
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Selamat Datang</h2>
        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">RS Satria Medika Billing</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[11px] font-black border border-red-100 flex items-center gap-2 uppercase tracking-tight">
           <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
           {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <FiMail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 font-bold transition text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative group">
            <FiLock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 font-bold transition text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400 hover:text-violet-500 transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>


        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? (
            <FiLoader className="animate-spin text-violet-400" size={18} />
          ) : (
            <>Masuk Sekarang <FiArrowRight size={18} /></>
          )}
        </button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-slate-400 text-[10px] font-black leading-relaxed uppercase tracking-widest opacity-60">
          Internal access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
