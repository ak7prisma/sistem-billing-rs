import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase/config";
import { getUserRole } from "../firebase/auth";
import { UserRole } from "../types";

interface AuthState {
  user: FirebaseUser | null;
  role: UserRole | null;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setState({ user, role, loading: false });
      } else {
        setState({ user: null, role: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
};
