import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { Tagihan, RincianTagihan, Pasien } from "../types";
import { fetchExternalMedis, fetchExternalLab, fetchExternalFarmasi } from "./externalModule";

export const konsolidasiTagihan = async (pasienId: string, kunjunganId: string, poli: string) => {
  try {
    const pasienSnap = await getDoc(doc(db, "pasien", pasienId));
    const pasienData = pasienSnap.exists() ? pasienSnap.data() as Pasien : null;
    const isBpjs = pasienData?.tipe_penjamin === "bpjs";

    const [medis, lab, farmasi] = await Promise.all([
      fetchExternalMedis(kunjunganId),
      fetchExternalLab(kunjunganId),
      fetchExternalFarmasi(kunjunganId)
    ]);

    const rincianGabungan: RincianTagihan[] = [...medis, ...lab, ...farmasi].map(item => ({
      ...item,
      is_covered_bpjs: isBpjs ? item.is_covered_bpjs : false
    }));

    const totalIurBiaya = rincianGabungan.reduce((sum, item) => {
      const itemIur = item.is_covered_bpjs ? 0 : item.subtotal;
      return sum + itemIur;
    }, 0);

    const idTagihan = `INV-${new Date().getTime()}`;
    const newTagihan: Tagihan = {
      id_tagihan: idTagihan,
      pasien_id: pasienId,
      tanggal: new Date().toISOString().split('T')[0],
      status: "pending",
      total_biaya: totalIurBiaya,
      poli: poli,
      rincian: rincianGabungan
    };

    await setDoc(doc(db, "tagihan", idTagihan), {
      ...newTagihan,
      createdAt: serverTimestamp()
    });

    return newTagihan;
  } catch (error) {
    console.error("Gagal melakukan konsolidasi:", error);
    throw error;
  }
};

