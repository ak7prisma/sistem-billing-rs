"use client";

import React from "react";
import JenisReportView from "@/components/manager/JenisReportView";
import { FiLayers } from "react-icons/fi";

export default function LaporanLaborPage() {
  return (
    <JenisReportView 
      jenis="laboratorium" 
      title="Laporan Labor" 
      subtitle="Analisis pemasukan dan jaminan BPJS untuk layanan laboratorium & lab."
      icon={FiLayers}
      color="bg-amber-600"
    />
  );
}