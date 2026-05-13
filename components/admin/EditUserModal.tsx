import { FiX, FiUser, FiMail, FiLock, FiSave, FiLoader, FiShield } from "react-icons/fi";
import { User, UserRole } from "@/lib/types";
import BaseModal from "../ui/BaseModal";
import { useState, useEffect } from "react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (uid: string, data: { nama: string, email: string, role: UserRole }) => Promise<void>;
}

const ROLES: UserRole[] = ["kasir", "manajer", "admin"];

export default function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    role: "kasir" as UserRole,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || "",
        email: user.email || "",
        role: user.role || "kasir",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await onSave(user.uid, formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Edit Staff Profile</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Perbarui informasi akun dan role staff</p>
        </div>
        <button onClick={onClose} className="p-2.5 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-800">
          <FiX size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                required
                type="text" 
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Staff</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Jabatan</label>
            <div className="relative">
              <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                {ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
            <FiLock className="text-amber-500 mt-0.5 shrink-0" size={14} />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-tight">Catatan Keamanan</p>
              <p className="text-[9px] text-amber-600 leading-relaxed font-medium">
                Pembaruan password hanya dapat dilakukan melalui fitur "Reset Password" untuk alasan keamanan.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => alert("Link reset password telah dikirim ke email: " + formData.email)}
            className="w-full py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <FiLock size={12} /> Kirim Link Reset Password
          </button>
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition text-xs uppercase tracking-widest"
          >
            Batal
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
