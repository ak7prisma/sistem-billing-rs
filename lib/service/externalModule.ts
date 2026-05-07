import { RincianTagihan } from "../types";
import { MASTER_OBAT, MASTER_LAYANAN_MEDIS, MASTER_LAYANAN_LABOR } from "../data/master";

/**
 * Simulasi API dari Modul Lain (SIRS terfragmentasi)
 * Dalam dunia nyata, ini akan memanggil API Antrean, API Lab, atau API Farmasi
 */

export const fetchExternalMedis = async (kunjunganId: string): Promise<RincianTagihan[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Ambil 1-2 layanan medis acak
  const randomMedis = MASTER_LAYANAN_MEDIS[Math.floor(Math.random() * MASTER_LAYANAN_MEDIS.length)];
  
  return [
    {
      id_rincian: `RIN-MED-${Math.random().toString(36).substr(2, 5)}`,
      id_layanan_medis: randomMedis.id_layanan_medis,
      nama_layanan: randomMedis.nama_layanan,
      jenis: "medis",
      jumlah: 1,
      subtotal: randomMedis.harga,
      tanggal: new Date().toISOString().split('T')[0],
      is_covered_bpjs: Math.random() > 0.3 // 70% chance covered
    }
  ];
};

export const fetchExternalLab = async (kunjunganId: string): Promise<RincianTagihan[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const randomLab = MASTER_LAYANAN_LABOR[Math.floor(Math.random() * MASTER_LAYANAN_LABOR.length)];
  
  return [
    {
      id_rincian: `RIN-LAB-${Math.random().toString(36).substr(2, 5)}`,
      id_layanan_labor: randomLab.id_layanan_labor,
      nama_layanan: randomLab.nama_layanan,
      jenis: "laboratorium",
      jumlah: 1,
      subtotal: randomLab.harga,
      tanggal: new Date().toISOString().split('T')[0],
      is_covered_bpjs: Math.random() > 0.5 // 50% chance covered
    }
  ];
};

export const fetchExternalFarmasi = async (kunjunganId: string): Promise<RincianTagihan[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const randomObat = MASTER_OBAT[Math.floor(Math.random() * MASTER_OBAT.length)];
  
  return [
    {
      id_rincian: `RIN-OBT-${Math.random().toString(36).substr(2, 5)}`,
      id_obat: randomObat.id_obat,
      nama_layanan: randomObat.nama_obat,
      jenis: "obat",
      jumlah: Math.floor(Math.random() * 5) + 1,
      subtotal: randomObat.harga * 10, // Simulasi harga resep
      tanggal: new Date().toISOString().split('T')[0],
      is_covered_bpjs: true
    }
  ];
};
