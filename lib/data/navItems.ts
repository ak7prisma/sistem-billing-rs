import { FiPieChart, FiFileText, FiUsers, FiGrid, FiClock, FiHome, FiInfo, FiShield, FiPackage, FiActivity, FiLayers, FiSettings, FiLock, FiUserPlus } from "react-icons/fi";

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

export const navItemsAdmin = [
    { label: "Dashboard", href: "/admin", icon: FiSettings },
    { label: "Staff Management", href: "/admin/users", icon: FiUsers },
    { label: "Generate Akun", href: "/admin/create", icon: FiUserPlus },
];