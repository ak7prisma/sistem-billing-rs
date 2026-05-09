"use client";

import { useState, useMemo } from "react";
import { useTagihans } from "./useTagihan";
import { Tagihan } from "@/lib/types";

export function useKasirDashboard() {
  const [search, setSearch] = useState("");
  const { tagihans, loading, refresh } = useTagihans();
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    return tagihans.filter(item => 
      (item.poli || "").toLowerCase().includes(search.toLowerCase()) || 
      item.id_tagihan.toLowerCase().includes(search.toLowerCase())
    );
  }, [tagihans, search]);

  const stats = useMemo(() => ({
    pending: tagihans.filter(t => t.status === "pending").length,
    lunas: tagihans.filter(t => t.status === "lunas").length,
    gagal: tagihans.filter(t => t.status === "gagal").length,
  }), [tagihans]);

  const handleActionClick = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan);
    if (tagihan.status === "pending") {
      setIsInvoiceModalOpen(true);
    } else {
      setIsReceiptModalOpen(true);
    }
  };

  const closeModals = () => {
    setIsInvoiceModalOpen(false);
    setIsReceiptModalOpen(false);
  };

  return {
    search,
    setSearch,
    loading,
    refresh,
    filteredData,
    stats,
    selectedTagihan,
    isInvoiceModalOpen,
    isReceiptModalOpen,
    handleActionClick,
    closeModals,
  };
}