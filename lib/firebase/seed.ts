import { db, auth } from "./config";
import { 
  setDoc, 
  doc, 
  collection,
  writeBatch
} from "firebase/firestore";
import { signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { Pasien } from "../types";
import { MASTER_OBAT, MASTER_LAYANAN_MEDIS, MASTER_LAYANAN_LABOR } from "../data/master";

// Pasien IDs yang dipakai sebagai foreign key di seed transaksi
// Gunakan ID pasien yang sudah ada di Firestore, atau jalankan seedPasienData dulu.
const SEED_PASIEN_IDS = [
  "DEMO-PASIEN-001", // Budi Santoso (BPJS)
  "DEMO-PASIEN-002", // Siti Aminah (Umum)
  "DEMO-PASIEN-003", // Andi Wijaya (BPJS)
  "DEMO-PASIEN-004", // Dewi Lestari (Umum)
  "DEMO-PASIEN-005", // Eko Prasetyo (BPJS)
];

const SEED_PASIEN_TIPE: Record<string, "bpjs" | "umum"> = {
  "DEMO-PASIEN-001": "bpjs",
  "DEMO-PASIEN-002": "umum",
  "DEMO-PASIEN-003": "bpjs",
  "DEMO-PASIEN-004": "umum",
  "DEMO-PASIEN-005": "bpjs",
};

const PASIEN_DUMMY: Omit<Pasien, "id">[] = [
  { no_rm: "RM001", nama: "Budi Santoso", tipe_penjamin: "bpjs", no_bpjs: "000123456789", alamat: "Jl. Merdeka No. 1", email: "budi@example.com" },
  { no_rm: "RM002", nama: "Siti Aminah", tipe_penjamin: "umum", alamat: "Jl. Mawar No. 12", email: "siti@example.com" },
  { no_rm: "RM003", nama: "Andi Wijaya", tipe_penjamin: "bpjs", no_bpjs: "000987654321", alamat: "Jl. Melati No. 5", email: "andi@example.com" },
  { no_rm: "RM004", nama: "Dewi Lestari", tipe_penjamin: "umum", alamat: "Jl. Anggrek No. 8", email: "dewi@example.com" },
  { no_rm: "RM005", nama: "Eko Prasetyo", tipe_penjamin: "bpjs", no_bpjs: "000111222333", alamat: "Jl. Kamboja No. 3", email: "eko@example.com" },
  { no_rm: "RM006", nama: "Farida Utami", tipe_penjamin: "umum", alamat: "Jl. Kenanga No. 7", email: "farida@example.com" },
  { no_rm: "RM007", nama: "Guntur Saputra", tipe_penjamin: "bpjs", no_bpjs: "000444555666", alamat: "Jl. Dahlia No. 10", email: "guntur@example.com" },
  { no_rm: "RM008", nama: "Hanny Puspita", tipe_penjamin: "umum", alamat: "Jl. Flamboyan No. 2", email: "hanny@example.com" },
  { no_rm: "RM009", nama: "Indra Kusuma", tipe_penjamin: "bpjs", no_bpjs: "000777888999", alamat: "Jl. Sakura No. 4", email: "indra@example.com" },
  { no_rm: "RM010", nama: "Joko Susilo", tipe_penjamin: "umum", alamat: "Jl. Tulip No. 6", email: "joko@example.com" },
];

export const seedPasienData = async () => {
  for (const p of PASIEN_DUMMY) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, p.email!, "password123");
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email: p.email,
        nama: p.nama,
        role: "pasien",
        uid: uid
      });

      await setDoc(doc(db, "pasien", uid), {
        ...p,
        id: uid
      });

      await signOut(auth);
    } catch (error: any) {
      console.error(`Error seeding ${p.nama}:`, error.message);
    }
  }
};

