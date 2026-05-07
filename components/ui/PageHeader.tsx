import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, badge, children }: Readonly<PageHeaderProps>) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {title}
          </h2>
          {badge && (
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {badge}
            </span>
          )}
        </div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest opacity-70">
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        {children}
      </div>
    </div>
  );
}
