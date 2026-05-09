import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  User as FirebaseUser
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserRole } from "../types";

const googleProvider = new GoogleAuthProvider();

export const syncUserWithFirestore = async (user: FirebaseUser) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      nama: user.displayName || user.email?.split("@")[0] || "User",
      role: "pasien" as UserRole,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
    return "pasien" as UserRole;
  } else {
    const userData = userSnap.data();
    await setDoc(userRef, {
      lastLogin: serverTimestamp(),
    }, { merge: true });
    return userData.role as UserRole;
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