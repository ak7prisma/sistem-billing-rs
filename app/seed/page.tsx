"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSave, FiActivity, FiDatabase, FiCheckCircle, FiChevronDown, FiChevronUp, FiUser, FiCreditCard, FiHash, FiMapPin, FiLayers, FiPackage, FiSearch } from "react-icons/fi";
import { MASTER_OBAT, MASTER_LAYANAN_MEDIS, MASTER_LAYANAN_LABOR, MASTER_POLI } from "@/lib/data/master";
import { getAllData } from "@/lib/firebase/firestore";
import { Pasien } from "@/lib/types";
import { db } from "@/lib/firebase/config";
import { doc, writeBatch, serverTimestamp } from "firebase/firestore";
import RoleGuard from "@/components/layout/RoleGuard";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const [showInteractive, setShowInteractive] = useState(true);

  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [selectedPasienId, setSelectedPasienId] = useState("");
  const [currentPoli, setCurrentPoli] = useState("Poli Umum");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetchPasien();
  }, []);

  const fetchPasien = async () => {
    try {
      const data = await getAllData("pasien");
      setPasienList(data as Pasien[]);
    } catch (err) {
      console.error(err);
    }
  };

  const addStatus = (msg: string) => {
    setStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const selectedPasien = pasienList.find(p => p.id === selectedPasienId);

  const addItem = (item: any, jenis: "obat" | "medis" | "laboratorium") => {
    // Unique ID based on ID + Poli (if medical)
    const itemPoli = jenis === "medis" ? currentPoli : "Instansi Luar";
    const uniqueId = `${item.id_obat || item.id_layanan_medis || item.id_layanan_labor}-${itemPoli}`;
    
    const existing = cart.find(c => c.uniqueId === uniqueId);
    if (existing) {
      setCart(cart.map(c => c.uniqueId === uniqueId ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, {
        uniqueId,
        id: item.id_obat || item.id_layanan_medis || item.id_layanan_labor,
        nama: item.nama_obat || item.nama_layanan,
        harga: item.harga,
        is_covered_bpjs_master: item.is_covered_bpjs,
        jenis,
        poli: itemPoli,
        qty: 1
      }]);
    }
  };

  const removeItem = (uniqueId: string) => setCart(cart.filter(c => c.uniqueId !== uniqueId));

  const updateQty = (uniqueId: string, delta: number) => {
    setCart(cart.map(c => c.uniqueId === uniqueId ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const handleCreateCustomInvoice = async () => {
    if (!selectedPasienId || cart.length === 0) {
      alert("Pilih pasien dan item!");
      return;
    }

    setLoading(true);
    addStatus(`Membangun Invoice Terintegrasi untuk ${selectedPasien?.nama}...`);
    try {
      const batch = writeBatch(db);
      const tagihanId = `INV-SEED-${Date.now()}`;
      const isBpjs = selectedPasien?.tipe_penjamin?.toLowerCase() === "bpjs";

      let totalIur = 0;
      let totalCover = 0;

      const isAdminFeeNeeded = !isBpjs;
      const ADMIN_FEE = 10000;

      if (isAdminFeeNeeded) {
        totalIur += ADMIN_FEE;
        const adminRinciId = `RIN-${tagihanId}-ADM`;
        batch.set(doc(db, "rinci_tagihan", adminRinciId), {
          id_rincian: adminRinciId,
          id_tagihan: tagihanId,
          nama_layanan: "Biaya Administrasi",
          jenis: "medis",
          poli: "Pendaftaran",
          jumlah: 1,
          subtotal: ADMIN_FEE,
          is_covered_bpjs: false,
          tanggal: new Date().toISOString().split('T')[0]
        });
      }

      // Extract unique polis from medical items
      const uniquePolis = Array.from(new Set(
        cart.filter(item => item.jenis === "medis").map(item => item.poli)
      ));
      
      const finalPoliString = uniquePolis.length > 0 ? uniquePolis.join(", ") : "Umum";

      cart.forEach((item, idx) => {
        const covered = isBpjs && item.is_covered_bpjs_master;
        const subtotal = item.harga * item.qty;
        if (covered) totalCover += subtotal; else totalIur += subtotal;

        const rinciId = `RIN-${tagihanId}-${idx}`;
        batch.set(doc(db, "rinci_tagihan", rinciId), {
          id_rincian: rinciId,
          id_tagihan: tagihanId,
          nama_layanan: item.nama,
          jenis: item.jenis,
          poli: item.poli, // Store poli for each item
          jumlah: item.qty,
          subtotal: subtotal,
          is_covered_bpjs: covered,
          tanggal: new Date().toISOString().split('T')[0]
        });
      });

      batch.set(doc(db, "tagihan", tagihanId), {
        id_tagihan: tagihanId,
        pasien_id: selectedPasienId,
        poli: finalPoliString, // Now contains multiple polis if any
        tanggal: new Date().toISOString().split('T')[0],
        status: "pending",
        total_biaya: totalIur,
        cover_bpjs: totalCover,
        createdAt: serverTimestamp()
      });

      await batch.commit();
      addStatus(`✅ Sukses! Invoice ${tagihanId} dibuat dengan poli: ${finalPoliString}`);
      setCart([]);
    } catch (err: any) {
      addStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isAdminFeeNeeded = selectedPasien?.tipe_penjamin?.toLowerCase() === "umum";
  const ADMIN_FEE = 10000;
  
  const totalCart = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
  const totalCover = cart.reduce((sum, item) => {
    const covered = selectedPasien?.tipe_penjamin === "bpjs" && item.is_covered_bpjs_master;
    return sum + (covered ? (item.harga * item.qty) : 0);
  }, 0);
  const totalIur = (totalCart - totalCover) + (isAdminFeeNeeded ? ADMIN_FEE : 0);

  return (
    <RoleGuard allowedRoles={["developer"]}>
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-200 ring-8 ring-white">
                <FiDatabase className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">RS <span className="text-blue-600">Seeder</span></h1>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Environment: Development v2.0</p>
              </div>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Sync</span>
              </div>
              <div className="h-4 w-px bg-slate-100" />
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Firebase Cloud</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Logs and Patient Detail */}
            <div className="lg:col-span-4 space-y-8">
               {/* Patient Detail Card */}
               {selectedPasien ? (
                 <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                          <FiUser size={28} />
                       </div>
                       <div>
                          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-tight">{selectedPasien.nama}</h2>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{selectedPasien.tipe_penjamin} Member</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                          <FiHash className="text-slate-300 mb-1" />
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">No. RM</p>
                          <p className="text-xs font-black text-slate-700">{selectedPasien.no_rm}</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                          <FiCreditCard className="text-slate-300 mb-1" />
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Penjamin</p>
                          <p className="text-xs font-black text-slate-700 uppercase">{selectedPasien.tipe_penjamin}</p>
                       </div>
                       <div className="col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                          <FiMapPin className="text-slate-300 mb-1" />
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Alamat / Instansi</p>
                          <p className="text-[10px] font-bold text-slate-600">Jakarta Selatan, Indonesia</p>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="bg-slate-200/30 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200">
                    <FiUser className="text-slate-300 mb-4" size={48} />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Pilih Pasien Terlebih Dahulu</p>
                 </div>
               )}

              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Execution Console</h2>
                <div className="space-y-1 font-mono text-[10px] min-h-60 max-h-80 overflow-y-auto scrollbar-hide">
                  {status.map((s, i) => (
                    <div key={i} className="flex gap-3 text-emerald-500/80">
                      <span className="text-slate-700 shrink-0">[{i + 1}]</span>
                      <span>{s}</span>
                    </div>
                  ))}
                  {loading && <div className="text-indigo-400 animate-pulse italic mt-2 ml-7">Executing Batch Operation...</div>}
                </div>
              </div>
            </div>

            {/* Right: Invoice Builder */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 pb-0 space-y-8">
                  {/* Step 1: Selection Header */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">1. Pilih Pasien</label>
                      <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={selectedPasienId}
                          onChange={(e) => setSelectedPasienId(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">-- Pilih Data Pasien --</option>
                          {pasienList.map(p => (
                            <option key={p.id} value={p.id}>{p.nama.toUpperCase()} ({p.no_rm})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">2. Pilih Poli (Khusus Medis)</label>
                      <div className="relative">
                        <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={currentPoli}
                          onChange={(e) => setCurrentPoli(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-700 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all appearance-none cursor-pointer"
                        >
                          {MASTER_POLI.map(p => (
                            <option key={p} value={p}>{p.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Item Selection Grid */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Pilih Layanan & Obat</h3>
                      <div className="flex gap-2">
                        <span className="text-[8px] font-black px-2 py-1 bg-violet-50 text-violet-600 rounded-lg uppercase">Medis Filtered by {currentPoli}</span>
                        <span className="text-[8px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg uppercase">Lab & Obat All-Access</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Medis Section */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Tindakan Medis
                        </p>
                        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide pr-1">
                          {MASTER_LAYANAN_MEDIS
                            .filter(item => !item.poli || item.poli === currentPoli || item.poli === "Umum")
                            .map(item => (
                              <button key={item.id_layanan_medis} onClick={() => addItem(item, "medis")} className="w-full group text-left p-4 rounded-2xl bg-slate-50 hover:bg-violet-600 transition-all border border-transparent hover:shadow-lg hover:shadow-violet-600/20 active:scale-95">
                                <p className="text-[10px] font-black text-slate-700 group-hover:text-white uppercase leading-tight">{item.nama_layanan}</p>
                                <p className="text-[9px] text-slate-400 group-hover:text-violet-200 font-bold mt-1">Rp {item.harga.toLocaleString()}</p>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Lab Section */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Layanan Laboratorium
                        </p>
                        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide pr-1">
                          {MASTER_LAYANAN_LABOR.map(item => (
                            <button key={item.id_layanan_labor} onClick={() => addItem(item, "laboratorium")} className="w-full group text-left p-4 rounded-2xl bg-slate-50 hover:bg-emerald-600 transition-all border border-transparent hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95">
                              <p className="text-[10px] font-black text-slate-700 group-hover:text-white uppercase leading-tight">{item.nama_layanan}</p>
                              <p className="text-[9px] text-slate-400 group-hover:text-emerald-200 font-bold mt-1">Rp {item.harga.toLocaleString()}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Obat Section */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Instalasi Farmasi
                        </p>
                        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide pr-1">
                          {MASTER_OBAT.map(item => (
                            <button key={item.id_obat} onClick={() => addItem(item, "obat")} className="w-full group text-left p-4 rounded-2xl bg-slate-50 hover:bg-blue-600 transition-all border border-transparent hover:shadow-lg hover:shadow-blue-600/20 active:scale-95">
                              <p className="text-[10px] font-black text-slate-700 group-hover:text-white uppercase leading-tight">{item.nama_obat}</p>
                              <p className="text-[9px] text-slate-400 group-hover:text-blue-200 font-bold mt-1">Rp {item.harga.toLocaleString()}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Cart and Summary */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                   <div className="flex flex-col xl:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rincian Invoice ({cart.length} Item)</h3>
                            <button onClick={() => setCart([])} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline transition-all">Kosongkan Keranjang</button>
                         </div>
                         <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {cart.map(item => (
                              <div key={item.uniqueId} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4 duration-300">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                     <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${item.jenis === 'medis' ? 'bg-violet-100 text-violet-600' : item.jenis === 'laboratorium' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {item.jenis}
                                     </span>
                                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">{item.poli}</span>
                                  </div>
                                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight mt-1">{item.nama}</p>
                                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">Rp {item.harga.toLocaleString()} x {item.qty}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex bg-slate-100 rounded-xl overflow-hidden shadow-inner">
                                     <button onClick={() => updateQty(item.uniqueId, -1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">-</button>
                                     <div className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-slate-800 bg-white">{item.qty}</div>
                                     <button onClick={() => updateQty(item.uniqueId, 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">+</button>
                                  </div>
                                  <button onClick={() => removeItem(item.uniqueId)} className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition flex items-center justify-center shadow-sm">
                                     <FiTrash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {cart.length === 0 && (
                              <div className="py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200">
                                 <FiPackage size={40} className="text-slate-100 mb-2" />
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Belum ada item terpilih</p>
                              </div>
                            )}
                         </div>
                      </div>

                      <div className="w-full xl:w-96 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
                         <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Ringkasan Tagihan</h4>
                         
                         <div className="space-y-4 flex-1">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                               <span>Subtotal Items</span>
                               <span>Rp {totalCart.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-emerald-500 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                               <span>Cover BPJS</span>
                               <span>- Rp {totalCover.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-slate-100 my-4" />
                            <div className="flex justify-between items-end">
                               <div>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Iur Biaya Pasien</p>
                                  <p className="text-2xl font-black text-slate-900 tracking-tighter">Rp {totalIur.toLocaleString()}</p>
                               </div>
                            </div>
                         </div>

                         <button
                           onClick={handleCreateCustomInvoice}
                           disabled={loading || cart.length === 0 || !selectedPasienId}
                           className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:grayscale"
                         >
                           {loading ? <FiLoader className="animate-spin" /> : <FiSave size={18} />}
                           {loading ? "MEMPROSES..." : "BUAT INVOICE"}
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

function FiLoader(props: any) {
  return (
    <svg 
      className={props.className} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      width="1em" 
      height="1em"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}