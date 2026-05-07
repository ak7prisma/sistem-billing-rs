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

export const getAllData = async (collectionName: string) => {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }));
};

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
    where("pasien_id", "==", pasienId)
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(doc => ({ 
    id_tagihan: doc.id, 
    ...doc.data() 
  } as Tagihan));

  // Sort manual di client (untuk menghindari requirement index Firestore)
  return data.sort((a, b) => {
    const dateA = a.createdAt?.seconds || new Date(a.tanggal).getTime();
    const dateB = b.createdAt?.seconds || new Date(b.tanggal).getTime();
    return dateB - dateA;
  });
};

export const getTagihanById = async (tagihanId: string) => {
  const docRef = doc(db, "tagihan", tagihanId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id_tagihan: docSnap.id, ...docSnap.data() } as Tagihan;
  }
  return null;
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

export const getRinciTagihanByTagihan = async (tagihanId: string): Promise<RincianTagihan[]> => {
  const q = query(collection(db, "rinci_tagihan"), where("id_tagihan", "==", tagihanId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id_rincian: d.id, ...d.data() } as RincianTagihan));
};

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
export const getAllPembayaran = async () => {
  const q = query(collection(db, "pembayaran"), orderBy("tanggal_pembayaran", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id_pembayaran: doc.id, 
    ...doc.data() 
  } as Pembayaran));
};

export const getAllPasien = async () => {
  const pasienSnap = await getDocs(query(collection(db, "pasien"), orderBy("nama", "asc")));
  const usersSnap = await getDocs(query(collection(db, "users"), where("role", "==", "pasien")));
  
  const usersMap = new Map();
  usersSnap.forEach(doc => usersMap.set(doc.id, doc.data()));

  return pasienSnap.docs.map(doc => {
    const data = doc.data();
    const userData = usersMap.get(doc.id) || {};
    return { 
      id: doc.id,
      ...data,
      ...userData 
    } as Pasien;
  });
};

export const getPasienDetail = async (id: string) => {
  const [pasienSnap, userSnap] = await Promise.all([
    getDoc(doc(db, "pasien", id)),
    getDoc(doc(db, "users", id))
  ]);

  if (!pasienSnap.exists()) return null;

  return {
    id: pasienSnap.id,
    ...pasienSnap.data(),
    ...(userSnap.exists() ? userSnap.data() : {})
  } as Pasien;
};
