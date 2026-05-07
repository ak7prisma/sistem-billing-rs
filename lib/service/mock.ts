import { Tagihan } from "../types";

export const MOCK_TAGIHAN: Tagihan[] = [
  {
    id_tagihan: "INV-20240501-01",
    pasien_id: "P-001",
    poli: "Poli Jantung",
    total_biaya: 750000,
    status: "pending",
    tanggal: "01 Mei 2024",
    rincian: [
      { id_rincian: "R1", jenis: "medis", nama_layanan: "EKG", jumlah: 1, subtotal: 250000, tanggal: "2024-05-01", is_covered_bpjs: true },
      { id_rincian: "R2", jenis: "obat", nama_layanan: "Amlodipine", jumlah: 30, subtotal: 500000, tanggal: "2024-05-01", is_covered_bpjs: true }
    ]
  },
  {
    id_tagihan: "INV-20240502-02",
    pasien_id: "P-002",
    poli: "Poli Umum",
    total_biaya: 150000,
    status: "lunas",
    tanggal: "02 Mei 2024",
    rincian: [
      { id_rincian: "R3", jenis: "medis", nama_layanan: "Konsultasi Dokter", jumlah: 1, subtotal: 150000, tanggal: "2024-05-02", is_covered_bpjs: false }
    ]
  }
];

export const getTagihanById = (id: string) => {
  return MOCK_TAGIHAN.find(t => t.id_tagihan === id);
};

