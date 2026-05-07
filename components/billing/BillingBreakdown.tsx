import React from "react";
import { RincianTagihan } from "@/lib/types";

interface BillingBreakdownProps {
  rincian: RincianTagihan[];
  tipePenjamin: "bpjs" | "umum";
}

const BillingBreakdown: React.FC<BillingBreakdownProps> = ({ rincian = [], tipePenjamin }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200">
            <th className="p-5 border-b border-slate-200">Rincian Layanan/Obat</th>
            <th className="p-5 text-right border-b border-slate-200">Harga Asli</th>
            {tipePenjamin === "bpjs" && (
              <>
                <th className="p-5 text-right border-b border-slate-200 text-emerald-600">Ditanggung BPJS</th>
                <th className="p-5 text-right border-b border-slate-200 text-violet-600">Iur Biaya Pasien</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rincian.map((item) => {
            // Logika: Jika is_covered_bpjs true, maka BPJS menanggung FULL harga subtotal
            // Jika false, pasien membayar FULL subtotal
            const isCovered = item.is_covered_bpjs === true;
            const coverBpjs = isCovered ? item.subtotal : 0;
            const iurPasien = isCovered ? 0 : item.subtotal;

            return (
              <tr key={item.id_rincian} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5">
                  <div className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">{item.nama_layanan}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">
                      {item.jenis}
                    </span>
                    {isCovered && (
                      <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded uppercase tracking-wider border border-emerald-100">
                        BPJS Covered
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-5 text-right text-slate-500 font-medium font-mono">
                  {formatCurrency(item.subtotal)}
                </td>
                {tipePenjamin === "bpjs" && (
                  <>
                    <td className="p-5 text-right text-emerald-600 font-bold font-mono">
                      {isCovered ? formatCurrency(coverBpjs) : "-"}
                    </td>
                    <td className="p-5 text-right font-black font-mono">
                      <span className={iurPasien > 0 ? "text-violet-600" : "text-slate-300"}>
                        {formatCurrency(iurPasien)}
                      </span>
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
