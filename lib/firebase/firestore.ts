import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "./config";
import { Tagihan, Pasien, Pembayaran, RincianTagihan } from "../types";

export const addData = async (collectionName: string, data: any) => {
  return await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const setData = async (collectionName: string, id: string, data: any) => {
  return await setDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const getData = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Tagihan Helpers
export const createTagihan = async (tagihan: Omit<Tagihan, "id_tagihan">) => {
  return await addDoc(collection(db, "tagihan"), {
    ...tagihan,
    tanggal: serverTimestamp(),
    status: tagihan.status || "pending",
  });
};

export const getTagihanByPasien = async (pasienId: string) => {
  const q = query(
    collection(db, "tagihan"), 
    where("pasien_id", "==", pasienId),
    orderBy("tanggal", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id_tagihan: doc.id, 
    ...doc.data() 
  } as Tagihan));
};

export const getAllTagihan = async () => {
  const q = query(collection(db, "tagihan"), orderBy("tanggal", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id_tagihan: doc.id, 
    ...doc.data() 
  } as Tagihan));
};

export const updateTagihanStatus = async (tagihanId: string, status: Tagihan["status"]) => {
  const docRef = doc(db, "tagihan", tagihanId);
  return await updateDoc(docRef, { 
    status, 
    updatedAt: serverTimestamp() 
  });
};

// Rinci Tagihan Helpers
export const getRinciTagihanByTagihan = async (tagihanId: string): Promise<RincianTagihan[]> => {
  const q = query(collection(db, "rinci_tagihan"), where("id_tagihan", "==", tagihanId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id_rincian: d.id, ...d.data() } as RincianTagihan));
};

// Pembayaran Helpers
export const processPembayaran = async (pembayaran: Omit<Pembayaran, "id_pembayaran" | "tanggal_pembayaran">) => {
  const batch = writeBatch(db);
  
  const pembayaranRef = doc(collection(db, "pembayaran"));
  batch.set(pembayaranRef, {
    ...pembayaran,
    tanggal_pembayaran: serverTimestamp(),
    status: "berhasil"
  });

  const tagihanRef = doc(db, "tagihan", pembayaran.tagihan_id);
  batch.update(tagihanRef, { status: "lunas", updatedAt: serverTimestamp() });

  await batch.commit();
  return pembayaranRef.id;
};

export const getPembayaranByTagihan = async (tagihanId: string) => {
  const q = query(collection(db, "pembayaran"), where("tagihan_id", "==", tagihanId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id_pembayaran: doc.id, ...doc.data() } as Pembayaran;
};

