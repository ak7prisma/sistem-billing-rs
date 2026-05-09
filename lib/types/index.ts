export type UserRole = "kasir" | "manajer" | "pasien" | "developer";
export type TagihanStatus = "pending" | "lunas" | "gagal";

export interface User {
  uid: string;
  email: string;
  nama: string;
  role: UserRole;
  photoURL?: string;
  createdAt?: any;
  lastLogin?: any;
}

export interface Obat {
  id_obat: string;
  nama_obat: string;
  harga: number;
  is_covered_bpjs: boolean;
  poli?: string;
}

export interface LayananMedis {
  id_layanan_medis: string;
  nama_layanan: string;
  harga: number;
  is_covered_bpjs: boolean;
  poli?: string;
}

export interface LayananLabor {
  id_layanan_labor: string;
  nama_layanan: string;
  harga: number;
  is_covered_bpjs: boolean;
  poli?: string;
}

// Internal Data
export interface Pasien {
  id: string;
  no_rm: string;
  nama: string;
  tipe_penjamin: "bpjs" | "umum";
  no_bpjs?: string;
  alamat?: string;
  email?: string;
}

export interface RincianTagihan {
  id_rincian: string;
  id_layanan_labor?: string;
  id_layanan_medis?: string;
  id_obat?: string;
  nama_layanan: string;
  jenis: "obat" | "medis" | "laboratorium";
  jumlah: number;
  subtotal: number;
  tanggal?: string;
  is_covered_bpjs?: boolean;
}

export interface Tagihan {
  id_tagihan: string;
  pasien_id: string;
  poli?: string;
  tanggal: any;
  status: TagihanStatus;
  total_biaya: number;
  rincian: RincianTagihan[];
  createdAt?: any;
}

export interface Pembayaran {
  id_pembayaran: string;
  tagihan_id: string;
  metode_pembayaran: "tunai" | "qris" | "transfer" | "xendit";
  tanggal_pembayaran: any;
  jumlah_pembayaran: number;
  cover_bpjs: number;
  iur_biaya: number;
  status: "berhasil" | "gagal";
  xendit_invoice_id?: string;
}

export interface RincianPembayaran {
  id_rincian_pembayaran: string;
  pembayaran_id: string;
  nama_item: string;
  jumlah: number;
  subtotal: number;
}