"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  X,
  Phone,
  User,
  MapPin,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  badge?: string;
  sizes: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "prod-jersey-home",
    name: "Wolves Official Game Jersey #WeAreWolves",
    category: "Game Jersey",
    price: 250000,
    image: "/images/service-merch.jpg",
    description: "Jersey tanding resmi Wolves Basketball Club dengan bahan breathable mesh standar FIBA, anti-bakteri, dan nomor/nama custom.",
    badge: "Official Matchwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "prod-hoodie-obsidian",
    name: "Wolves Obsidian Heavyweight Hoodie",
    category: "Apparel & Lifestyle",
    price: 350000,
    image: "/images/hero-basketball.jpg",
    description: "Hoodie premium fleece katun tebal dengan emblem serigala Wolves bordir timbul 3D dan aksen Electric Crimson di lining tudung.",
    badge: "Best Seller",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: "prod-training-tee",
    name: "Wolves Performance Training Shirt",
    category: "Training Gear",
    price: 150000,
    image: "/images/about-clinic.jpg",
    description: "Kaos latihan berteknologi quick-dry ultra ringan. Dirancang khusus untuk sesi drill fisik intens dan shooting practice.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "prod-cap-snapback",
    name: "Wolves Apex Snapback Official Cap",
    category: "Headwear",
    price: 120000,
    image: "/images/service-merch.jpg",
    description: "Topi snapback premium dengan logo Wolves bordir presisi, visor datar dengan aksen maroon kontras di bagian bawah.",
    sizes: ["All Size"],
  },
];

