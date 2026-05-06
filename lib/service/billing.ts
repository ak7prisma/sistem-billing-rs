import { Tagihan, RincianTagihan } from "../types";

export const MOCK_TAGIHAN: Tagihan[] = [
  {
    id: "INV-20260505-882",
    kunjungan_id: "KJN-001",
    pasien_id: "PSN-001",
    total_biaya: 150000,
    status: "pending",
    tanggal: "05 Mei 2026",
    poli: "Poli Penyakit Dalam",
    rincian: [
      {
        id_rincian: "RNC-001",
        jenis: "konsultasi",
        nama_layanan: "Konsultasi Dokter Spesialis Dalam",
        jumlah: 1,
        subtotal: 250000,
        is_covered_bpjs: true,
      },
      {
        id_rincian: "RNC-002",
        jenis: "obat",
        nama_layanan: "Obat Non-Formularium (Permintaan Pasien)",
        jumlah: 1,
        subtotal: 150000,
        is_covered_bpjs: false,
      },
    ],
  },
  {
    id: "INV-20260420-501",
    kunjungan_id: "KJN-002",
    pasien_id: "PSN-001",
    total_biaya: 150000,
    status: "lunas",
    tanggal: "20 Apr 2026",
    poli: "Poli Gigi",
    rincian: [
      {
        id_rincian: "RNC-003",
        jenis: "tindakan",
        nama_layanan: "Pencabutan Gigi Bungsu",
        jumlah: 1,
        subtotal: 150000,
        is_covered_bpjs: false,
      },
    ],
  },
  {
    id: "INV-20260312-104",
    kunjungan_id: "KJN-003",
    pasien_id: "PSN-001",
    total_biaya: 0,
    status: "lunas",
    tanggal: "12 Mar 2026",
    poli: "Poli Mata",
    rincian: [
      {
        id_rincian: "RNC-004",
        jenis: "konsultasi",
        nama_layanan: "Pemeriksaan Mata Rutin",
        jumlah: 1,
        subtotal: 100000,
        is_covered_bpjs: true,
      },
    ],
  },
];

export const getTagihanById = (id: string): Tagihan | undefined => {
  return MOCK_TAGIHAN.find((t) => t.id === id);
};
