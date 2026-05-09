import { FiPieChart, FiFileText, FiUsers, FiSettings, FiGrid, FiClock, FiHome, FiInfo } from "react-icons/fi";

export const navItems = [
    { label: "Overview", href: "/manager", icon: FiPieChart },
    { label: "Laporan", href: "/manager/laporan", icon: FiFileText },
    { label: "Data Pasien", href: "/manager/pasien", icon: FiUsers },
    { label: "Pengaturan", href: "/manager/setting", icon: FiSettings },
  ];

export const navItemsKasir = [
      { label: "Overview", href: "/kasir", icon: FiGrid },
      { label: "Laporan", href: "/kasir/laporan", icon: FiFileText, disabled: true },
      { label: "Statistik", href: "/kasir/statistik", icon: FiPieChart, disabled: true },
      { label: "Pengaturan", href: "/kasir/setting", icon: FiSettings },
];

export const navItemsPasien = [
    { label: "Home", href: "/pasien", icon: FiHome },
    { label: "History", href: "/pasien/history", icon: FiClock },
    { label: "About", href: "/pasien/about", icon: FiInfo },
];