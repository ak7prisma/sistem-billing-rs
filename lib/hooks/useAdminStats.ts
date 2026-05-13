import { useState, useEffect } from "react";
import { getAllUsers } from "@/lib/firebase/firestore";

export function useAdminStats() {
  const [userStats, setUserStats] = useState({
    total: 0,
    kasir: 0,
    manajer: 0,
    admin: 0,
    pasien: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllUsers();
        const stats = {
          total: users.length,
          kasir: users.filter(u => u.role === "kasir").length,
          manajer: users.filter(u => u.role === "manajer").length,
          admin: users.filter(u => u.role === "admin").length,
          pasien: users.filter(u => u.role === "pasien").length,
        };
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { userStats, loading };
}