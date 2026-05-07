@AGENTS.md
 Sistem Informasi Rumah Sakit (SIRS)

## Modul Billing & Pembayaran Pasien Terintegrasi



> Baca file ini dulu sebelum ngapa-ngapain. Ini adalah briefing utama project.



---



## 🏥 Deskripsi Project



Aplikasi web untuk digitalisasi modul billing dan pembayaran pasien rumah sakit.

Sistem ini menggantikan proses manual (nota fisik + kalkulator) dengan sistem terintegrasi real-time.



**Aktor utama:**

- **Pasien** — lihat tagihan & riwayat pembayaran

- **Kasir** — proses pembayaran (tunai & non-tunai/QRIS)

- **Manajer Keuangan** — laporan keuangan, filter transaksi, export PDF/Excel



**Fitur inti:**

- Auto-konsolidasi biaya dari Poli, Lab, dan Farmasi berdasar ID Kunjungan

- Deteksi selisih biaya BPJS (INA-CBGs) vs biaya mandiri (iur biaya)

- Generate E-Invoice + QR Code (QRIS)

- Role-Based Access Control (Kasir tidak bisa edit data medis)

- Riwayat pembayaran per pasien

- Dashboard laporan keuangan harian



---



## 🛠️ Tech Stack



| Layer | Teknologi |

|---|---|

| Framework | Next.js (App Router, terbaru) |

| UI | React + Tailwind CSS + shadcn/ui |

| Database | Firebase Firestore |

| Auth | Firebase Authentication |

| Storage | Cloudinary |

| Hosting | Vercel |



---



## 📁 Struktur Folder



```

/

├── app/                        # Next.js App Router

│   ├── (auth)/

│   │   ├── login/page.tsx

│   │   └── layout.tsx

│   ├── (dashboard)/

│   │   ├── kasir/              # Dashboard kasir

│   │   │   ├── page.tsx        # Daftar tagihan

│   │   │   └── [id]/page.tsx   # Detail + proses bayar

│   │   ├── keuangan/           # Dashboard manajer keuangan

│   │   │   ├── page.tsx

│   │   │   └── laporan/page.tsx

│   │   ├── pasien/             # Portal pasien

│   │   │   ├── tagihan/page.tsx

│   │   │   └── riwayat/page.tsx

│   │   └── layout.tsx          # Layout dengan sidebar + auth guard

│   ├── api/                    # API Routes (Next.js)

│   │   └── invoice/route.ts

│   ├── layout.tsx

│   └── page.tsx                # Landing / redirect

├── components/

│   ├── ui/                     # shadcn/ui components (jangan diedit manual)

│   ├── billing/                # Komponen khusus billing

│   │   ├── InvoiceCard.tsx

│   │   ├── PaymentForm.tsx

│   │   ├── BillingBreakdown.tsx

│   │   └── QRISModal.tsx

│   ├── layout/

│   │   ├── Sidebar.tsx

│   │   ├── Navbar.tsx

│   │   └── RoleGuard.tsx       # Komponen proteksi per role

│   └── shared/

│       ├── StatusBadge.tsx

│       └── LoadingSpinner.tsx

├── lib/

│   ├── firebase/

│   │   ├── config.ts           # Firebase init (pakai env vars)

│   │   ├── auth.ts             # Helper auth functions

│   │   ├── firestore.ts        # Generic Firestore helpers

│   │   └── storage.ts          # Firebase Storage helpers

│   ├── hooks/

│   │   ├── useAuth.ts

│   │   ├── useTagihan.ts

│   │   └── usePembayaran.ts

│   ├── types/

│   │   └── index.ts            # Semua TypeScript types/interfaces

│   └── utils/

│       ├── currency.ts         # Format rupiah

│       ├── bpjs.ts             # Kalkulasi selisih BPJS

│       └── pdf.ts              # Generate struk PDF

├── middleware.ts               # Auth middleware + role check

├── .env.local                  # JANGAN COMMIT - lihat .env.example

└── .env.example

```



---



## 🔥 Firebase — Struktur Firestore



```

firestore/

├── users/{userId}

│   ├── email: string

│   ├── role: "kasir" | "manajer" | "pasien"

│   └── nama: string

│

├── pasien/{pasienId}

│   ├── no_rm: string

│   ├── nama: string

│   ├── tipe_penjamin: "bpjs" | "umum"

│   └── no_bpjs?: string

│

├── kunjungan/{kunjunganId}

│   ├── pasien_id: string (ref)

│   ├── tanggal_masuk: timestamp

│   ├── pengirim: string

│   └── status: "aktif" | "selesai"

│

├── tagihan/{tagihanId}

│   ├── kunjungan_id: string (ref)

│   ├── pasien_id: string (ref)

│   ├── total_biaya: number

│   ├── status: "pending" | "lunas" | "gagal"

│   ├── tanggal: timestamp

│   └── rincian: RincianTagihan[]

│       ├── id_rincian: string

│       ├── jenis: "lab" | "obat" | "tindakan"

│       ├── nama_layanan: string

│       ├── jumlah: number

│       └── subtotal: number

│

├── pembayaran/{pembayaranId}

│   ├── tagihan_id: string (ref)

│   ├── metode: "tunai" | "qris" | "transfer"

│   ├── jumlah_pembayaran: number

│   ├── cover_bpjs: number

│   ├── iur_biaya: number

│   ├── status: "berhasil" | "gagal"

│   └── tanggal_pembayaran: timestamp

│

└── laporan/{periode}           # Cache laporan harian/bulanan

    ├── total_pendapatan: number

    ├── total_transaksi: number

    └── breakdown: object

```



