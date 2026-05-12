"use client";

import React from "react";
import JenisReportView from "@/components/manager/JenisReportView";
import { FiActivity } from "react-icons/fi";

export default function LaporanTindakanPage() {
  return (
    <JenisReportView 
      jenis="medis" 
      title="Laporan Tindakan" 
      subtitle="Analisis pemasukan dan jaminan BPJS untuk tindakan medis & konsultasi."
      icon={FiActivity}
      color="bg-violet-600"
    />
  );
}
