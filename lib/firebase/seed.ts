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
];

export const seedPasienData = async () => {
  for (const p of PASIEN_DUMMY) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, p.email!, "password123");
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), { email: p.email, nama: p.nama, role: "pasien", uid });
      await setDoc(doc(db, "pasien", uid), { ...p, id: uid });
      await signOut(auth);
    } catch (error: any) {
      console.error(`Error seeding ${p.nama}:`, error.message);
    }
  }
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
    { id_tagihan: "INV-2024-001", pasien_id: "DEMO-PASIEN-001", poli: "Poli Jantung", tanggal: "2024-05-01", status: "lunas" as const },
    { id_tagihan: "INV-2024-002", pasien_id: "DEMO-PASIEN-002", poli: "Poli Umum", tanggal: "2024-05-02", status: "lunas" as const },
    { id_tagihan: "INV-2024-003", pasien_id: "DEMO-PASIEN-003", poli: "Poli Anak", tanggal: "2024-05-05", status: "pending" as const },
    { id_tagihan: "INV-2024-004", pasien_id: "DEMO-PASIEN-004", poli: "Poli Gigi", tanggal: "2024-05-08", status: "lunas" as const },
    { id_tagihan: "INV-2024-005", pasien_id: "DEMO-PASIEN-005", poli: "Poli Penyakit Dalam", tanggal: "2024-05-10", status: "pending" as const },
  ];

  const RINCI_TAGIHAN_RAW = [
    { id_tagihan: "INV-2024-001", master: MASTER_LAYANAN_MEDIS[1], qty: 1 },
    
    { id_tagihan: "INV-2024-002", master: MASTER_LAYANAN_MEDIS[0], qty: 1 },
    { id_tagihan: "INV-2024-002", master: MASTER_LAYANAN_LABOR[0], qty: 1 },
    { id_tagihan: "INV-2024-002", master: MASTER_OBAT[0], qty: 10 },

    { id_tagihan: "INV-2024-003", master: MASTER_LAYANAN_MEDIS[15], qty: 1 },
    { id_tagihan: "INV-2024-003", master: MASTER_OBAT[2], qty: 1 },

    { id_tagihan: "INV-2024-004", master: MASTER_LAYANAN_MEDIS[3], qty: 1 },
    { id_tagihan: "INV-2024-004", master: MASTER_OBAT[5], qty: 6 },

    { id_tagihan: "INV-2024-005", master: MASTER_LAYANAN_MEDIS[1], qty: 1 },
    { id_tagihan: "INV-2024-005", master: MASTER_LAYANAN_LABOR[5], qty: 1 },
    { id_tagihan: "INV-2024-005", master: MASTER_LAYANAN_LABOR[6], qty: 1 },
    { id_tagihan: "INV-2024-005", master: MASTER_OBAT[8], qty: 30 },
  ];

  const batch = writeBatch(db);
  const tagihanTotals: Record<string, { iur: number; cover: number }> = {};

  RINCI_TAGIHAN_RAW.forEach((r, idx) => {
    const tid = r.id_tagihan;
    const isBpjs = SEED_PASIEN_TIPE[TAGIHAN_SAMPLE.find(t => t.id_tagihan === tid)?.pasien_id || ""] === "bpjs";
    const covered = isBpjs && r.master.is_covered_bpjs;
    const subtotal = r.master.harga * r.qty;

    if (!tagihanTotals[tid]) tagihanTotals[tid] = { iur: 0, cover: 0 };
    if (covered) tagihanTotals[tid].cover += subtotal;
    else tagihanTotals[tid].iur += subtotal;

    const idRincian = `RIN-${tid}-${idx}`;
    const m = r.master as any;
    
    batch.set(doc(db, "rinci_tagihan", idRincian), {
      id_rincian: idRincian,
      id_tagihan: tid,
      nama_layanan: m.nama_obat || m.nama_layanan,
      jenis: m.id_obat ? "obat" : (m.id_layanan_medis ? "medis" : "laboratorium"),
      jumlah: r.qty,
      subtotal: subtotal,
      is_covered_bpjs: covered,
      tanggal: TAGIHAN_SAMPLE.find(t => t.id_tagihan === tid)?.tanggal
    });
  });

  TAGIHAN_SAMPLE.forEach(t => {
    const totals = tagihanTotals[t.id_tagihan] || { iur: 0, cover: 0 };
    batch.set(doc(db, "tagihan", t.id_tagihan), {
      ...t,
      total_biaya: totals.iur,
      cover_bpjs: totals.cover
    });
  });

  await batch.commit();
};
