import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  getAuth
} from "firebase/auth";
import { initializeApp, deleteApp, getApps } from "firebase/app";
import { auth, db, firebaseConfig } from "./config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserRole } from "../types";

const googleProvider = new GoogleAuthProvider();

export const syncUserWithFirestore = async (user: FirebaseUser, customData: any = {}) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const role = customData.role || "pasien";
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      nama: customData.nama || user.displayName || user.email?.split("@")[0] || "User",
      role: role as UserRole,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      ...customData
    });
    return role as UserRole;
  } else {
    const userData = userSnap.data();
    await setDoc(userRef, {
      lastLogin: serverTimestamp(),
    }, { merge: true });
    return userData.role as UserRole;
  }
};

export const registerStaff = async (email: string, pass: string, nama: string, role: UserRole) => {
  const secondaryApp = getApps().find(a => a.name === "secondary") || initializeApp(firebaseConfig, "secondary");
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const result = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      nama: nama,
      role: role,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    await deleteApp(secondaryApp);
    return user;
  } catch (error) {
    console.error("Error registerStaff:", error);
    await deleteApp(secondaryApp);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const role = await syncUserWithFirestore(result.user);
    return { user: result.user, role };
  } catch (error) {
    console.error("Error loginWithEmail:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const role = await syncUserWithFirestore(result.user);
    return { user: result.user, role };
  } catch (error) {
    console.error("Error loginWithGoogle:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logout:", error);
    throw error;
  }
};

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data().role as UserRole) : null;
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};