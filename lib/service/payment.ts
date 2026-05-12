import { doc, getDoc, writeBatch, serverTimestamp, collection, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Tagihan, Pembayaran, RincianTagihan, RincianPembayaran } from "../types";
import { createLog } from "../firebase/firestore";

export const prosesPembayaran = async (
  tagihan: Tagihan,
  metode: "tunai" | "qris" | "transfer",
  rincian: RincianTagihan[],
  kasir?: { uid: string; nama: string }
) => {
  const idPembayaran = `PAY-${Date.now()}`;

  const pasienSnap = await getDoc(doc(db, "pasien", tagihan.pasien_id));
  const isBpjs = pasienSnap.exists() && pasienSnap.data().tipe_penjamin === "bpjs";

  let totalCoverBpjs = 0;
  let totalIurBiaya = 0;

  (rincian ?? []).forEach(item => {
    if (isBpjs && item.is_covered_bpjs) {
      totalCoverBpjs += item.subtotal;
    } else {
      totalIurBiaya += item.subtotal;
    }
  });

  const jumlahPembayaran = totalIurBiaya;

  const batch = writeBatch(db);

  const newPembayaran: Pembayaran = {
    id_pembayaran: idPembayaran,
    tagihan_id: tagihan.id_tagihan,
    metode_pembayaran: metode,
    tanggal_pembayaran: new Date().toISOString(),
    jumlah_pembayaran: jumlahPembayaran,
    cover_bpjs: totalCoverBpjs,
    iur_biaya: totalIurBiaya,
    status: "berhasil",
    id_kasir: kasir?.uid,
    nama_kasir: kasir?.nama
  };

  batch.set(doc(db, "pembayaran", idPembayaran), {
    ...newPembayaran,
    createdAt: serverTimestamp()
  });

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

  batch.update(doc(db, "tagihan", tagihan.id_tagihan), {
    status: "lunas",
    total_biaya: jumlahPembayaran,
    cover_bpjs: totalCoverBpjs,
    updatedAt: serverTimestamp()
  });

  if (kasir) {
    await createLog({
      userId: kasir.uid,
      userName: kasir.nama,
      userRole: "kasir",
      action: "Proses Pembayaran",
      details: `Memproses pembayaran ${metode.toUpperCase()} untuk Tagihan #${tagihan.id_tagihan} senilai ${jumlahPembayaran}`
    });
  }

  await batch.commit();
  return newPembayaran;
};