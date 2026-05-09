export const hitungIurBiaya = (totalBiaya: number, coverBpjs: number) => {
  const iur = totalBiaya - coverBpjs;
  return iur <= 0 ? 0 : iur;
};