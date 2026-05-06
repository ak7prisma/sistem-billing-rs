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
  Timestamp
} from "firebase/firestore";
import { db } from "./config";
import { Tagihan, Pasien, Pembayaran } from "../types";

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

export const getTagihanByPasien = async (pasienId: string) => {
  const q = query(
    collection(db, "tagihan"), 
    where("pasien_id", "==", pasienId),
    orderBy("tanggal", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tagihan));
};

export const getAllTagihan = async () => {
  const q = query(collection(db, "tagihan"), orderBy("tanggal", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tagihan));
};

export const updateTagihanStatus = async (tagihanId: string, status: string) => {
  const docRef = doc(db, "tagihan", tagihanId);
  return await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
};

export const savePembayaran = async (pembayaran: Partial<Pembayaran>) => {
  return await addDoc(collection(db, "pembayaran"), {
    ...pembayaran,
    tanggal_pembayaran: serverTimestamp(),
  });
};
