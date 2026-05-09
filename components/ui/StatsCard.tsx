import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  description: string;
  iconBg: string;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, description, iconBg, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center font-black`}>
        {value}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-black text-slate-800 tracking-tight">{description}</p>
      </div>
    </div>
  );
};

export default StatsCard;