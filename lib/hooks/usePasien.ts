import { useState, useEffect } from "react";
import { getAllPasien, getPasienDetail } from "@/lib/firebase/firestore";
import { Pasien } from "@/lib/types";

export const usePasien = () => {
  const [pasiens, setPasiens] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPasiens = async () => {
    setLoading(true);
    try {
      const data = await getAllPasien();
      setPasiens(data);
    } catch (err) {
      setError("Gagal mengambil data pasien");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasiens();
  }, []);

  return { pasiens, loading, error, refresh: fetchPasiens };
};

export const usePasienDetail = (id: string) => {
  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPasienDetail(id);
        setPasien(data);
      } catch (err) {
        setError("Gagal mengambil detail pasien");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { pasien, loading, error };
};