export default function MerchandisePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<{ ticketNumber: string } | null>(null);

  const openOrderModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || "L");
    setQuantity(1);
    setError("");
    setOrderSuccess(null);
  };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProof(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setError("");

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setError("Nama penerima, nomor WhatsApp, dan alamat pengiriman wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const totalAmount = selectedProduct.price * quantity;
      const itemsDetail = JSON.stringify({
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        size: selectedSize,
        quantity,
        shipping_address: shippingAddress.trim(),
      });

      const formData = new FormData();
      formData.append("service_type", "merchandise");
      formData.append("customer_name", customerName.trim());
      formData.append("customer_phone", customerPhone.trim());
      formData.append("quantity", String(quantity));
      formData.append("total_amount", String(totalAmount));
      formData.append("items_detail", itemsDetail);
      formData.append(
        "notes",
        `Pesanan ${selectedProduct.name} (${selectedSize}) x${quantity}. Catatan: ${notes.trim() || "-"}`
      );

      if (paymentProof) {
        formData.append("payment_proof", paymentProof);
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      setOrderSuccess({ ticketNumber: data.data.ticket_number });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-6 bg-secondary-container rounded-sm" />
                <span className="font-display font-bold text-xs uppercase tracking-widest text-primary-container">
                  OFFICIAL APPAREL &amp; GEAR
                </span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight">
                OFFICIAL <span className="text-primary-container">MERCHANDISE</span>
              </h1>
              <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl">
                Dapatkan jersey tanding resmi, hoodie eksklusif, dan perlengkapan latihan Wolves Basketball Club Kabupaten Bogor. Bayar mudah via QRIS nasional!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-surface-container/80 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-center text-primary-container">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-bold text-xs uppercase text-white block">
                  Pengiriman Seluruh Indonesia
                </span>
                <span className="font-body text-[11px] text-outline">
                  Packing aman &amp; pengiriman cepat dari Cibinong
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-primary-container/40 hover:shadow-[0_12px_32px_rgba(187,1,2,0.3)] transition-all duration-300 flex flex-col group"
              >
                <div className="h-60 bg-surface-container-high relative overflow-hidden">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-80" />

                  {prod.badge && (
                    <div className="absolute top-3 left-3 bg-secondary-container/95 text-white px-2.5 py-1 rounded font-display font-black text-[10px] uppercase shadow-lg border border-white/10">
                      {prod.badge}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-display font-black text-lg text-primary-container drop-shadow-md">
                      Rp {prod.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] font-display font-bold uppercase text-outline bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {prod.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-base uppercase text-white line-clamp-1 group-hover:text-primary-container transition-colors">
                      {prod.name}
                    </h3>
                    <p className="font-body text-xs text-on-surface-variant line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-display font-bold uppercase text-outline">Ukuran:</span>
                      {prod.sizes.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-surface-container-high border border-white/5 font-display text-[10px] font-bold text-white"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => openOrderModal(prod)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg shadow-md transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Beli via QRIS</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CHECKOUT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-7 space-y-5 relative my-8 shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-outline hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {orderSuccess ? (
              <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl uppercase text-white">
                    Pesanan Berhasil Dikirim!
                  </h3>
                  <p className="font-body text-xs text-outline max-w-sm mx-auto">
                    Admin Wolves akan segera memverifikasi pembayaran Anda dan menghubungi melalui WhatsApp untuk konfirmasi pengiriman.
                  </p>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl border border-white/5 inline-block text-left space-y-1">
                  <span className="font-display font-bold text-[10px] uppercase text-outline tracking-wider block">
                    Nomor Tiket Pesanan
                  </span>
                  <span className="font-display font-black text-lg text-primary-container block tracking-wider">
                    {orderSuccess.ticketNumber}
                  </span>
                  <span className="font-body text-[11px] text-amber-400 block">
                    Status: Menunggu Konfirmasi Admin
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/orders"
                    className="inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Lihat di Pesanan Anda</span>
                  </Link>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-outline hover:text-white font-display text-xs font-bold uppercase rounded-lg border border-white/5 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm uppercase text-white">
                      {selectedProduct.name}
                    </h3>
                    <span className="font-display font-black text-primary-container text-sm">
                      Rp {selectedProduct.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-error-container/30 border border-error/50 rounded-xl flex items-start gap-2 text-xs text-white">
                    <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Ukuran & Jumlah */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-display font-bold text-[11px] uppercase tracking-wider text-outline mb-1">
                      Pilih Ukuran
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-3 py-2 rounded-lg font-display text-xs uppercase font-bold focus:ring-2 focus:ring-secondary-container"
                    >
                      {selectedProduct.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-display font-bold text-[11px] uppercase tracking-wider text-outline mb-1">
                      Jumlah (Pcs)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-3 py-2 rounded-lg font-display text-xs font-bold focus:ring-2 focus:ring-secondary-container"
                    />
                  </div>
                </div>

                {/* Form Kontak & Alamat */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-display font-bold text-[11px] uppercase tracking-wider text-outline mb-1">
                      Nama Penerima *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-outline absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Nama lengkap penerima"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 text-white pl-9 pr-3 py-2 rounded-lg font-body text-xs focus:ring-2 focus:ring-secondary-container"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-display font-bold text-[11px] uppercase tracking-wider text-outline mb-1">
                      Nomor WhatsApp Penerima *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-outline absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="081234567890"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 text-white pl-9 pr-3 py-2 rounded-lg font-body text-xs focus:ring-2 focus:ring-secondary-container"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-display font-bold text-[11px] uppercase tracking-wider text-outline mb-1">
                      Alamat Pengiriman Lengkap *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-outline absolute left-3 top-2.5" />
                      <textarea
                        rows={2}
                        required
                        placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 text-white pl-9 pr-3 py-2 rounded-lg font-body text-xs focus:ring-2 focus:ring-secondary-container"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-display font-bold text-[11px] uppercase tracking-wider text-outline mb-1">
                      Catatan (Custom Nama/Nomor Jersey)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Sablon Nama 'RIZKY' No. 23"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-3 py-2 rounded-lg font-body text-xs focus:ring-2 focus:ring-secondary-container"
                    />
                  </div>
                </div>

                {/* Section QRIS Payment */}
                <div className="p-3 bg-surface-container-low rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs uppercase text-primary-container">
                      Total Tagihan QRIS:
                    </span>
                    <span className="font-display font-black text-lg text-white">
                      Rp {(selectedProduct.price * quantity).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg">
                    <div className="relative w-44 h-44">
                      <Image
                        src="/images/qris-wolves.png"
                        alt="QRIS Wolves"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-display font-bold uppercase text-slate-800 mt-1">
                      WOLVES BASKETBALL CLUB
                    </span>
                  </div>

                  <label className="block cursor-pointer p-2.5 bg-surface-container border border-dashed border-white/20 hover:border-primary-container rounded-lg text-center font-display text-[11px] font-bold uppercase text-outline hover:text-white transition-colors">
                    <Upload className="w-3.5 h-3.5 inline mr-1.5 text-primary-container" />
                    <span>{paymentProof ? paymentProof.name : "Upload Bukti Transfer QRIS"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleProofChange}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container disabled:opacity-60 text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider py-3 rounded-lg shadow-lg transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{loading ? "Memproses Pesanan..." : "Kirim Pesanan Sekarang"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
