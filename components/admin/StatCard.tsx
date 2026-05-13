import React from "react";
import { IconType } from "react-icons";

interface StatCardProps {
  icon: IconType;
  label: string;
  value: number;
  color: string;
}

export default function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition duration-300">
      <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${color.split('-')[1]}-500/20`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h4>
    </div>
  );
}