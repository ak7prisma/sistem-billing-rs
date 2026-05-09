import { useState, useEffect } from "react";
import { getAllTagihan, getTagihanByPasien, getTagihanById } from "@/lib/firebase/firestore";
import { Tagihan } from "@/lib/types";

export const useTagihans = () => {
  const [tagihans, setTagihans] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllTagihan();
      setTagihans(data);
    } catch (err) {
      setError("Gagal mengambil data tagihan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { tagihans, loading, error, refresh: fetchData };
};

export const useTagihanByPasien = (pasienId: string) => {
  const [history, setHistory] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!pasienId) return;
    setLoading(true);
    try {
      const data = await getTagihanByPasien(pasienId);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pasienId]);

  return { history, loading, refresh: fetchData };
};

export const useTagihanDetail = (tagihanId: string) => {
  const [tagihan, setTagihan] = useState<Tagihan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tagihanId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTagihanById(tagihanId);
        setTagihan(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tagihanId]);

  return { tagihan, loading };
};