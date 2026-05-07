/**
 * Kalkulasi selisih BPJS
 * INA-CBGs = limit yang ditanggung BPJS
 * Iur biaya = sisa yang harus dibayar pasien
 */
export const hitungIurBiaya = (totalBiaya: number, coverBpjs: number) => {
  const iur = totalBiaya - coverBpjs;
  return iur <= 0 ? 0 : iur;
};
