import { doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const seedInitialData = async (uids: { manager: string; kasir: string; pasien: string }) => {
  const batch = writeBatch(db);

  // 1. Tambahkan ke koleksi 'users' agar bisa login dan punya role
  const users = [
    { 
      uid: uids.manager, 
      email: "manager@rs.com", 
      nama: "Manager Keuangan", 
      role: "manajer" 
    },
    { 
      uid: uids.kasir, 
      email: "kasir@rs.com", 
      nama: "Kasir Utama", 
      role: "kasir" 
    },
    { 
      uid: uids.pasien, 
      email: "budi@pasien.com", 
      nama: "Budi Santoso", 
      role: "pasien" 
    },
  ];

  users.forEach((u) => {
    batch.set(doc(db, "users", u.uid), { 
      ...u, 
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  });

  // 2. Tambahkan data medis ke koleksi 'pasien' (Terhubung ke UID Pasien)
  batch.set(doc(db, "pasien", uids.pasien), {
    no_rm: "00-11-22",
    nama: "Budi Santoso",
    tipe_penjamin: "bpjs",
    no_bpjs: "000123456789"
  });

  // 3. Tambahkan beberapa data tagihan contoh
  const tagihan = [
    {
      id: "INV-20240501-01",
      pasien_id: uids.pasien,
      poli: "Poli Jantung",
      total_biaya: 750000,
      status: "pending",
      tanggal: "01 Mei 2024",
      rincian: [
        { id_rincian: "R1", jenis: "tindakan", nama_layanan: "EKG", jumlah: 1, subtotal: 250000, is_covered_bpjs: true },
        { id_rincian: "R2", jenis: "obat", nama_layanan: "Amlodipine", jumlah: 30, subtotal: 500000, is_covered_bpjs: false },
      ]
    },
    {
      id: "INV-20240501-02",
      pasien_id: uids.pasien,
      poli: "Poli Umum",
      total_biaya: 150000,
      status: "lunas",
      tanggal: "02 Mei 2024",
      rincian: [
        { id_rincian: "R3", jenis: "konsultasi", nama_layanan: "Konsultasi Dokter", jumlah: 1, subtotal: 150000, is_covered_bpjs: false },
      ]
    }
  ];

  tagihan.forEach((t) => {
    batch.set(doc(db, "tagihan", t.id), {
      ...t,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
};
