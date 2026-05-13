"use client";

import React from "react";
import JenisReportView from "@/components/manager/JenisReportView";
import { FiPackage } from "react-icons/fi";

export default function LaporanObatPage() {
  return (
    <JenisReportView 
      jenis="obat" 
      title="Laporan Obat" 
      subtitle="Analisis pemasukan dan jaminan BPJS khusus untuk farmasi/obat."
      icon={FiPackage}
      color="bg-blue-600"
    />
  );
}