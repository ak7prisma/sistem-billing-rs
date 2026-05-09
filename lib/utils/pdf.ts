import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah } from "./currency";

export const generateFinancialReport = (
  stats: any, 
  charts: any, 
  timeRange: string, 
  poli: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("LAPORAN KEUANGAN RUMAH SAKIT", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-400
  doc.text(`Periode: ${timeRange} | Departemen: ${poli}`, pageWidth / 2, 28, { align: "center" });
  doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, pageWidth / 2, 33, { align: "center" });

  // Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(20, 40, pageWidth - 20, 40);

  // Summary Stats
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("Ringkasan Performa", 20, 50);

  const statData = [
    ["Total Pendapatan (Non BPJS)", formatRupiah(stats.totalRevenue)],
    ["Total Klaim BPJS", formatRupiah(stats.totalClaims)],
    ["Total Transaksi Berhasil", `${stats.totalTransactions} Transaksi`],
    ["Total Kunjungan Pasien", `${stats.totalKunjungan} Pasien`],
  ];

  autoTable(doc, {
    startY: 55,
    head: [["Metrik", "Nilai"]],
    body: statData,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    styles: { fontSize: 10, cellPadding: 5 }
  });

  // Department Breakdown
  let finalY = (doc as any).lastAutoTable.finalY || 100;
  let currentY = finalY + 15;
  doc.text("Distribusi Per Departemen", 20, currentY);
  
  const poliData = charts.departmentShare.map((d: any) => [d.name, d.count]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [["Nama Poli", "Jumlah Kunjungan"]],
    body: poliData,
    theme: "grid",
    headStyles: { fillColor: [139, 92, 246] }, // violet-500
    styles: { fontSize: 10 }
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Halaman ${i} dari ${pageCount} - Sistem Billing RS Terintegrasi`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`Laporan_Keuangan_${poli.replace(" ", "_")}_${new Date().getTime()}.pdf`);
};