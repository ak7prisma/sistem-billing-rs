"use client";

import { useKasirDashboard } from "@/lib/hooks/useKasirDashboard";

// UI Components
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import StatsCard from "@/components/ui/StatsCard";
import InvoiceModal from "@/components/billing/InvoiceModal";
import ReceiptModal from "@/components/billing/ReceiptModal";

// Kasir Components
import BillingTable from "@/components/kasir/BillingTable";
import BillingEmptyState from "@/components/kasir/BillingEmptyState";

export default function KasirDashboard() {
  const {
    search,
    setSearch,
    loading,
    refresh,
    filteredData,
    stats,
    selectedTagihan,
    isInvoiceModalOpen,
    isReceiptModalOpen,
    handleActionClick,
    closeModals,
  } = useKasirDashboard();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Search */}
      <PageHeader 
        title="Antrean Billing" 
        subtitle="Proses pembayaran pasien dari Poli, Lab, dan Farmasi."
        badge="Kasir"
      >
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Cari No. Invoice / Poli..." 
        />
      </PageHeader>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          label="Menunggu Bayar"
          value={stats.pending.toString().padStart(2, '0')}
          description="Tagihan Pending"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatsCard 
          label="Sudah Lunas"
          value={stats.lunas.toString().padStart(2, '0')}
          description="Transaksi Selesai"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard 
          label="Butuh Perhatian"
          value={stats.gagal.toString().padStart(2, '0')}
          description="Status Gagal"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-violet-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat Data Tagihan...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <BillingEmptyState />
        ) : (
          <BillingTable data={filteredData} onAction={handleActionClick} />
        )}
      </div>

      {/* Modals */}
      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={closeModals}
        onSuccess={refresh}
        tagihan={selectedTagihan}
        role="kasir"
      />

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={closeModals}
        tagihan={selectedTagihan}
      />
    </div>
  );
}