export const seedInitialData = async (uids: { manager: string; kasir: string; pasien: string }) => {
  const batch = writeBatch(db);

  batch.set(doc(db, "users", uids.manager), {
    nama: "Admin Manager",
    role: "manajer",
    email: "manager@sirs.com",
    uid: uids.manager
  });

  batch.set(doc(db, "users", uids.kasir), {
    nama: "Kasir Utama",
    role: "kasir",
    email: "kasir@sirs.com",
    uid: uids.kasir
  });

  batch.set(doc(db, "users", uids.pasien), {
    nama: "Pasien Test",
    role: "pasien",
    email: "pasien@sirs.com",
    uid: uids.pasien
  });

  batch.set(doc(db, "pasien", uids.pasien), {
    id: uids.pasien,
    no_rm: "RM-999",
    nama: "Pasien Test",
    tipe_penjamin: "bpjs",
    no_bpjs: "000888999111",
    alamat: "Jl. Testing No. 123",
    email: "pasien@sirs.com"
  });

  const tagihanRef = doc(collection(db, "tagihan"));
  batch.set(tagihanRef, {
    id_tagihan: `INV-INIT-${Date.now()}`,
    pasien_id: uids.pasien,
    poli: "Poli Umum",
    tanggal: new Date().toISOString().split('T')[0],
    status: "pending",
    total_biaya: 250000,
    rincian: [
      { 
        id_rincian: "R-INIT-1", 
        nama_layanan: "Konsultasi Umum", 
        jenis: "medis", 
        jumlah: 1, 
        subtotal: 150000,
        is_covered_bpjs: true 
      },
      { 
        id_rincian: "R-INIT-2", 
        nama_layanan: "Paracetamol", 
        jenis: "obat", 
        jumlah: 10, 
        subtotal: 100000,
        is_covered_bpjs: true 
      }
    ]
  });

  await batch.commit();
};

export const seedDemoPasien = async () => {
  const batch = writeBatch(db);
  const demoPasienData = [
    { id: "DEMO-PASIEN-001", no_rm: "RM001", nama: "Budi Santoso", tipe_penjamin: "bpjs", no_bpjs: "000123456789", alamat: "Jl. Merdeka No. 1" },
    { id: "DEMO-PASIEN-002", no_rm: "RM002", nama: "Siti Aminah", tipe_penjamin: "umum", alamat: "Jl. Mawar No. 12" },
    { id: "DEMO-PASIEN-003", no_rm: "RM003", nama: "Andi Wijaya", tipe_penjamin: "bpjs", no_bpjs: "000987654321", alamat: "Jl. Melati No. 5" },
    { id: "DEMO-PASIEN-004", no_rm: "RM004", nama: "Dewi Lestari", tipe_penjamin: "umum", alamat: "Jl. Anggrek No. 8" },
    { id: "DEMO-PASIEN-005", no_rm: "RM005", nama: "Eko Prasetyo", tipe_penjamin: "bpjs", no_bpjs: "000111222333", alamat: "Jl. Kamboja No. 3" },
  ];
  demoPasienData.forEach(p => {
    batch.set(doc(db, "pasien", p.id), p);
  });
  await batch.commit();
};

