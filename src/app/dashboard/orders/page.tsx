"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MessageCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  Eye,
  X,
  CreditCard,
  User,
  Phone,
  Calendar,
  Sparkles,
  Trophy,
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
  athlete_id?: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Modal Detail & Bukti Bayar
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<OrderItem | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setOrders(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (order: OrderItem, newStatus: string, notes?: string) => {
    setActionLoading(order.id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          status: newStatus,
          admin_notes: notes || (newStatus === "dikonfirmasi" ? "Pembayaran QRIS telah diverifikasi valid oleh admin." : "Pesanan dibatalkan."),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(data.message || `Status pesanan ${order.ticket_number} berhasil diperbarui.`);
      setShowRejectModal(null);
      setRejectReason("");
      fetchOrders();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter logika
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.toLowerCase().includes(search.toLowerCase()) ||
      (o.notes && o.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    const matchesType = filterType === "all" || o.service_type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Metrik ringkasan
  const pendingCount = orders.filter((o) => o.status === "menunggu_konfirmasi").length;
  const confirmedCount = orders.filter((o) => o.status === "dikonfirmasi").length;
  const totalRevenue = orders
    .filter((o) => o.status === "dikonfirmasi")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // Format nomor WhatsApp internasional (62xxx)
  const formatWaNumber = (phone: string) => {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    }
    return clean;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl uppercase text-white tracking-tight flex items-center gap-2">
            <span>Manajemen Pesanan &amp; QRIS</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full animate-pulse">
                {pendingCount} Menunggu Konfirmasi
              </span>
            )}
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Validasi pembayaran QRIS untuk pendaftaran akademi atlet dan pembelian merchandise.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container border border-white/5 p-4 rounded-xl space-y-1">
          <span className="font-display font-bold text-xs uppercase text-outline">Menunggu Konfirmasi</span>
          <div className="font-display font-black text-2xl text-amber-400">{pendingCount} Pesanan</div>
          <p className="font-body text-[11px] text-outline">Perlu pengecekan bukti transfer QRIS</p>
        </div>

        <div className="bg-surface-container border border-white/5 p-4 rounded-xl space-y-1">
          <span className="font-display font-bold text-xs uppercase text-outline">Pembayaran Dikonfirmasi</span>
          <div className="font-display font-black text-2xl text-emerald-400">{confirmedCount} Tiket</div>
          <p className="font-body text-[11px] text-outline">Transaksi lunas &amp; aktif</p>
        </div>

        <div className="bg-surface-container border border-white/5 p-4 rounded-xl space-y-1">
          <span className="font-display font-bold text-xs uppercase text-outline">Total Dana Masuk (Lunas)</span>
          <div className="font-display font-black text-2xl text-primary-container">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </div>
          <p className="font-body text-[11px] text-outline">Akademi &amp; Merchandise</p>
        </div>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="p-3 bg-error-container/30 border border-error/50 rounded-xl flex items-start gap-2.5 text-xs text-white">
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-surface-container p-3 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-outline absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nomor tiket, nama pemesan, no WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-high border border-white/5 text-white pl-9 pr-3 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-surface-container-high border border-white/5 text-white px-3 py-2 rounded-lg text-xs font-display font-bold uppercase focus:ring-2 focus:ring-secondary-container"
          >
            <option value="all">Semua Status</option>
            <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
            <option value="dikonfirmasi">Dikonfirmasi (Lunas)</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-surface-container-high border border-white/5 text-white px-3 py-2 rounded-lg text-xs font-display font-bold uppercase focus:ring-2 focus:ring-secondary-container"
          >
            <option value="all">Semua Layanan</option>
            <option value="akademi">Akademi Atlet</option>
            <option value="merchandise">Merchandise</option>
            <option value="sewa_lapangan">Sewa Court</option>
          </select>
        </div>
      </div>

      {/* Orders List / Cards */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary-container animate-spin mx-auto" />
          <p className="font-display text-xs uppercase tracking-wider text-outline">
            Memuat daftar pesanan...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-surface-container border border-white/5 rounded-2xl p-6 text-outline text-xs">
          Tidak ada data pesanan yang cocok dengan pencarian / filter ini.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            let detailsObj: any = null;
            if (order.items_detail) {
              try {
                detailsObj = JSON.parse(order.items_detail);
              } catch (e) {}
            }

            const waText = encodeURIComponent(
              `Halo Kak ${order.customer_name}, kami dari Admin Wolves Basketball Club mengonfirmasi pesanan tiket ${order.ticket_number} sebesar Rp ${order.total_amount.toLocaleString("id-ID")}.`
            );
            const waUrl = `https://wa.me/${formatWaNumber(order.customer_phone)}?text=${waText}`;

            return (
              <div
                key={order.id}
                className={`bg-surface-container border rounded-2xl p-5 shadow-lg space-y-4 transition-all duration-200 ${
                  order.status === "menunggu_konfirmasi"
                    ? "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    : "border-white/5"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        order.service_type === "akademi"
                          ? "bg-secondary-container/20 text-primary-container border border-secondary-container/40"
                          : "bg-surface-container-high text-white border border-white/10"
                      }`}
                    >
                      {order.service_type === "akademi" ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <ShoppingBag className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm text-primary-container tracking-wider">
                          {order.ticket_number}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-display font-bold uppercase bg-surface-container-high text-outline">
                          {order.service_type === "akademi" ? "Pendaftaran Akademi" : "Merchandise"}
                        </span>
                      </div>
                      <h2 className="font-display font-bold text-base text-white mt-0.5">
                        {order.customer_name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {order.status === "dikonfirmasi" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-display text-[11px] font-bold uppercase">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Dikonfirmasi (Lunas)</span>
                      </span>
                    )}
                    {order.status === "dibatalkan" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-display text-[11px] font-bold uppercase">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Dibatalkan</span>
                      </span>
                    )}
                    {order.status === "menunggu_konfirmasi" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-display text-[11px] font-bold uppercase animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Menunggu Konfirmasi Admin</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="font-display text-[10px] text-outline uppercase block">WhatsApp</span>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body font-bold text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{order.customer_phone}</span>
                    </a>
                  </div>

                  <div>
                    <span className="font-display text-[10px] text-outline uppercase block">Tanggal Order</span>
                    <span className="font-body text-white mt-0.5 block">{order.booking_date}</span>
                  </div>

                  <div>
                    <span className="font-display text-[10px] text-outline uppercase block">Total Bayar (QRIS)</span>
                    <span className="font-display font-black text-sm text-primary-container mt-0.5 block">
                      Rp {order.total_amount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div>
                    <span className="font-display text-[10px] text-outline uppercase block">Bukti Bayar</span>
                    {order.payment_proof ? (
                      <button
                        onClick={() => setPreviewImage(order.payment_proof || null)}
                        className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-primary-container hover:underline mt-0.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Bukti Transfer</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-outline mt-0.5 block">Belum ada lampiran</span>
                    )}
                  </div>
                </div>

                {/* Extended Details Box */}
                {(detailsObj || order.notes) && (
                  <div className="p-3 bg-surface-container-low rounded-xl border border-white/5 text-xs text-on-surface-variant font-body space-y-1">
                    {order.service_type === "akademi" && detailsObj && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-white">
                        <span><strong>Posisi:</strong> {detailsObj.position}</span>
                        <span><strong>Asal:</strong> {detailsObj.origin}</span>
                        <span><strong>Usia:</strong> {detailsObj.age} Thn ({detailsObj.birth_date})</span>
                        <span><strong>Fisik:</strong> {detailsObj.height_cm} cm / {detailsObj.weight_kg} kg</span>
                        {detailsObj.jersey_number && <span><strong>No:</strong> #{detailsObj.jersey_number}</span>}
                      </div>
                    )}
                    {order.service_type === "merchandise" && detailsObj && (
                      <div className="text-white space-y-0.5">
                        <div><strong>Produk:</strong> {detailsObj.product_name} (Ukuran: {detailsObj.size}, Jumlah: {detailsObj.quantity} pcs)</div>
                        <div><strong>Alamat Kirim:</strong> {detailsObj.shipping_address}</div>
                      </div>
                    )}
                    {order.notes && (
                      <div className="text-outline pt-1 text-[11px]">
                        <strong>Catatan Pemesan:</strong> {order.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs font-bold uppercase rounded-lg shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Hubungi via WhatsApp</span>
                  </a>

                  <div className="flex items-center gap-2">
                    {order.status === "menunggu_konfirmasi" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order, "dikonfirmasi")}
                          disabled={actionLoading === order.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all"
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          <span>Konfirmasi Pembayaran (ACC)</span>
                        </button>

                        <button
                          onClick={() => setShowRejectModal(order)}
                          disabled={actionLoading === order.id}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-display text-xs font-bold uppercase rounded-lg border border-red-500/30 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Batalkan / Tolak</span>
                        </button>
                      </>
                    )}

                    {order.status === "dikonfirmasi" && (
                      <span className="text-[11px] text-emerald-400 font-display font-bold uppercase flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Lunas &amp; Terverifikasi</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL PREVIEW BUKTI BAYAR */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="bg-surface-container border border-white/10 rounded-2xl max-w-lg w-full p-4 space-y-3 relative shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-display font-bold text-xs uppercase text-white">
                Bukti Transfer / Struk QRIS
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 text-outline hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
              <Image
                src={previewImage}
                alt="Bukti Transfer"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL TOLAK / BATALKAN PESANAN */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-surface-container border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <h3 className="font-display font-bold text-base uppercase text-white">
              Tolak / Batalkan Pesanan {showRejectModal.ticket_number}
            </h3>
            <p className="font-body text-xs text-outline">
              Berikan alasan pembatalan (misalnya: nominal tidak sesuai, QRIS belum masuk, dsb.). Alasan ini akan tampil di akun pemesan.
            </p>
            <textarea
              rows={3}
              placeholder="Contoh: Bukti transfer belum terbaca jelas, mohon hubungi admin via WA."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-surface-container-high border border-white/5 text-white p-3 rounded-lg text-xs font-body focus:ring-2 focus:ring-secondary-container"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-4 py-2 bg-surface-container-high text-outline hover:text-white font-display text-xs font-bold uppercase rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => handleUpdateStatus(showRejectModal, "dibatalkan", rejectReason)}
                disabled={actionLoading === showRejectModal.id}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-display text-xs font-bold uppercase rounded-lg"
              >
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
