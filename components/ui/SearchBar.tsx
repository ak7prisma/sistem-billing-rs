"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Cari data...", className = "" }: Readonly<SearchBarProps>) {
  return (
    <div className={`relative flex-1 md:flex-none group min-w-50 ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none">
        <FiSearch size={16} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 font-bold transition text-xs uppercase tracking-widest placeholder:text-slate-300 shadow-sm group-hover:border-slate-300"
      />
    </div>
  );
}