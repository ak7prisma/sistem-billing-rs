import React from "react";
import { RincianTagihan } from "@/lib/types";

interface BillingBreakdownProps {
  rincian: RincianTagihan[];
  tipePenjamin: "bpjs" | "umum";
}

const BillingBreakdown: React.FC<BillingBreakdownProps> = ({ rincian, tipePenjamin }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200 uppercase tracking-wider text-[10px]">
          <tr>
            <th className="p-4">Deskripsi Item</th>
            <th className="p-4 text-right">Biaya</th>
            {tipePenjamin === "bpjs" && (
              <>
                <th className="p-4 text-right text-emerald-600">Cover BPJS</th>
                <th className="p-4 text-right text-violet-600">Iur Pasien</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {rincian.map((item) => {
            const iurPasien = item.is_covered_bpjs ? 0 : item.subtotal;
            const coverBpjs = item.is_covered_bpjs ? item.subtotal : 0;

            return (
              <tr key={item.id_rincian} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{item.nama_layanan}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{item.jenis}</div>
                </td>
                <td className="p-4 text-right text-slate-500">{formatCurrency(item.subtotal)}</td>
                {tipePenjamin === "bpjs" && (
                  <>
                    <td className="p-4 text-right text-emerald-600 font-semibold">
                      {coverBpjs > 0 ? formatCurrency(coverBpjs) : "-"}
                    </td>
                    <td className="p-4 text-right text-violet-600 font-black">
                      {iurPasien > 0 ? formatCurrency(iurPasien) : "Rp 0"}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BillingBreakdown;
