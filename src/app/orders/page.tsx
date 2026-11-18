"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";

interface OrderItem {
  id: string;
  ticket_number: string;
  user_id: string;
  service_type: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  quantity: number;
  total_amount: number;
  notes: string;
  items_detail?: string;
  payment_proof?: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  admin_notes?: string;
  created_at: string;
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 401) {
          window.location.href = "/login?redirect=/orders";
          return;
        }
        throw new Error(data.error || "Gagal memuat pesanan.");
      }
      setOrders(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dikonfirmasi":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-display text-[11px] font-bold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Dikonfirmasi (Lunas)</span>
          </span>
        );
      case "dibatalkan":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-display text-[11px] font-bold uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" />
            <span>Dibatalkan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-display text-[11px] font-bold uppercase tracking-wider animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Konfirmasi Admin</span>
          </span>
        );
    }
  };

  const getServiceLabel = (type: string) => {
    switch (type) {
      case "akademi":
        return "Pendaftaran Akademi Usia Muda";
      case "merchandise":
        return "Official Merchandise Wolves";
      case "sewa_lapangan":
        return "Sewa Lapangan GOR Pakansari";
      default:
        return "Layanan Pertandingan / Sportainment";
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-6 bg-secondary-container rounded-sm" />
                <span className="font-display font-bold text-xs uppercase tracking-widest text-primary-container">
                  PORTAL PEMESANAN &amp; TIKET
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase text-white tracking-tight">
                PESANAN <span className="text-primary-container">ANDA</span>
              </h1>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
                Daftar tiket pendaftaran akademi, sewa court, dan pembelian official merchandise Wolves Anda.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/merchandise"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-white/10 rounded-lg text-white font-display text-xs font-bold uppercase tracking-wider transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-primary-container" />
                <span>Beli Merchandise</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Daftar Akademi</span>
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container/30 border border-error/50 rounded-xl flex items-start gap-2.5 text-xs text-white">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary-container animate-spin mx-auto" />
              <p className="font-display text-xs uppercase tracking-wider text-outline">
                Memuat tiket pesanan Anda...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center bg-surface-container border border-white/5 rounded-2xl p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto text-outline">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg uppercase text-white">
                  Belum Ada Pesanan
                </h3>
                <p className="font-body text-xs text-outline max-w-sm mx-auto">
                  Anda belum memiliki riwayat pendaftaran akademi atau pembelian merchandise.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase rounded-lg shadow-md transition-all"
                >
                  Daftar Akademi Atlet
                </Link>
                <Link
                  href="/merchandise"
                  className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-white font-display text-xs font-bold uppercase rounded-lg border border-white/10 transition-all"
                >
                  Belanja Merchandise
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-surface-container border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl hover:border-primary-container/30 transition-all duration-200 space-y-4"
                >
                  {/* Top Bar: Ticket Number & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="space-y-1">
                      <span className="font-display font-black text-xs text-primary-container tracking-wider uppercase block">
                        NOMOR TIKET: {order.ticket_number}
                      </span>
                      <h2 className="font-display font-black text-lg uppercase text-white">
                        {getServiceLabel(order.service_type)}
                      </h2>
                    </div>

                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="font-display text-[10px] text-outline uppercase block">Nama Pemesan</span>
                      <span className="font-body font-bold text-white mt-0.5 block">{order.customer_name}</span>
                    </div>

                    <div>
                      <span className="font-display text-[10px] text-outline uppercase block">Tanggal</span>
                      <span className="font-body text-white mt-0.5 block">{order.booking_date}</span>
                    </div>

                    <div>
                      <span className="font-display text-[10px] text-outline uppercase block">Nomor WhatsApp</span>
                      <span className="font-body text-white mt-0.5 block">{order.customer_phone}</span>
                    </div>

                    <div>
                      <span className="font-display text-[10px] text-outline uppercase block">Total Pembayaran</span>
                      <span className="font-display font-black text-sm text-primary-container mt-0.5 block">
                        Rp {order.total_amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Rincian */}
                  {order.notes && (
                    <div className="p-3 bg-surface-container-low rounded-xl border border-white/5 text-xs text-on-surface-variant font-body">
                      <strong className="text-white font-display uppercase text-[10px] block mb-0.5">Catatan:</strong>
                      {order.notes}
                    </div>
                  )}

                  {/* Status Messages */}
                  {order.status === "dikonfirmasi" && (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1 text-xs animate-in fade-in">
                      <div className="flex items-center gap-2 font-display font-bold uppercase text-emerald-400">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>Pembayaran Telah Dikonfirmasi Resmi Oleh Admin!</span>
                      </div>
                      <p className="font-body text-emerald-200/90 leading-relaxed pl-6">
                        Selamat, pembayaran Anda telah diverifikasi oleh manajemen Wolves. {order.service_type === "akademi" ? "Data Anda telah otomatis disetujui (ACC) sebagai Pemain Atlet Wolves dan jadwal latihan perdana akan dikirimkan oleh coach via WhatsApp." : "Pesanan merchandise Anda sedang dikemas dan nomor resi pengiriman akan dikirimkan via WhatsApp."}
                      </p>
                      {order.admin_notes && (
                        <p className="font-body text-emerald-300 italic pl-6 pt-1">
                          Pesan Admin: &quot;{order.admin_notes}&quot;
                        </p>
                      )}
                    </div>
                  )}

                  {order.status === "menunggu_konfirmasi" && (
                    <div className="p-3 bg-surface-container-high rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-outline">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Bukti pembayaran QRIS sedang ditinjau oleh staf admin Wolves.</span>
                      </div>
                      <a
                        href={`https://wa.me/6281288997700?text=Halo%20Admin%20Wolves,%20saya%20sudah%20melakukan%20pembayaran%20dengan%20nomor%20tiket%20${order.ticket_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-display text-[11px] font-bold uppercase rounded-lg shadow-sm transition-colors self-start sm:self-auto"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Konfirmasi via WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
