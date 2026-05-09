import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase/config";
import { getUserRole, getUserProfile } from "../firebase/auth";
import { UserRole } from "../types";

interface AuthState {
  user: FirebaseUser | null;
  role: UserRole | null;
  profile: any | null;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const [role, profile] = await Promise.all([
          getUserRole(user.uid),
          getUserProfile(user.uid)
        ]);
        setState({ user, role, profile, loading: false });
      } else {
        setState({ user: null, role: null, profile: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
};