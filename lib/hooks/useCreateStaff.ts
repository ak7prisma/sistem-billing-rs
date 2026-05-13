import { useState } from "react";
import { registerStaff } from "@/lib/firebase/auth";
import { UserRole } from "@/lib/types";

export function useCreateStaff() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nama: "",
    role: "kasir" as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerStaff(formData.email, formData.password, formData.nama, formData.role);
      setSuccess(true);
      setFormData({ email: "", password: "", nama: "", role: "kasir" });
    } catch (err: any) {
      setError(err.message || "Gagal membuat akun. Pastikan email belum terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  const resetSuccess = () => setSuccess(false);

  return {
    formData,
    setFormData,
    loading,
    success,
    error,
    handleSubmit,
    resetSuccess
  };
}