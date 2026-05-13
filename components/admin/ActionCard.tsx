import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";

interface ActionCardProps {
  title: string;
  desc: string;
  href: string;
  icon: IconType;
  disabled?: boolean;
}

export default function ActionCard({ title, desc, href, icon: Icon, disabled }: ActionCardProps) {
  const content = (
    <>
      <div className={`p-3 rounded-2xl ${disabled ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h5 className="font-black text-slate-800 text-sm mb-1">{title}</h5>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </>
  );

  if (disabled) {
    return (
      <div className="p-6 rounded-3xl border border-slate-100 flex items-start gap-4 transition opacity-50 grayscale cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link 
      href={href}
      className="p-6 rounded-3xl border border-slate-100 flex items-start gap-4 transition group hover:bg-slate-50 hover:border-blue-100 cursor-pointer shadow-sm hover:shadow-md"
    >
      {content}
    </Link>
  );
}