"use client";

import React from "react";
import { FiShield, FiDollarSign, FiActivity, FiUsers } from "react-icons/fi";
import { formatRupiah } from "@/lib/utils/currency";

interface BpjsStatsSectionProps {
  stats: {
    totalClaims: number;
    totalRevenue: number;
    totalBiayaObat: number;
    totalBiayaObatBpjs: number;
    totalBiayaMedis: number;
    totalBiayaMedisBpjs: number;
    totalBiayaLabor: number;
    totalBiayaLaborBpjs: number;
    totalPasienBpjs: number;
    totalPasienNonBpjs: number;
  };
}

const BpjsStatsSection: React.FC<BpjsStatsSectionProps> = ({ stats }) => {
  const jenisRows = [
    {
      label: "Obat",
      total: stats.totalBiayaObat,
      bpjs: stats.totalBiayaObatBpjs,
      nonBpjs: stats.totalBiayaObat - stats.totalBiayaObatBpjs,
      color: "bg-blue-500",
      icon: FiActivity,
    },
    {
      label: "Tindakan Medis",
      total: stats.totalBiayaMedis,
      bpjs: stats.totalBiayaMedisBpjs,
      nonBpjs: stats.totalBiayaMedis - stats.totalBiayaMedisBpjs,
      color: "bg-violet-500",
      icon: FiActivity,
    },
    {
      label: "Layanan Labor",
      total: stats.totalBiayaLabor,
      bpjs: stats.totalBiayaLaborBpjs,
      nonBpjs: stats.totalBiayaLabor - stats.totalBiayaLaborBpjs,
      color: "bg-amber-500",
      icon: FiActivity,
    },
  ];

  const grandTotal = stats.totalBiayaObat + stats.totalBiayaMedis + stats.totalBiayaLabor;
  const grandBpjs = stats.totalBiayaObatBpjs + stats.totalBiayaMedisBpjs + stats.totalBiayaLaborBpjs;
  const grandNonBpjs = grandTotal - grandBpjs;

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
          <FiShield size={18} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Laporan BPJS</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Rekapitulasi Klaim BPJS vs Iur Biaya Pasien
          </p>
        </div>
      </div>

      {/* Pasien Split Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <FiShield size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">
              Pasien BPJS
            </p>
            <p className="text-2xl font-black text-emerald-700 tracking-tighter">
              {stats.totalPasienBpjs}
            </p>
            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">kunjungan</p>
          </div>
        </div>
        <div className="bg-violet-50 border border-violet-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
          <div className="bg-violet-500 p-3 rounded-2xl text-white shadow-lg shadow-violet-500/20 shrink-0">
            <FiUsers size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest mb-1">
              Pasien Non-BPJS / Umum
            </p>
            <p className="text-2xl font-black text-violet-700 tracking-tighter">
              {stats.totalPasienNonBpjs}
            </p>
            <p className="text-[9px] font-bold text-violet-500 uppercase tracking-widest">kunjungan</p>
          </div>
        </div>
      </div>

      {/* Per-Jenis Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Rincian Biaya Per Jenis Layanan
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left">Jenis Layanan</th>
                <th className="px-6 py-4 text-right">Total Biaya</th>
                <th className="px-6 py-4 text-right text-emerald-600">Ditanggung BPJS</th>
                <th className="px-6 py-4 text-right text-violet-600">Iur Biaya (Non-BPJS)</th>
                <th className="px-6 py-4 text-right">% BPJS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jenisRows.map((row) => {
                const pct = row.total > 0 ? Math.round((row.bpjs / row.total) * 100) : 0;
                return (
                  <tr key={row.label} className="hover:bg-slate-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`${row.color} w-2 h-6 rounded-full shrink-0`} />
                        <span className="font-bold text-slate-700 group-hover:text-violet-600 transition-colors">
                          {row.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-800 font-mono text-xs">
                      {formatRupiah(row.total)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600 font-mono text-xs">
                      {formatRupiah(row.bpjs)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-violet-600 font-mono text-xs">
                      {formatRupiah(row.nonBpjs)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Grand Total Row */}
              <tr className="bg-slate-50 font-black">
                <td className="px-6 py-4 text-slate-700 uppercase text-[10px] tracking-widest">
                  Total Keseluruhan
                </td>
                <td className="px-6 py-4 text-right text-slate-800 font-mono text-sm">
                  {formatRupiah(grandTotal)}
                </td>
                <td className="px-6 py-4 text-right text-emerald-700 font-mono text-sm">
                  {formatRupiah(grandBpjs)}
                </td>
                <td className="px-6 py-4 text-right text-violet-700 font-mono text-sm">
                  {formatRupiah(grandNonBpjs)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: grandTotal > 0 ? `${Math.round((grandBpjs / grandTotal) * 100)}%` : "0%" }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-600 w-8 text-right">
                      {grandTotal > 0 ? Math.round((grandBpjs / grandTotal) * 100) : 0}%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 shrink-0">
            <FiShield size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Klaim BPJS
            </p>
            <p className="text-xl font-black text-slate-800 tracking-tighter">
              {formatRupiah(stats.totalClaims)}
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
          <div className="bg-violet-100 p-3 rounded-2xl text-violet-600 shrink-0">
            <FiDollarSign size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Iur Biaya (Non-BPJS)
            </p>
            <p className="text-xl font-black text-slate-800 tracking-tighter">
              {formatRupiah(stats.totalRevenue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BpjsStatsSection;
