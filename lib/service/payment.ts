import { doc, getDoc, writeBatch, serverTimestamp, collection, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Tagihan, Pembayaran, RincianTagihan, RincianPembayaran } from "../types";

/**
 * prosesPembayaran
 *
 * Menerima rincian yang sudah di-fetch dari InvoiceModal (bisa dari embedded atau
 * koleksi rinci_tagihan). Mengambil data pasien untuk menentukan tipe penjamin
 * sehingga perhitungan cover_bpjs dan iur_biaya akurat.
 */
export const prosesPembayaran = async (
  tagihan: Tagihan,
  metode: "tunai" | "qris" | "transfer",
  rincian: RincianTagihan[]
) => {
  const idPembayaran = `PAY-${Date.now()}`;

  // Ambil tipe penjamin dari data pasien
  const pasienSnap = await getDoc(doc(db, "pasien", tagihan.pasien_id));
  const isBpjs = pasienSnap.exists() && pasienSnap.data().tipe_penjamin === "bpjs";

  // Hitung cover BPJS dan iur biaya
  let totalCoverBpjs = 0;
  let totalIurBiaya = 0;

  (rincian ?? []).forEach(item => {
    if (isBpjs && item.is_covered_bpjs) {
      totalCoverBpjs += item.subtotal;
    } else {
      totalIurBiaya += item.subtotal;
    }
  });

  const jumlahPembayaran = totalIurBiaya; // Yang dibayar pasien

  const batch = writeBatch(db);

  // Simpan pembayaran
  const newPembayaran: Pembayaran = {
    id_pembayaran: idPembayaran,
    tagihan_id: tagihan.id_tagihan,
    metode_pembayaran: metode,
    tanggal_pembayaran: new Date().toISOString(),
    jumlah_pembayaran: jumlahPembayaran,
    cover_bpjs: totalCoverBpjs,
    iur_biaya: totalIurBiaya,
    status: "berhasil"
  };

  batch.set(doc(db, "pembayaran", idPembayaran), {
    ...newPembayaran,
    createdAt: serverTimestamp()
  });

  // Simpan rincian_pembayaran
  (rincian ?? []).forEach((item, index) => {
    const idRincianPay = `${idPembayaran}-R-${index}`;
    const rincianData: RincianPembayaran = {
      id_rincian_pembayaran: idRincianPay,
      pembayaran_id: idPembayaran,
      nama_item: item.nama_layanan,
      jumlah: item.jumlah,
      subtotal: item.subtotal
    };
    batch.set(doc(db, "rincian_pembayaran", idRincianPay), rincianData);
  });

  // Update tagihan: status lunas + simpan total yang benar
  batch.update(doc(db, "tagihan", tagihan.id_tagihan), {
    status: "lunas",
    total_biaya: jumlahPembayaran,
    cover_bpjs: totalCoverBpjs,
    updatedAt: serverTimestamp()
  });

  await batch.commit();
  return newPembayaran;
};