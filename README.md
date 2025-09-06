---

```markdown
# 📚 Aksara petualang — Aplikasi Literasi Gamifikasi

Proyek ini adalah aplikasi web gamifikasi literasi untuk anak SD.  
Anak merawat karakter virtual (mirip Pou/Talking Tom) sambil membaca **cerita rakyat yang diperkaya AI** & mengerjakan misi harian.  

Fitur utama:  
- **Cerita & pertanyaan literasi digenerate AI**, kemudian dikurasi agar sesuai konteks anak.  
- Anak membaca → dapat XP & koin → bisa membeli pakaian/makanan → avatar berubah.  
- **Misi harian berbasis literasi** (mis. baca 10 menit, jawab 3 soal benar).  
- **Gamifikasi edukatif** → motivasi belajar lebih tinggi & interaktif.  

> Dibuat untuk kompetisi **LIDM 2025 – Divisi Inovasi Teknologi Pendidikan**.

---

## 🚀 Tech Stack

- **Next.js 14 (App Router, TypeScript)** — frontend & API routes
- **Tailwind CSS + shadcn/ui** — styling & komponen UI
- **Zustand** — state management di client
- **Supabase (Postgres, Auth, RLS)** — backend, database, storage
- **Vercel** — deployment frontend & API
- **Sonner** — notifikasi toast
- **Web Speech API** — text-to-speech untuk story reader

---

## 📂 Struktur Folder

```

src/
├─ app/                # App Router (halaman Next.js)
│   ├─ page.tsx        # Home
│   ├─ login/page.tsx  # Login
│   ├─ shop/page.tsx   # Shop
│   ├─ missions/page.tsx
│   ├─ stories/page.tsx
│   └─ api/            # API routes (state, purchase, equip, claim, story)
├─ components/         # UI components (Avatar, ItemCard, MissionRow, TTSBar, dsb)
├─ data/               # catalog.json (daftar item & misi default)
├─ lib/                # helper (supabaseClient, supabaseServer, todayJakarta)
├─ state/              # Zustand store (useGameStore)
└─ types.ts            # tipe global (PetState, Inventory, Mission, dll)

```

Assets:

```

public/assets/
├─ body/               # avatar base
├─ clothes/            # pakaian
├─ foods/              # makanan
└─ icons/              # ikon tambahan

```

---

## ⚙️ Setup & Menjalankan Proyek

### 1. Clone repo & install dependencies

```bash
git clone https://github.com/alfdmsr/aksara-petualang.git
cd aksara-petualang
pnpm install
```

### 2. Setup environment

Buat file `.env.local` di root dan simpan file asli (.env.local) hanya di laptopmu & di Vercel
project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Lihat juga `.env.example`.

### 3. Jalankan lokal

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 4. Deploy ke Vercel

- Import repo ke Vercel
- Tambahkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Deploy

---

## 📝 Checklist Fitur (Roadmap)

- [x] **Setup dasar**: Next.js + Tailwind + shadcn/ui
- [x] **Integrasi Supabase**: env, auth, schema, RLS
- [x] **API /api/state**: ambil wallet, pet, inventory
- [x] **Login page**: email + password (Supabase Auth)
- [ ] **Shop page**: list item dari catalog.json
- [ ] **API /api/purchase**: beli item (kurangi coins, tambah inventory)
- [ ] **API /api/equip**: pakai item (update avatar)
- [ ] **API /api/story**: ambil cerita dari story_cache
- [ ] **API /api/claim**: klaim reward misi harian
- [ ] **Mission page**: tampilkan progress baca/kuis
- [ ] **Story Reader**: tampilkan teks cerita + TTS + kuis
- [ ] **Mini Game**: memory / drag-drop sederhana
- [ ] **UI avatar**: tampilkan karakter dengan pakaian yang dipakai
- [ ] **Deploy ke Vercel** + demo siap untuk presentasi LIDM

---

## 📜 Lisensi

MIT — silakan gunakan & kembangkan lebih lanjut.

---
