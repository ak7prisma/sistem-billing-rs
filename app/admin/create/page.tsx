"use client";

import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { FiUserPlus, FiMail, FiLock, FiUser, FiShield, FiCheckCircle, FiLoader, FiAlertCircle } from "react-icons/fi";
import { UserRole } from "@/lib/types";
import Link from "next/link";
import { useCreateStaff } from "@/lib/hooks/useCreateStaff";

const ROLES: UserRole[] = ["kasir", "manajer", "admin"];

export default function CreateUserPage() {
  const { 
    formData, 
    setFormData, 
    loading, 
    success, 
    error, 
    handleSubmit, 
    resetSuccess 
  } = useCreateStaff();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Generate Staff Account" 
        subtitle="Buat akun baru untuk Kasir, Manajer Keuangan, atau Admin"
        badge="Account Creation"
      />

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-50 rounded-full -ml-12 -mb-12 opacity-50"></div>

        {success ? (
          <SuccessView onReset={resetSuccess} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                <FiAlertCircle className="shrink-0" />
                <p className="text-xs font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Nama Lengkap" 
                  icon={FiUser} 
                  placeholder="Contoh: Budi Santoso"
                  value={formData.nama}
                  onChange={(val) => setFormData({...formData, nama: val})}
                />
                <InputField 
                  label="Email Staff" 
                  icon={FiMail} 
                  type="email"
                  placeholder="staff@hospital.com"
                  value={formData.email}
                  onChange={(val) => setFormData({...formData, email: val})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Password" 
                  icon={FiLock} 
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  value={formData.password}
                  onChange={(val) => setFormData({...formData, password: val})}
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Jabatan</label>
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none transition-all cursor-pointer"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <FiLoader className="animate-spin" /> : <FiUserPlus size={18} />}
                {loading ? "Mendaftarkan Staff..." : "Generate Akun Staff"}
              </button>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Akses akun ini dapat dikelola kembali melalui halaman Staff Management.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  minLength?: number;
}

function InputField({ label, icon: Icon, type = "text", placeholder, value, onChange, minLength }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          required
          type={type}
          placeholder={placeholder}
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
        />
      </div>
    </div>
  );
}

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-12 space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
        <FiCheckCircle size={40} />
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Akun Berhasil Dibuat!</h3>
        <p className="text-slate-500 font-medium mt-2">Staff sekarang dapat login menggunakan email dan password tersebut.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button 
          onClick={onReset}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-xl"
        >
          Buat Akun Lain
        </button>
        <Link 
          href="/admin/users"
          className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition"
        >
          Lihat Daftar User
        </Link>
      </div>
    </div>
  );
}