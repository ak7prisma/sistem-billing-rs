import { FiPieChart, FiFileText, FiUsers, FiSettings } from "react-icons/fi";

export const navItems = [
    { label: "Overview", href: "/manager", icon: FiPieChart },
    { label: "Laporan", href: "/manager/laporan", icon: FiFileText },
    { label: "Data Pasien", href: "/manager/pasien", icon: FiUsers },
    { label: "Pengaturan", href: "/manager/setting", icon: FiSettings },
  ];