---



## 🔐 Firebase Auth & Role System



```typescript

// Roles yang ada

type UserRole = "kasir" | "manajer" | "pasien"



// Custom claims disimpan di Firestore users/{uid}

// Middleware baca role dari Firestore, bukan dari JWT custom claims

// (Firebase free tier tidak support custom claims via Admin SDK di edge)

```



**Akses per role:**

- `kasir` → `/kasir/*` — bisa proses bayar, TIDAK bisa edit data medis/harga

- `manajer` → `/keuangan/*` — bisa lihat semua laporan, update status tagihan

- `pasien` → `/pasien/*` — hanya lihat tagihan & riwayat milik sendiri



---



## ⚙️ Commands



```bash

# Dev

npm run dev          # Jalankan dev server (localhost:3000)

npm run build        # Build production

npm run start        # Jalankan production build



# Linting & Type check

npm run lint         # ESLint

npm run type-check   # TypeScript check tanpa build



# Tidak ada test runner saat ini — manual testing via browser

```



---



## 📐 Coding Conventions



### TypeScript

- **Wajib** type semua props, return value function, dan Firestore data

- Semua types/interfaces ditaruh di `lib/types/index.ts`

- Gunakan `interface` untuk object shapes, `type` untuk unions/primitives



### React & Next.js

- Gunakan **Server Components** by default

- Tambah `"use client"` hanya kalau butuh state/event/hooks

- Data fetching di Server Component, jangan di useEffect kalau bisa dihindari

- Gunakan `loading.tsx` dan `error.tsx` per route segment



### Firestore

- Semua operasi Firestore lewat helper di `lib/firebase/firestore.ts`

- **Jangan** panggil Firestore langsung dari komponen

- Gunakan custom hooks (`useTagihan`, `usePembayaran`) untuk data fetching di client



### Styling

- Gunakan **Tailwind CSS** utility classes

- Komponen UI dari **shadcn/ui** — jangan override style di `components/ui/`

- Kalau butuh custom style, buat wrapper component di `components/billing/` atau `components/shared/`

- Konsisten pakai color tokens Tailwind, jangan hardcode hex



### Naming

- File komponen: `PascalCase.tsx`

- File hooks: `camelCase.ts` dengan prefix `use`

- File utils: `camelCase.ts`

- Variabel & fungsi: `camelCase`

- Konstanta: `UPPER_SNAKE_CASE`

- Firestore collection: `snake_case`



---



## 💰 Business Logic Penting



### Kalkulasi Selisih BPJS

```typescript

// Di lib/utils/bpjs.ts

// INA-CBGs = limit yang ditanggung BPJS

// Iur biaya = sisa yang harus dibayar pasien

iur_biaya = total_biaya - cover_bpjs

// Kalau iur_biaya <= 0, pasien tidak perlu bayar apapun

```



### Status Tagihan

```

pending  → tagihan dibuat, belum ada aksi kasir

lunas    → pembayaran berhasil dikonfirmasi

gagal    → pembayaran via gateway gagal

```



### Format Currency

```typescript

// Selalu gunakan helper dari lib/utils/currency.ts

// Jangan format Rupiah manual di komponen

formatRupiah(150000) // → "Rp 150.000"

```



---



## 🚫 Jangan Lakukan Ini



- **Jangan commit `.env.local`** — semua Firebase config pakai env vars

- **Jangan edit file di `components/ui/`** — itu auto-generated dari shadcn

- **Jangan panggil Firestore langsung dari Server/Client Component** — lewat lib/firebase dulu

- **Jangan hardcode role string** — pakai type `UserRole`

- **Jangan buat collection Firestore baru** tanpa update struktur di file ini

- **Jangan bypass RoleGuard** — setiap route protected harus cek role

- **Jangan gunakan `any` di TypeScript** — kalau terpaksa, kasih comment alasannya

- **Jangan fetch data di `useEffect`** kalau bisa pakai Server Component



---



## 🌍 Environment Variables



```bash

# .env.local (lihat .env.example untuk template)

NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=

```



> Prefix `NEXT_PUBLIC_` artinya exposed ke browser — aman untuk Firebase config karena security-nya lewat Firestore Rules, bukan key secrecy.



---



## 📋 Firestore Security Rules (Prinsip)



- Kasir hanya bisa **read** `tagihan` dan **write** `pembayaran`

- Kasir **tidak bisa write** ke `tagihan`, `kunjungan`, atau `pasien`

- Manajer bisa **read** semua collection keuangan

- Pasien hanya bisa **read** data dengan `pasien_id == request.auth.uid`



---



## 📌 Catatan Konteks



- Ini project **tugas mata kuliah SIRS** — fokus ke prototype yang fungsional

- Firebase Free Tier (Spark Plan): Firestore 1GB storage, 50k read/20k write per hari — cukup untuk prototype

- Payment Gateway (QRIS) di prototype = **simulasi** — tidak integrasi ke midtrans/xendit sungguhan

- Export laporan ke PDF pakai library client-side (misal: `jspdf`) karena tidak ada server berbayar