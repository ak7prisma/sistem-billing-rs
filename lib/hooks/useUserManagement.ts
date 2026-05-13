import { useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/lib/types";
import { getAllUsers, updateUserRole, deleteUser, updateUserInfo } from "@/lib/firebase/firestore";
import { useAuth } from "./useAuth";

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user: currentUser, profile } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateRole = async (uid: string, newRole: UserRole) => {
    try {
      const adminInfo = currentUser && profile ? {
        uid: currentUser.uid,
        nama: profile.nama || currentUser.displayName || "Admin"
      } : undefined;

      await updateUserRole(uid, newRole, adminInfo);
      await fetchUsers(); // Refresh data
      return { success: true };
    } catch (err) {
      console.error("Error updating role:", err);
      return { success: false, error: "Gagal mengubah role" };
    }
  };

  const updateInfo = async (uid: string, data: { nama?: string; email?: string; role?: UserRole }) => {
    try {
      const adminInfo = currentUser && profile ? {
        uid: currentUser.uid,
        nama: profile.nama || currentUser.displayName || "Admin"
      } : undefined;

      await updateUserInfo(uid, data, adminInfo);
      await fetchUsers(); // Refresh data
      return { success: true };
    } catch (err) {
      console.error("Error updating info:", err);
      return { success: false, error: "Gagal memperbarui data" };
    }
  };

  const deleteAccount = async (uid: string) => {
    try {
      const adminInfo = currentUser && profile ? {
        uid: currentUser.uid,
        nama: profile.nama || currentUser.displayName || "Admin"
      } : undefined;

      await deleteUser(uid, adminInfo);
      await fetchUsers(); // Refresh data
      return { success: true };
    } catch (err) {
      console.error("Error deleting account:", err);
      return { success: false, error: "Gagal menghapus akun" };
    }
  };

  const filteredUsers = users.filter(u => 
    u.role !== "pasien" && (
      u.nama.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    )
  );

  return {
    users: filteredUsers,
    totalUsers: users.length,
    loading,
    search,
    setSearch,
    updateRole,
    updateInfo,
    deleteAccount,
    refreshUsers: fetchUsers
  };
}