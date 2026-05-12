"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { FiUsers, FiSearch, FiEdit2, FiShield, FiCheck, FiX } from "react-icons/fi";
import { getAllUsers, updateUserRole } from "@/lib/firebase/firestore";
import { User, UserRole } from "@/lib/types";
import { useAuth } from "@/lib/hooks/useAuth";

const ROLES: UserRole[] = ["kasir", "manajer", "admin", "pasien"];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("pasien");
  
  const { user: currentUser, profile } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (uid: string) => {
    try {
      const adminInfo = currentUser && profile ? {
        uid: currentUser.uid,
        nama: profile.nama || currentUser.displayName || "Admin"
      } : undefined;

      await updateUserRole(uid, newRole, adminInfo);
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      alert("Gagal mengubah role");
    }
  };

  const filteredUsers = users.filter(u => 
    u.nama.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

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
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredUsers.length} User Ditemukan</span>
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
                       <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Memuat Data User...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user.uid} className="hover:bg-slate-50/50 transition group">
                  <td className="p-6 pl-10">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm">{user.nama}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    {editingId === user.uid ? (
                      <select 
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as UserRole)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                      </select>
                    ) : (
                      <RoleBadge role={user.role} />
                    )}
                  </td>
                  <td className="p-6">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      {user.lastLogin?.seconds 
                        ? new Date(user.lastLogin.seconds * 1000).toLocaleString("id-ID", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : "Never"}
                    </span>
                  </td>
                  <td className="p-6 pr-10 text-right">
                    {editingId === user.uid ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleUpdateRole(user.uid)}
                          className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition active:scale-95"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition active:scale-95"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingId(user.uid);
                          setNewRole(user.role);
                        }}
                        className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shadow-sm active:scale-95"
                      >
                        <FiEdit2 size={12} /> Edit Role
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles: any = {
    admin: "bg-slate-900 text-white border-slate-900",
    manajer: "bg-violet-50 text-violet-600 border-violet-100",
    kasir: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pasien: "bg-blue-50 text-blue-600 border-blue-100",
    developer: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${styles[role] || "bg-slate-50 text-slate-500"}`}>
      {role === "admin" && <FiShield size={10} />}
      {role}
    </span>
  );
}
