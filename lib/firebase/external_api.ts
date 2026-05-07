import { db } from "./config";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where 
} from "firebase/firestore";
import { Obat, LayananMedis, LayananLabor, Pasien } from "../types";

/**
 * Simulasi "External API" untuk mengambil data dari modul lain (Farmasi/Lab/Poli)
 * Meskipun di prototype ini kita simpan di Firestore yang sama, fungsinya dipisah
 * seolah-olah mengambil dari API eksternal.
 */

export const fetchObat = async (): Promise<Obat[]> => {
  const querySnapshot = await getDocs(collection(db, "obat"));
  return querySnapshot.docs.map(doc => ({
    id_obat: doc.id,
    ...doc.data()
  })) as Obat[];
};

export const fetchLayananMedis = async (): Promise<LayananMedis[]> => {
  const querySnapshot = await getDocs(collection(db, "layanan_medis"));
  return querySnapshot.docs.map(doc => ({
    id_layanan_medis: doc.id,
    ...doc.data()
  })) as LayananMedis[];
};

export const fetchLayananLabor = async (): Promise<LayananLabor[]> => {
  const querySnapshot = await getDocs(collection(db, "layanan_labor"));
  return querySnapshot.docs.map(doc => ({
    id_layanan_labor: doc.id,
    ...doc.data()
  })) as LayananLabor[];
};

export const fetchPasienByRM = async (no_rm: string): Promise<Pasien | null> => {
  const q = query(collection(db, "pasien"), where("no_rm", "==", no_rm));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Pasien;
};

export const fetchAllPasien = async (): Promise<Pasien[]> => {
  const querySnapshot = await getDocs(collection(db, "pasien"));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Pasien[];
};
