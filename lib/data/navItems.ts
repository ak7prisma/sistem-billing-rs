import { FiPieChart, FiFileText, FiUsers, FiGrid, FiClock, FiHome, FiInfo, FiShield, FiPackage, FiActivity, FiLayers } from "react-icons/fi";

export const navItems = [
    { label: "Overview", href: "/manager", icon: FiPieChart },
    { label: "Laporan Obat", href: "/manager/laporan/obat", icon: FiPackage },
    { label: "Laporan Tindakan", href: "/manager/laporan/tindakan", icon: FiActivity },
    { label: "Laporan Labor", href: "/manager/laporan/labor", icon: FiLayers },
    { label: "Data Pasien", href: "/manager/pasien", icon: FiUsers },
    { label: "Semua Transaksi", href: "/manager/laporan", icon: FiFileText },
  ];

export const navItemsKasir = [
      { label: "Overview", href: "/kasir", icon: FiGrid },
];

export const navItemsPasien = [
    { label: "Home", href: "/pasien", icon: FiHome },
    { label: "History", href: "/pasien/history", icon: FiClock },
    { label: "About", href: "/pasien/about", icon: FiInfo },
];