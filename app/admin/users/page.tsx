"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { FiSearch, FiEdit2, FiLoader, FiTrash2 } from "react-icons/fi";
import { User, UserRole } from "@/lib/types";
import { useUserManagement } from "@/lib/hooks/useUserManagement";
import RoleBadge from "@/components/ui/RoleBadge";
import EditUserModal from "@/components/admin/EditUserModal";

export default function UserManagementPage() {
  const { users, loading, search, setSearch, updateInfo, deleteAccount } = useUserManagement();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (uid: string, data: { nama: string, email: string, role: UserRole }) => {
    const result = await updateInfo(uid, data);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleDeleteAccount = async (uid: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun ${nama}? Tindakan ini tidak dapat dibatalkan.`)) {
      setIsDeleting(uid);
      const result = await deleteAccount(uid);
      if (!result.success) {
        alert(result.error);
      }
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="User Management" 
        subtitle="Kelola akun dan role staff sistem billing"
        badge="Account Controls"
      />

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama, email, atau role..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{users.length} User Ditemukan</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="p-6 pl-10">User Info</th>
                <th className="p-6">Role</th>
                <th className="p-6">Last Login</th>
                <th className="p-6 pr-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <FiLoader className="w-10 h-10 text-blue-500 animate-spin" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Memuat Data User...</p>
                    </div>
                  </td>
                </tr>
              ) : users.map(user => (
                <tr key={user.uid} className="hover:bg-slate-50/50 transition group">
                  <td className="p-6 pl-10">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm">{user.nama}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-6">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      {user.lastLogin?.seconds 
                        ? new Date(user.lastLogin.seconds * 1000).toLocaleString("id-ID", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : "Never"}
                    </span>
                  </td>
                  <td className="p-6 pr-10 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shadow-sm active:scale-95"
                      >
                        <FiEdit2 size={12} /> Edit Akun
                      </button>
                      <button 
                        disabled={isDeleting === user.uid}
                        onClick={() => handleDeleteAccount(user.uid, user.nama)}
                        className="p-2.5 bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        title="Hapus Akun"
                      >
                        {isDeleting === user.uid ? <FiLoader className="animate-spin" /> : <FiTrash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}