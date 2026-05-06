export type UserRole = "kasir" | "manajer" | "pasien";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  nama: string;
}

export interface Pasien {
  id: string;
  no_rm: string;
  nama: string;
  tipe_penjamin: "bpjs" | "umum";
  no_bpjs?: string;
}

export interface RincianTagihan {
  id_rincian: string;
  jenis: "lab" | "obat" | "tindakan" | "konsultasi";
  nama_layanan: string;
  jumlah: number;
  subtotal: number;
  is_covered_bpjs: boolean;
}

export type TagihanStatus = "pending" | "lunas" | "gagal";

export interface Tagihan {
  id: string;
  kunjungan_id: string;
  pasien_id: string;
  total_biaya: number;
  status: TagihanStatus;
  tanggal: string; // ISO string or Firestore Timestamp
  poli: string;
  rincian: RincianTagihan[];
}

export interface Pembayaran {
  id: string;
  tagihan_id: string;
  metode: "tunai" | "qris" | "transfer";
  jumlah_pembayaran: number;
  cover_bpjs: number;
  iur_biaya: number;
  status: "berhasil" | "gagal";
  tanggal_pembayaran: string;
}
