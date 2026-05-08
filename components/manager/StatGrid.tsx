"use client";

import React from "react";
import { statItems } from "@/lib/data/stats";

interface StatGridProps {
  stats: any;
}

const StatGrid: React.FC<StatGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems(stats).map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600`}>
              {stat.delta}
            </span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
          <h3 className="text-xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default StatGrid;
