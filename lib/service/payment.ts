import { doc, setDoc, writeBatch, serverTimestamp, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { Tagihan, Pembayaran, RincianPembayaran } from "../types";

export const prosesPembayaran = async (tagihan: Tagihan, metode: "tunai" | "qris" | "transfer") => {
  try {
    const batch = writeBatch(db);
    const idPembayaran = `PAY-${Date.now()}`;
    
    // 1. Hitung Cover BPJS vs Iur Biaya
    let totalCoverBpjs = 0;
    let totalIurBiaya = 0;
    
    tagihan.rincian.forEach(item => {
      if (item.is_covered_bpjs) {
        totalCoverBpjs += item.subtotal;
      } else {
        totalIurBiaya += item.subtotal;
      }
    });

    // 2. Buat Record Pembayaran
    const newPembayaran: Pembayaran = {
      id_pembayaran: idPembayaran,
      tagihan_id: tagihan.id_tagihan,
      metode_pembayaran: metode,
      tanggal_pembayaran: new Date().toISOString(),
      jumlah_pembayaran: tagihan.total_biaya,
      cover_bpjs: totalCoverBpjs,
      iur_biaya: totalIurBiaya,
      status: "berhasil"
    };

    const payRef = doc(db, "pembayaran", idPembayaran);
    batch.set(payRef, {
      ...newPembayaran,
      createdAt: serverTimestamp()
    });

    // 3. Buat Rincian Pembayaran
    tagihan.rincian.forEach((item, index) => {
      const idRincianPay = `${idPembayaran}-R-${index}`;
      const rincianPayRef = doc(db, "rincian_pembayaran", idRincianPay);
      
      const rincianData: RincianPembayaran = {
        id_rincian_pembayaran: idRincianPay,
        pembayaran_id: idPembayaran,
        nama_item: item.nama_layanan,
        jumlah: item.jumlah,
        subtotal: item.subtotal
      };
      
      batch.set(rincianPayRef, rincianData);
    });

    // 4. Update Status Tagihan
    const tagihanRef = doc(db, "tagihan", tagihan.id_tagihan);
    batch.update(tagihanRef, { status: "lunas" });

    await batch.commit();
    return newPembayaran;

  } catch (error) {
    console.error("Gagal memproses pembayaran:", error);
    throw error;
  }
};
