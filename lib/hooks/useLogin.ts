import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/firebase/auth";

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogin = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);

    try {
      const { role } = await loginWithEmail(email, pass);
      
      const routes = {
        kasir: "/kasir",
        manajer: "/manager",
        pasien: "/pasien",
        developer: "/seed"
      };

      router.push(routes[role as keyof typeof routes] || "/pasien");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        setError("Email atau password salah.");
      } else {
        setError("Gagal masuk. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { performLogin, loading, error, setError };
};
