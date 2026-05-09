import React from "react";
import { TagihanStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: TagihanStatus | "BPJS Cover";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    lunas: "bg-violet-100 text-violet-700 border-violet-200",
    gagal: "bg-red-100 text-red-700 border-red-200",
    "BPJS Cover": "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const currentStyle = styles[status as keyof typeof styles] || styles.pending;

  return (
    <span className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${currentStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;