export const seedTransaksiSampleData = async () => {
  const TAGIHAN_SAMPLE = [
    { id_tagihan: "INV-2024-001", pasien_id: "DEMO-PASIEN-001", poli: "Poli Jantung", tanggal: "2024-05-01", status: "lunas" as const, total_biaya: 0 },
    { id_tagihan: "INV-2024-002", pasien_id: "DEMO-PASIEN-002", poli: "Poli Umum", tanggal: "2024-05-02", status: "lunas" as const, total_biaya: 285000 },
    { id_tagihan: "INV-2024-003", pasien_id: "DEMO-PASIEN-003", poli: "Poli Anak", tanggal: "2024-05-05", status: "pending" as const, total_biaya: 0 },
    { id_tagihan: "INV-2024-004", pasien_id: "DEMO-PASIEN-004", poli: "Poli Gigi", tanggal: "2024-05-08", status: "lunas" as const, total_biaya: 545000 },
    { id_tagihan: "INV-2024-005", pasien_id: "DEMO-PASIEN-005", poli: "Poli Penyakit Dalam", tanggal: "2024-05-10", status: "pending" as const, total_biaya: 0 },
    { id_tagihan: "INV-2024-006", pasien_id: "DEMO-PASIEN-001", poli: "Poli Syaraf", tanggal: "2024-05-12", status: "gagal" as const, total_biaya: 150000 },
    { id_tagihan: "INV-2024-007", pasien_id: "DEMO-PASIEN-002", poli: "UGD", tanggal: "2024-05-15", status: "lunas" as const, total_biaya: 285000 },
    { id_tagihan: "INV-2024-008", pasien_id: "DEMO-PASIEN-003", poli: "Poli Mata", tanggal: "2024-05-18", status: "pending" as const, total_biaya: 55000 },
  ];

  const RINCI_TAGIHAN_SAMPLE = [
    { id_rincian: "RIN-001-A", id_tagihan: "INV-2024-001", id_layanan_medis: MASTER_LAYANAN_MEDIS[1].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[1].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 150000, tanggal: "2024-05-01" },
    { id_rincian: "RIN-002-A", id_tagihan: "INV-2024-002", id_layanan_medis: MASTER_LAYANAN_MEDIS[0].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[0].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 50000, tanggal: "2024-05-02" },
    { id_rincian: "RIN-002-B", id_tagihan: "INV-2024-002", id_layanan_labor: MASTER_LAYANAN_LABOR[0].id_layanan_labor, nama_layanan: MASTER_LAYANAN_LABOR[0].nama_layanan, jenis: "laboratorium", jumlah: 1, subtotal: 85000, tanggal: "2024-05-02" },
    { id_rincian: "RIN-002-C", id_tagihan: "INV-2024-002", id_obat: MASTER_OBAT[0].id_obat, nama_layanan: MASTER_OBAT[0].nama_obat, jenis: "obat", jumlah: 10, subtotal: 150000, tanggal: "2024-05-02" },
    { id_rincian: "RIN-003-A", id_tagihan: "INV-2024-003", id_layanan_medis: MASTER_LAYANAN_MEDIS[15].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[15].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 150000, tanggal: "2024-05-05" },
    { id_rincian: "RIN-003-B", id_tagihan: "INV-2024-003", id_obat: MASTER_OBAT[2].id_obat, nama_layanan: MASTER_OBAT[2].nama_obat, jenis: "obat", jumlah: 1, subtotal: 25000, tanggal: "2024-05-05" },
    { id_rincian: "RIN-004-A", id_tagihan: "INV-2024-004", id_layanan_medis: MASTER_LAYANAN_MEDIS[3].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[3].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 500000, tanggal: "2024-05-08" },
    { id_rincian: "RIN-004-B", id_tagihan: "INV-2024-004", id_obat: MASTER_OBAT[5].id_obat, nama_layanan: MASTER_OBAT[5].nama_obat, jenis: "obat", jumlah: 6, subtotal: 45000, tanggal: "2024-05-08" },
    { id_rincian: "RIN-005-A", id_tagihan: "INV-2024-005", id_layanan_medis: MASTER_LAYANAN_MEDIS[1].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[1].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 150000, tanggal: "2024-05-10" },
    { id_rincian: "RIN-005-B", id_tagihan: "INV-2024-005", id_layanan_labor: MASTER_LAYANAN_LABOR[5].id_layanan_labor, nama_layanan: MASTER_LAYANAN_LABOR[5].nama_layanan, jenis: "laboratorium", jumlah: 1, subtotal: 90000, tanggal: "2024-05-10" },
    { id_rincian: "RIN-005-C", id_tagihan: "INV-2024-005", id_layanan_labor: MASTER_LAYANAN_LABOR[6].id_layanan_labor, nama_layanan: MASTER_LAYANAN_LABOR[6].nama_layanan, jenis: "laboratorium", jumlah: 1, subtotal: 85000, tanggal: "2024-05-10" },
    { id_rincian: "RIN-005-D", id_tagihan: "INV-2024-005", id_obat: MASTER_OBAT[8].id_obat, nama_layanan: MASTER_OBAT[8].nama_obat, jenis: "obat", jumlah: 30, subtotal: 180000, tanggal: "2024-05-10" },
    { id_rincian: "RIN-006-A", id_tagihan: "INV-2024-006", id_layanan_medis: MASTER_LAYANAN_MEDIS[1].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[1].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 150000, tanggal: "2024-05-12" },
    { id_rincian: "RIN-007-A", id_tagihan: "INV-2024-007", id_layanan_medis: MASTER_LAYANAN_MEDIS[18].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[18].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 200000, tanggal: "2024-05-15" },
    { id_rincian: "RIN-007-B", id_tagihan: "INV-2024-007", id_layanan_medis: MASTER_LAYANAN_MEDIS[4].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[4].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 25000, tanggal: "2024-05-15" },
    { id_rincian: "RIN-007-C", id_tagihan: "INV-2024-007", id_obat: MASTER_OBAT[16].id_obat, nama_layanan: MASTER_OBAT[16].nama_obat, jenis: "obat", jumlah: 4, subtotal: 60000, tanggal: "2024-05-15" },
    { id_rincian: "RIN-008-A", id_tagihan: "INV-2024-008", id_layanan_medis: MASTER_LAYANAN_MEDIS[16].id_layanan_medis, nama_layanan: MASTER_LAYANAN_MEDIS[16].nama_layanan, jenis: "medis", jumlah: 1, subtotal: 55000, tanggal: "2024-05-18" },
  ];

  const PEMBAYARAN_SAMPLE = [
    { id_pembayaran: "PAY-2024-001", tagihan_id: "INV-2024-001", metode_pembayaran: "qris", jumlah_pembayaran: 150000, cover_bpjs: 150000, iur_biaya: 0, tanggal_pembayaran: "2024-05-01", status: "berhasil" },
    { id_pembayaran: "PAY-2024-002", tagihan_id: "INV-2024-002", metode_pembayaran: "tunai", jumlah_pembayaran: 285000, cover_bpjs: 0, iur_biaya: 285000, tanggal_pembayaran: "2024-05-02", status: "berhasil" },
    { id_pembayaran: "PAY-2024-003", tagihan_id: "INV-2024-004", metode_pembayaran: "transfer", jumlah_pembayaran: 545000, cover_bpjs: 0, iur_biaya: 545000, tanggal_pembayaran: "2024-05-08", status: "berhasil" },
    { id_pembayaran: "PAY-2024-004", tagihan_id: "INV-2024-006", metode_pembayaran: "qris", jumlah_pembayaran: 150000, cover_bpjs: 150000, iur_biaya: 0, tanggal_pembayaran: "2024-05-12", status: "gagal" },
    { id_pembayaran: "PAY-2024-005", tagihan_id: "INV-2024-007", metode_pembayaran: "tunai", jumlah_pembayaran: 285000, cover_bpjs: 0, iur_biaya: 285000, tanggal_pembayaran: "2024-05-15", status: "berhasil" },
  ];

  const batch1 = writeBatch(db);
  TAGIHAN_SAMPLE.forEach(t => {
    batch1.set(doc(db, "tagihan", t.id_tagihan), t);
  });
  RINCI_TAGIHAN_SAMPLE.forEach(r => {
    batch1.set(doc(db, "rinci_tagihan", r.id_rincian), r);
  });
  await batch1.commit();

  const batch2 = writeBatch(db);
  PEMBAYARAN_SAMPLE.forEach(p => {
    batch2.set(doc(db, "pembayaran", p.id_pembayaran), p);
  });
  await batch2.commit();
};
