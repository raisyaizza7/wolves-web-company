import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean | string;
  created_at: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: 'draft' | 'published';
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  ticket_number: string;
  user_id: string;
  service_type: 'sewa_lapangan' | 'akademi' | 'tiket_pertandingan' | 'merchandise';
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  quantity: number;
  total_amount: number;
  notes: string;
  status: 'menunggu_konfirmasi' | 'dikonfirmasi' | 'dibatalkan';
  admin_notes?: string;
  payment_proof?: string;
  items_detail?: string;
  athlete_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AthleteRecord {
  id: string;
  user_id: string;
  name: string;
  position: string; // 'Point Guard' | 'Shooting Guard' | 'Small Forward' | 'Power Forward' | 'Center'
  jersey_number: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  origin?: string;
  birth_date?: string;
  photo_url: string;
  order_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET || "";

const LOCAL_DB_PATH = path.join(process.cwd(), "data", "db.json");

const DEFAULT_INITIAL_DATA = {
  Roles: [
    {
      id: "role-admin",
      name: "admin",
      description: "Administrator Utama dengan akses penuh dashboard",
      permissions: "all",
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "role-user",
      name: "user",
      description: "Anggota / Pengguna umum website",
      permissions: "read:profile,create:order",
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ],
  Users: [
    {
      id: "user-admin-default",
      name: "Super Admin Wolves",
      email: "admin@gmail.com",
      password_hash: "$2b$10$ery0.OO.RTrGrisoZdraA.qyoWfbsILpLGGSEvbuI4I1EmKtI1fdS",
      role_id: "admin",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  News: [
    {
      id: "news-1",
      title: "Wolves U-17 Raih Gelar Juara Perbasi Cup Bogor 2025",
      slug: "wolves-u17-raih-gelar-juara-perbasi-cup-bogor-2025",
      excerpt: "Tampil dominan dengan pertahanan kokoh sejak kuarter pertama, skuad muda Wolves mengunci kemenangan final dramatis 78-71 di GOR Laga Tangkas.",
      content: "Skuad muda Wolves Basketball Club Kabupaten Bogor kelompok usia 17 tahun berhasil menorehkan prestasi gemilang dengan keluar sebagai kampiun Kejuaraan Perbasi Cup Bogor 2025.",
      thumbnail_path: "/images/news-championship.jpg",
      status: "published",
      author_id: "user-admin-default",
      created_at: "2025-05-18T10:00:00.000Z",
      updated_at: "2025-05-18T10:00:00.000Z",
    },
    {
      id: "news-2",
      title: "Open Recruitment: Seleksi Beasiswa Talenta Muda Wolves Academy",
      slug: "open-recruitment-seleksi-beasiswa-talenta-muda-wolves-academy",
      excerpt: "Peluang beasiswa penuh pembinaan basket bagi atlet potensial kelahiran 2008-2012 di wilayah Kabupaten Bogor dan sekitarnya.",
      content: "Wolves Basketball Academy membuka seleksi beasiswa prestasi angkatan 2025.",
      thumbnail_path: "/images/news-recruitment.jpg",
      status: "published",
      author_id: "user-admin-default",
      created_at: "2025-05-12T10:00:00.000Z",
      updated_at: "2025-05-12T10:00:00.000Z",
    },
    {
      id: "news-3",
      title: "Pesta Sportainment Wolves di Pakansari Hadirkan Dunk Show Spektakuler",
      slug: "pesta-sportainment-wolves-di-pakansari-hadirkan-dunk-show-spektakuler",
      excerpt: "Ribuan penonton memadati arena menyaksikan duel bintang 3x3, kompetisi three-point shoot-out komunitas, serta pertunjukan slam dunk eksibisi.",
      content: "Gelaran Wolves Weekend Sportainment di GOR Pakansari sukses memukau pecinta basket Jabodetabek.",
      thumbnail_path: "/images/news-dunk.jpg",
      status: "published",
      author_id: "user-admin-default",
      created_at: "2025-05-05T10:00:00.000Z",
      updated_at: "2025-05-05T10:00:00.000Z",
    },
  ],
  Orders: [
    {
      id: "order-demo-1",
      ticket_number: "WLV-2025-0001",
      user_id: "user-admin-default",
      service_type: "sewa_lapangan",
      customer_name: "Rian Pratama",
      customer_phone: "081288997700",
      booking_date: "2025-06-14 16:00 - 18:00 WIB",
      quantity: 2,
      total_amount: 500000,
      notes: "Sewa lapangan indoor maple Pakansari untuk sparing antar klub.",
      status: "dikonfirmasi",
      admin_notes: "Pembayaran telah divalidasi oleh admin. Lapangan siap dipakai.",
      created_at: "2025-05-19T08:00:00.000Z",
      updated_at: "2025-05-19T09:30:00.000Z",
    },
  ],
  Athletes: [
    {
      id: "ath-1",
      user_id: "user-admin-default",
      name: "Rian Pratama",
      position: "Point Guard",
      jersey_number: "6",
      age: 17,
      height_cm: 182,
      weight_kg: 74,
      photo_url: "/images/hero-basketball.jpg",
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "ath-2",
      user_id: "user-admin-default",
      name: "Fajar Ramadhan",
      position: "Shooting Guard",
      jersey_number: "8",
      age: 18,
      height_cm: 188,
      weight_kg: 78,
      photo_url: "/images/hero-basketball.jpg",
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "ath-3",
      user_id: "user-admin-default",
      name: "Kevin Wijaya",
      position: "Small Forward",
      jersey_number: "12",
      age: 17,
      height_cm: 192,
      weight_kg: 83,
      photo_url: "/images/hero-basketball.jpg",
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "ath-4",
      user_id: "user-admin-default",
      name: "Bima Sakti",
      position: "Power Forward",
      jersey_number: "17",
      age: 18,
      height_cm: 195,
      weight_kg: 89,
      photo_url: "/images/hero-basketball.jpg",
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "ath-5",
      user_id: "user-admin-default",
      name: "Dimas Pratama",
      position: "Center",
      jersey_number: "11",
      age: 19,
      height_cm: 201,
      weight_kg: 96,
      photo_url: "/images/hero-basketball.jpg",
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

async function getLocalData(): Promise<typeof DEFAULT_INITIAL_DATA> {
  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.Orders) parsed.Orders = DEFAULT_INITIAL_DATA.Orders;
    if (!parsed.Athletes) parsed.Athletes = DEFAULT_INITIAL_DATA.Athletes;
    return parsed;
  } catch {
    await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(DEFAULT_INITIAL_DATA, null, 2));
    return DEFAULT_INITIAL_DATA;
  }
}

async function saveLocalData(data: typeof DEFAULT_INITIAL_DATA) {
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

export const db = {
  async find<T = any>(table: "Roles" | "Users" | "News" | "Orders" | "Athletes", query?: Record<string, any>): Promise<T[]> {
    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: APPS_SCRIPT_SECRET,
            table,
            action: "find",
            payload: query || {},
          }),
        });
        const json = await res.json();
        if (json.success) return json.data;
      } catch (e) {
        console.warn("Apps Script call failed, falling back to local database:", e);
      }
    }

    const data = await getLocalData();
    const rows = (data[table] || []) as any[];

    if (!query || Object.keys(query).length === 0) {
      return rows as T[];
    }

    return rows.filter((r) => {
      for (const k in query) {
        if (String(r[k]) !== String(query[k])) return false;
      }
      return true;
    }) as T[];
  },

  async findById<T = any>(table: "Roles" | "Users" | "News" | "Orders" | "Athletes", id: string): Promise<T | null> {
    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: APPS_SCRIPT_SECRET,
            table,
            action: "findById",
            payload: { id },
          }),
        });
        const json = await res.json();
        if (json.success) return json.data;
      } catch (e) {
        console.warn("Apps Script call failed, falling back to local database:", e);
      }
    }

    const data = await getLocalData();
    const rows = (data[table] || []) as any[];
    return (rows.find((r) => String(r.id) === String(id)) || null) as T | null;
  },

  async create<T = any>(table: "Roles" | "Users" | "News" | "Orders" | "Athletes", record: Partial<T>): Promise<T> {
    const id = (record as any).id || crypto.randomUUID();
    const now = new Date().toISOString();
    const fullRecord = {
      ...record,
      id,
      created_at: (record as any).created_at || now,
      updated_at: (record as any).updated_at || now,
    };

    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: APPS_SCRIPT_SECRET,
            table,
            action: "create",
            payload: fullRecord,
          }),
        });
        const json = await res.json();
        if (json.success) return json.data;
      } catch (e) {
        console.warn("Apps Script call failed, falling back to local database:", e);
      }
    }

    const data = await getLocalData();
    if (!data[table]) data[table] = [] as any;
    (data[table] as any[]).push(fullRecord);
    await saveLocalData(data);
    return fullRecord as unknown as T;
  },

  async update<T = any>(table: "Roles" | "Users" | "News" | "Orders" | "Athletes", id: string, updateData: Partial<T>): Promise<boolean> {
    const now = new Date().toISOString();
    const payload = { ...updateData, updated_at: now };

    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: APPS_SCRIPT_SECRET,
            table,
            action: "update",
            payload: { id, data: payload },
          }),
        });
        const json = await res.json();
        if (json.success) return true;
      } catch (e) {
        console.warn("Apps Script call failed, falling back to local database:", e);
      }
    }

    const data = await getLocalData();
    if (!data[table]) data[table] = [] as any;
    const rows = data[table] as any[];
    const idx = rows.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return false;

    rows[idx] = { ...rows[idx], ...payload };
    await saveLocalData(data);
    return true;
  },

  async delete(table: "Roles" | "Users" | "News" | "Orders" | "Athletes", id: string): Promise<boolean> {
    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: APPS_SCRIPT_SECRET,
            table,
            action: "delete",
            payload: { id },
          }),
        });
        const json = await res.json();
        if (json.success) return true;
      } catch (e) {
        console.warn("Apps Script call failed, falling back to local database:", e);
      }
    }

    const data = await getLocalData();
    if (!data[table]) return false;
    const rows = data[table] as any[];
    const idx = rows.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return false;

    rows.splice(idx, 1);
    await saveLocalData(data);
    return true;
  },
};
