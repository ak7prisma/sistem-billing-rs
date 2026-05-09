"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSave, FiActivity, FiDatabase, FiCheckCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { seedPasienData, seedDemoPasien, seedTransaksiSampleData } from "@/lib/firebase/seed";
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
  const [poli, setPoli] = useState("Poli Umum");
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

  const run = async (label: string, fn: () => Promise<void>) => {
    setLoading(true);
    addStatus(`Mulai: ${label}...`);
    try {
      await fn();
      addStatus(`✅ Selesai: ${label}`);
      if (label.includes("Pasien")) fetchPasien();
    } catch (e: any) {
      addStatus(`❌ Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedPasien = pasienList.find(p => p.id === selectedPasienId);

  const addItem = (item: any, jenis: "obat" | "medis" | "laboratorium") => {
    const existing = cart.find(c => c.id === (item.id_obat || item.id_layanan_medis || item.id_layanan_labor));
    if (existing) {
      setCart(cart.map(c => c.id === existing.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, {
        id: item.id_obat || item.id_layanan_medis || item.id_layanan_labor,
        nama: item.nama_obat || item.nama_layanan,
        harga: item.harga,
        is_covered_bpjs_master: item.is_covered_bpjs,
        jenis,
        qty: 1
      }]);
    }
  };

  const removeItem = (id: string) => setCart(cart.filter(c => c.id !== id));

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const handleCreateCustomInvoice = async () => {
    if (!selectedPasienId || cart.length === 0) {
      alert("Pilih pasien dan item!");
      return;
    }

    setLoading(true);
    addStatus(`Membangun Invoice Custom untuk ${selectedPasien?.nama}...`);
    try {
      const batch = writeBatch(db);
      const tagihanId = `INV-SEED-${Date.now()}`;
      const isBpjs = selectedPasien?.tipe_penjamin?.toLowerCase() === "bpjs";

      let totalIur = 0;
      let totalCover = 0;

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
          jumlah: item.qty,
          subtotal: subtotal,
          is_covered_bpjs: covered,
          tanggal: new Date().toISOString().split('T')[0]
        });
      });

      batch.set(doc(db, "tagihan", tagihanId), {
        id_tagihan: tagihanId,
        pasien_id: selectedPasienId,
        poli,
        tanggal: new Date().toISOString().split('T')[0],
        status: "pending",
        total_biaya: totalIur,
        cover_bpjs: totalCover,
        createdAt: serverTimestamp()
      });

      await batch.commit();
      addStatus(`✅ Sukses! Invoice ${tagihanId} dibuat.`);
      setCart([]);
    } catch (err: any) {
      addStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const totalCart = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
  const totalCover = cart.reduce((sum, item) => {
    const covered = selectedPasien?.tipe_penjamin === "bpjs" && item.is_covered_bpjs_master;
    return sum + (covered ? (item.harga * item.qty) : 0);
  }, 0);
  const totalIur = totalCart - totalCover;

  return (
    <RoleGuard allowedRoles={["developer"]}>
      <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 rounded-4xl flex items-center justify-center shadow-2xl shadow-slate-200">
                <FiDatabase className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Dev <span className="text-indigo-600">Seeder</span></h1>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Environment: Development</p>
              </div>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Firebase Connected</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <FiActivity /> Automated Scripts
                </h2>
                <div className="space-y-3">
                  {[
                    { label: "1. Pasien Demo", fn: seedDemoPasien, color: "bg-blue-600" },
                    { label: "2. Pasien & Auth", fn: seedPasienData, color: "bg-indigo-600" },
                    { label: "3. Transaksi Sampel", fn: seedTransaksiSampleData, color: "bg-emerald-600" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => run(s.label, s.fn)}
                      disabled={loading}
                      className="w-full group flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100"
                    >
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{s.label}</span>
                      <div className={`w-8 h-8 ${s.color} rounded-xl flex items-center justify-center text-white opacity-40 group-hover:opacity-100 transition-all`}>
                        <FiCheckCircle size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Execution Logs</h2>
                <div className="space-y-1 font-mono text-[10px] min-h-75 max-h-100 overflow-y-auto scrollbar-hide">
                  {status.map((s, i) => (
                    <div key={i} className="flex gap-3 text-emerald-500/80">
                      <span className="text-slate-700 shrink-0">[{i + 1}]</span>
                      <span>{s}</span>
                    </div>
                  ))}
                  {loading && <div className="text-indigo-400 animate-pulse italic mt-2 ml-7">Processing command...</div>}
                  {status.length === 0 && !loading && <div className="text-slate-700 italic ml-7">System ready. Awaiting input.</div>}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setShowInteractive(!showInteractive)}
                  className="w-full p-8 flex items-center justify-between bg-white hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center">
                      <FiPlus size={24} />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Interactive <span className="text-violet-600">Invoice Builder</span></h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Custom Transaction Generator</p>
                    </div>
                  </div>
                  {showInteractive ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {showInteractive && (
                  <div className="p-8 pt-0 border-t border-slate-50 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Patient</label>
                        <select
                          value={selectedPasienId}
                          onChange={(e) => setSelectedPasienId(e.target.value)}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-violet-500"
                        >
                          <option value="">-- Choose Patient --</option>
                          {pasienList.map(p => (
                            <option key={p.id} value={p.id}>{p.nama} ({p.no_rm})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department / Poli</label>
                        <select
                          value={poli}
                          onChange={(e) => setPoli(e.target.value)}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-violet-500"
                        >
                          {MASTER_POLI.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 flex justify-between items-center">
                        <span>Master Data Selection</span>
                        <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Filtered by {poli}</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center bg-slate-50 py-1 rounded">Medical Services</p>
                          <div className="space-y-2 max-h-75 overflow-y-auto scrollbar-hide pr-1">
                            {MASTER_LAYANAN_MEDIS
                              .filter(item => !item.poli || item.poli === poli || item.poli === "Umum")
                              .map(item => (
                                <button key={item.id_layanan_medis} onClick={() => addItem(item, "medis")} className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-violet-50 transition text-[10px] font-bold text-slate-600 line-clamp-1 border border-transparent hover:border-violet-100">
                                  {item.nama_layanan}
                                </button>
                              ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center bg-slate-50 py-1 rounded">Lab Tests</p>
                          <div className="space-y-2 max-h-75 overflow-y-auto scrollbar-hide pr-1">
                            {MASTER_LAYANAN_LABOR
                              .filter(item => !item.poli || item.poli === poli || item.poli === "Umum")
                              .map(item => (
                                <button key={item.id_layanan_labor} onClick={() => addItem(item, "laboratorium")} className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-violet-50 transition text-[10px] font-bold text-slate-600 line-clamp-1 border border-transparent hover:border-violet-100">
                                  {item.nama_layanan}
                                </button>
                              ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center bg-slate-50 py-1 rounded">Pharmacy / Drugs</p>
                          <div className="space-y-2 max-h-75 overflow-y-auto scrollbar-hide pr-1">
                            {MASTER_OBAT
                              .filter(item => !item.poli || item.poli === poli || item.poli === "Umum")
                              .map(item => (
                                <button key={item.id_obat} onClick={() => addItem(item, "obat")} className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-violet-50 transition text-[10px] font-bold text-slate-600 line-clamp-1 border border-transparent hover:border-violet-100">
                                  {item.nama_obat}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Items ({cart.length})</p>
                        <button onClick={() => setCart([])} className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Clear All</button>
                      </div>
                      <div className="space-y-2 max-h-50 overflow-y-auto mb-6 pr-2">
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-black text-slate-700 line-clamp-1 uppercase tracking-tight">{item.nama}</p>
                              <p className="text-[9px] text-slate-400 font-bold">Qty: {item.qty} • Rp {item.harga.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-black text-slate-500">-</button>
                              <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-black text-slate-500">+</button>
                              <button onClick={() => removeItem(item.id)} className="w-6 h-6 text-rose-400 hover:text-rose-600 transition ml-1"><FiTrash2 size={12} /></button>
                            </div>
                          </div>
                        ))}
                        {cart.length === 0 && <p className="text-[10px] text-slate-300 font-bold uppercase text-center py-4 tracking-widest italic">No items selected</p>}
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Patient Billing</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-black text-indigo-600 tracking-tighter">Rp {totalIur.toLocaleString()}</p>
                            {selectedPasien?.tipe_penjamin === 'bpjs' && (
                              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">BPJS Coverage Active</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={handleCreateCustomInvoice}
                          disabled={loading || cart.length === 0 || !selectedPasienId}
                          className="flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 transition shadow-xl shadow-slate-900/10 disabled:opacity-30"
                        >
                          <FiSave size={16} /> Generate Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}