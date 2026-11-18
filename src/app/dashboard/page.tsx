"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Shield, Newspaper, AlertTriangle, ArrowRight, Database, CheckCircle2, Trophy, ShoppingBag } from "lucide-react";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    userCount: 0,
    roleCount: 0,
    newsCount: 0,
    athleteCount: 0,
    pendingAthletes: 0,
    pendingOrders: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users").then((res) => res.json()),
      fetch("/api/admin/roles").then((res) => res.json()),
      fetch("/api/admin/news").then((res) => res.json()),
      fetch("/api/admin/athletes").then((res) => res.json()),
      fetch("/api/admin/orders").then((res) => res.json()),
    ])
      .then(([usersRes, rolesRes, newsRes, athletesRes, ordersRes]) => {
        const athletes = athletesRes.data || [];
        const orders = ordersRes.data || [];
        const confirmedOrders = orders.filter((o: any) => o.status === "dikonfirmasi");
        const rev = confirmedOrders.reduce((acc: number, o: any) => acc + (o.total_amount || 0), 0);

        setStats({
          userCount: usersRes.data ? usersRes.data.length : 0,
          roleCount: rolesRes.data ? rolesRes.data.length : 0,
          newsCount: newsRes.data ? newsRes.data.length : 0,
          athleteCount: athletes.filter((a: any) => a.status === "approved").length,
          pendingAthletes: athletes.filter((a: any) => a.status === "pending").length,
          pendingOrders: orders.filter((o: any) => o.status === "menunggu_konfirmasi").length,
          totalOrders: orders.length,
          revenue: rev,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl uppercase text-white tracking-tight">
          Ringkasan Dashboard
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
          Pusat kendali akun pengguna, verifikasi pendaftaran atlet, hak akses, dan konten warta Wolves Kab. Bogor.
        </p>
      </div>

      {/* Alert Pending Pesanan & QRIS */}
      {stats.pendingOrders > 0 && (
        <div className="p-4 sm:p-5 bg-secondary-container/20 border border-secondary-container/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 text-primary-container shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h4 className="font-display font-bold text-sm uppercase text-white">
                Ada {stats.pendingOrders} Pesanan &amp; Pembayaran QRIS Menunggu Konfirmasi!
              </h4>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                Calon atlet akademi / pembeli merchandise telah mengirimkan bukti transfer. Periksa bukti bayar dan konfirmasi transaksi.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/orders"
            className="px-4 py-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shrink-0 transition-colors shadow-lg"
          >
            Konfirmasi Pesanan
          </Link>
        </div>
      )}

      {/* Alert Pending ACC Atlet */}
      {stats.pendingAthletes > 0 && (
        <div className="p-4 sm:p-5 bg-amber-950/40 border border-amber-500/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h4 className="font-display font-bold text-sm uppercase text-white">
                Ada {stats.pendingAthletes} Pendaftaran Atlet Baru Menunggu ACC!
              </h4>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                Calon atlet telah mengisi data posisi, tinggi, berat badan, dan foto. Klik tombol di samping untuk memeriksa dan menyetujui (ACC).
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/athletes"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shrink-0 transition-colors shadow-lg"
          >
            Verifikasi Atlet Sekarang
          </Link>
        </div>
      )}

      {/* Security Alert: Change Default Password */}
      <div className="p-4 sm:p-5 bg-tertiary-container/15 border border-tertiary-container/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-tertiary-container shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-sm uppercase text-white">
              Peringatan Keamanan Kredensial Admin Awal
            </h4>
            <p className="font-body text-xs text-on-surface-variant mt-0.5">
              Akun admin awal dibuat dengan kredensial publik (<strong className="text-white">admin@gmail.com / 123456</strong>). Harap ganti password admin sebelum website ini dipublikasikan ke production.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/profile"
          className="px-4 py-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shrink-0 transition-colors"
        >
          Ganti Password Sekarang
        </Link>
      </div>

      {/* Metric Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface-container border border-white/5 p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs uppercase text-outline">Pesanan &amp; QRIS</span>
            <div className="w-9 h-9 rounded-lg bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-center text-primary-container">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-white">
            {loading ? "..." : stats.totalOrders}
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1 font-display text-xs uppercase font-bold text-primary-container hover:underline"
          >
            <span>{stats.pendingOrders} Menunggu Validasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-surface-container border border-white/5 p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs uppercase text-outline">Pemain Atlet Resmi</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-white">
            {loading ? "..." : stats.athleteCount}
          </div>
          <Link
            href="/dashboard/athletes"
            className="inline-flex items-center gap-1 font-display text-xs uppercase font-bold text-primary-container hover:underline"
          >
            <span>Verifikasi ({stats.pendingAthletes} pending)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-surface-container border border-white/5 p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs uppercase text-outline">Total Pengguna</span>
            <div className="w-9 h-9 rounded-lg bg-secondary-container/20 flex items-center justify-center text-primary-container">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-white">
            {loading ? "..." : stats.userCount}
          </div>
          <Link
            href="/dashboard/users"
            className="inline-flex items-center gap-1 font-display text-xs uppercase font-bold text-primary-container hover:underline"
          >
            <span>Kelola User</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-surface-container border border-white/5 p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs uppercase text-outline">Role Sistem</span>
            <div className="w-9 h-9 rounded-lg bg-secondary-container/20 flex items-center justify-center text-primary-container">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-white">
            {loading ? "..." : stats.roleCount}
          </div>
          <Link
            href="/dashboard/roles"
            className="inline-flex items-center gap-1 font-display text-xs uppercase font-bold text-primary-container hover:underline"
          >
            <span>Kelola Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-surface-container border border-white/5 p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs uppercase text-outline">Artikel Berita</span>
            <div className="w-9 h-9 rounded-lg bg-secondary-container/20 flex items-center justify-center text-primary-container">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-white">
            {loading ? "..." : stats.newsCount}
          </div>
          <Link
            href="/dashboard/news"
            className="inline-flex items-center gap-1 font-display text-xs uppercase font-bold text-primary-container hover:underline"
          >
            <span>Tulis Berita Baru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Database & Architecture Status */}
      <div className="bg-surface-container border border-white/5 p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary-container" />
          <div>
            <h3 className="font-display font-bold text-base uppercase text-white">
              Status Database Google Spreadsheet & Apps Script
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              Arsitektur aman: Browser memanggil Next.js API, Next.js memanggil Apps Script Web App dengan shared secret token.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-surface-container-low border border-white/5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-display font-bold text-primary-container uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Modul Apps Script (`code.gs` & `setup.gs`)</span>
            </div>
            <p className="font-body text-xs text-on-surface-variant">
              Telah disiapkan di direktori root. Kode ini idempoten dan siap disalin ke Google Apps Script editor Anda.
            </p>
          </div>

          <div className="p-4 bg-surface-container-low border border-white/5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-display font-bold text-primary-container uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Penyimpanan Media Lokal</span>
            </div>
            <p className="font-body text-xs text-on-surface-variant">
              Media thumbnail & foto atlet disimpan di `public/uploads/` (hanya path string yang dikirim ke database).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
