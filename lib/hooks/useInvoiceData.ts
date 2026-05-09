import { useState, useEffect } from "react";
import { Tagihan, RincianTagihan, Pasien } from "@/lib/types";
import { getRinciTagihanByTagihan, getData } from "@/lib/firebase/firestore";

export const useInvoiceData = (tagihan: Tagihan | null, isOpen: boolean) => {
  const [loading, setLoading] = useState(false);
  const [rincian, setRincian] = useState<RincianTagihan[]>([]);
  const [pasien, setPasien] = useState<Pasien | null>(null);

  useEffect(() => {
    if (!isOpen || !tagihan) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const pData = await getData("pasien", tagihan.pasien_id) as Pasien;
        setPasien(pData);

        if (tagihan.rincian && tagihan.rincian.length > 0) {
          setRincian(tagihan.rincian);
        } else {
          const data = await getRinciTagihanByTagihan(tagihan.id_tagihan);
          setRincian(data);
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, tagihan]);

  return { rincian, pasien, loading };
};
