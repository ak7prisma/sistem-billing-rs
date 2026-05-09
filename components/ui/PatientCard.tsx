import React from "react";
import Link from "next/link";
import { FiUser, FiCheckCircle, FiMail, FiMapPin, FiActivity } from "react-icons/fi";
import { Pasien } from "@/lib/types";

interface PatientCardProps {
  patient: Pasien;
  href: string;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, href }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-center md:items-start group">
      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner relative">
        <FiUser size={32} />
        {patient.email && (
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-lg shadow-emerald-500/20">
            <FiCheckCircle size={10} />
          </div>
        )}
      </div>
      
      <div className="flex-1 text-center md:text-left space-y-4 w-full">
        <div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{patient.nama}</h3>
            <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${patient.tipe_penjamin === 'bpjs' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
              {patient.tipe_penjamin}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-x-4 gap-y-1">
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">RM: {patient.no_rm}</p>
            {patient.email && (
              <p className="text-slate-400 font-bold text-[10px] flex items-center gap-1 justify-center md:justify-start lowercase italic">
                <FiMail className="text-blue-500" /> {patient.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
              <FiMapPin /> Alamat
            </p>
            <p className="text-xs font-bold text-slate-500 line-clamp-1">{patient.alamat || "Alamat belum diatur"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
              <FiActivity /> Akun Portal
            </p>
            <p className={`text-xs font-black uppercase ${patient.email ? 'text-emerald-500' : 'text-slate-300'}`}>
              {patient.email ? 'Terhubung' : 'Belum Ada'}
            </p>
          </div>
        </div>

        <Link 
          href={href}
          className="w-full bg-slate-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600 shadow-lg shadow-slate-900/10 active:scale-95 text-center block"
        >
          Lihat Profil Lengkap
        </Link>
      </div>
    </div>
  );
};

export default PatientCard;