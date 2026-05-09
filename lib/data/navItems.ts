import { FiPieChart, FiFileText, FiUsers, FiGrid, FiClock, FiHome, FiInfo } from "react-icons/fi";

export const navItems = [
    { label: "Overview", href: "/manager", icon: FiPieChart },
    { label: "Laporan", href: "/manager/laporan", icon: FiFileText },
    { label: "Data Pasien", href: "/manager/pasien", icon: FiUsers },
  ];

export const navItemsKasir = [
      { label: "Overview", href: "/kasir", icon: FiGrid },
];

export const navItemsPasien = [
    { label: "Home", href: "/pasien", icon: FiHome },
    { label: "History", href: "/pasien/history", icon: FiClock },
    { label: "About", href: "/pasien/about", icon: FiInfo },
];