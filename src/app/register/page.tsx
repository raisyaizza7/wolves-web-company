"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  Trophy,
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Wizard Step: 1 = Akun & Tipe, 2 = Pembayaran QRIS, 3 = Biodata Atlet
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isAthlete, setIsAthlete] = useState(true);

  // Step 1: Akun state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Pembayaran QRIS state
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Step 3: Biodata Atlet state
  const [origin, setOrigin] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [calculatedAge, setCalculatedAge] = useState<number>(17);
  const [position, setPosition] = useState("Point Guard");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [heightCm, setHeightCm] = useState<number | "">(180);
  const [weightKg, setWeightKg] = useState<number | "">(75);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [notes, setNotes] = useState("");

  // Feedback state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<{
    ticketNumber?: string;
    message: string;
  } | null>(null);

  // Hitung umur otomatis dari tanggal lahir
  const handleBirthDateChange = (val: string) => {
    setBirthDate(val);
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age > 0 && age < 60) {
        setCalculatedAge(age);
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
      setPaymentConfirmed(true);
    }
  };

  // Navigasi Step 1 -> Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Semua bidang pada informasi akun wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }

    if (!isAthlete) {
      // Jika hanya daftar anggota biasa tanpa program akademi, langsung kirim
      submitRegistration();
      return;
    }

    // Jika daftar atlet akademi, lanjut ke Step 2 (Pembayaran QRIS)
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigasi Step 2 -> Step 3
  const handleProceedToStep3 = () => {
    setError("");
    if (!paymentConfirmed && !paymentProofFile) {
      setError("Silakan konfirmasi bahwa Anda telah melakukan pembayaran QRIS dan lampirkan bukti transfer.");
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Final
  const submitRegistration = async () => {
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phone", phone.trim());
      formData.append("password", password);
      formData.append("is_athlete", isAthlete ? "true" : "false");

      if (isAthlete) {
        formData.append("origin", origin.trim() || "Kabupaten Bogor");
        formData.append("birth_date", birthDate);
        formData.append("age", String(calculatedAge || 17));
        formData.append("position", position);
        formData.append("jersey_number", jerseyNumber.trim() || "-");
        formData.append("height_cm", String(heightCm || 180));
        formData.append("weight_kg", String(weightKg || 75));
        formData.append("notes", notes.trim());

        if (photoFile) {
          formData.append("photo", photoFile);
        }
        if (paymentProofFile) {
          formData.append("payment_proof", paymentProofFile);
        }
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal melakukan pendaftaran.");
      }

      setSuccessData({
        ticketNumber: data.order?.ticket_number || undefined,
        message: data.message,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-4 py-12 relative overflow-hidden">
      {/* Ambient Red Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary-container/20 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-2xl bg-surface-container border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-1">
            <div className="w-14 h-14 flex items-center justify-center">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={56}
                height={56}
                className="object-contain drop-shadow-[0_0_16px_rgba(255,85,64,0.45)]"
              />
            </div>
          </Link>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase text-white tracking-wide">
            Pendaftaran Atlet & Anggota
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
            Bergabunglah bersama Wolves Basketball Club Kabupaten Bogor dan mulai perjalanan prestasi Anda.
          </p>
        </div>

        {/* Multi-Step Indicator (Khusus Pendaftaran Atlet) */}
        {!successData && isAthlete && (
          <div className="pt-2">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div
                className={`py-2 px-1 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                  currentStep === 1
                    ? "bg-secondary-container text-white border-primary-container shadow-md"
                    : currentStep > 1
                    ? "bg-surface-container-high text-emerald-400 border-emerald-500/30"
                    : "bg-surface-container-low text-outline border-white/5"
                }`}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-display font-bold text-[10px] bg-black/30">
                  1
                </div>
                <span className="font-display font-bold uppercase text-[10px] tracking-wider truncate max-w-full px-1">
                  Akun & Kontak
                </span>
              </div>

              <div
                className={`py-2 px-1 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                  currentStep === 2
                    ? "bg-secondary-container text-white border-primary-container shadow-md"
                    : currentStep > 2
                    ? "bg-surface-container-high text-emerald-400 border-emerald-500/30"
                    : "bg-surface-container-low text-outline border-white/5"
                }`}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-display font-bold text-[10px] bg-black/30">
                  2
                </div>
                <span className="font-display font-bold uppercase text-[10px] tracking-wider truncate max-w-full px-1">
                  Bayar QRIS
                </span>
              </div>

              <div
                className={`py-2 px-1 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                  currentStep === 3
                    ? "bg-secondary-container text-white border-primary-container shadow-md"
                    : "bg-surface-container-low text-outline border-white/5"
                }`}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-display font-bold text-[10px] bg-black/30">
                  3
                </div>
                <span className="font-display font-bold uppercase text-[10px] tracking-wider truncate max-w-full px-1">
                  Biodata Atlet
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Alert Error */}
        {error && (
          <div className="p-3 bg-error-container/30 border border-error/50 rounded-xl flex items-start gap-2.5 text-xs text-white">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* SUKSES SCREEN */}
        {successData ? (
          <div className="p-6 bg-surface-container-high border border-emerald-500/40 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display font-black text-xl uppercase text-white">
                Pendaftaran & Pembayaran Berhasil Dikirim!
              </h2>
              <p className="font-body text-xs sm:text-sm text-outline max-w-md mx-auto">
                {successData.message}
              </p>
            </div>

            {successData.ticketNumber && (
              <div className="bg-surface-container p-4 rounded-xl border border-white/5 inline-block text-left space-y-1">
                <span className="font-display font-bold text-[10px] uppercase text-outline tracking-wider block">
                  Nomor Tiket Pesanan Anda
                </span>
                <span className="font-display font-black text-lg text-primary-container block tracking-wider">
                  {successData.ticketNumber}
                </span>
                <span className="font-body text-[11px] text-on-surface-variant block">
                  Status: <strong className="text-amber-400">Menunggu Konfirmasi Admin</strong>
                </span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/orders"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Lihat di Pesanan Anda</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high border border-white/10 text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ke Beranda</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ========================================================== */}
            {/* STEP 1: INFORMASI AKUN & KONTAK */}
            {/* ========================================================== */}
            {currentStep === 1 && (
              <form onSubmit={handleProceedToStep2} className="space-y-5">
                {/* Mode Pendaftaran Toggle */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-white/5 space-y-3">
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-primary-container block">
                    Pilih Jenis Pendaftaran
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAthlete(true)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isAthlete
                          ? "bg-secondary-container/20 border-secondary-container text-white shadow-[0_0_15px_rgba(187,1,2,0.25)]"
                          : "bg-surface-container border-white/5 text-outline hover:text-white"
                      }`}
                    >
                      <Trophy className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
                      <div>
                        <div className="font-display font-bold text-xs uppercase text-white">
                          Atlet Akademi Wolves
                        </div>
                        <div className="font-body text-[11px] text-outline mt-0.5">
                          Bayar via QRIS (Rp 350.000) & masuk ke daftar Pemain Atlet resmi.
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAthlete(false)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        !isAthlete
                          ? "bg-secondary-container/20 border-secondary-container text-white shadow-[0_0_15px_rgba(187,1,2,0.25)]"
                          : "bg-surface-container border-white/5 text-outline hover:text-white"
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 text-outline shrink-0 mt-0.5" />
                      <div>
                        <div className="font-display font-bold text-xs uppercase text-white">
                          Anggota Komunitas
                        </div>
                        <div className="font-body text-[11px] text-outline mt-0.5">
                          Pendaftaran akun gratis untuk booking court & beli merchandise.
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form Fields Step 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Nama Lengkap Pendaftar
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Muhammad Rizky Pratama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-surface-container-high border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                        Nomor WhatsApp Aktif
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          placeholder="081234567890"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-surface-container-high border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                        <input
                          type="password"
                          required
                          placeholder="Minimal 6 karakter"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-surface-container-high border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                        <input
                          type="password"
                          required
                          placeholder="Ulangi password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-surface-container-high border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-sm font-bold uppercase tracking-wider py-3.5 rounded-lg shadow-[0_0_20px_rgba(187,1,2,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isAthlete ? (
                    <>
                      <span>Lanjut ke Pembayaran QRIS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <span>Selesaikan Pendaftaran</span>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================== */}
            {/* STEP 2: PEMBAYARAN QRIS */}
            {/* ========================================================== */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Banner Tagihan */}
                <div className="p-4 bg-gradient-to-r from-secondary-container/20 via-surface-container-low to-surface-container-low border border-primary-container/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="font-display font-bold text-[10px] uppercase tracking-wider text-primary-container block">
                      Tagihan Pendaftaran Akademi
                    </span>
                    <h3 className="font-display font-black text-xl text-white">
                      Rp 350.000 <span className="text-xs font-normal text-outline">/ Siswa</span>
                    </h3>
                    <p className="font-body text-[11px] text-outline">
                      Termasuk biaya registrasi, iuran bulan pertama & seragam latihan awal.
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-secondary-container/80 text-white font-display text-xs font-bold uppercase rounded-lg border border-white/10 shrink-0">
                    NMID: ID1020261108001
                  </div>
                </div>

                {/* Tampilan QRIS Wolves */}
                <div className="flex flex-col items-center justify-center bg-surface-container-low p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="relative w-64 h-[360px] sm:w-72 sm:h-[400px] shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                    <Image
                      src="/images/qris-wolves.png"
                      alt="QRIS Wolves Basketball Club"
                      fill
                      className="object-contain bg-white"
                      priority
                    />
                  </div>

                  <div className="text-center space-y-1 max-w-md">
                    <span className="font-display font-bold text-xs uppercase text-white block">
                      WOLVES BASKETBALL CLUB KABUPATEN BOGOR
                    </span>
                    <p className="font-body text-xs text-outline leading-relaxed">
                      Scan kode QRIS di atas menggunakan aplikasi mobile banking (BCA, Mandiri, BRI, BNI, BSI) atau e-wallet (GoPay, OVO, DANA, ShopeePay, LinkAja).
                    </p>
                  </div>
                </div>

                {/* Upload Bukti Pembayaran */}
                <div className="space-y-3 bg-surface-container-high p-4 rounded-xl border border-white/5">
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-primary-container">
                    Upload Bukti Transfer / Struk QRIS *
                  </label>
                  <p className="font-body text-[11px] text-outline">
                    Foto atau screenshot bukti pembayaran yang memuat tanggal & nominal transfer.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="flex-1 w-full flex items-center justify-center gap-2 p-3 bg-surface-container border border-dashed border-white/20 hover:border-primary-container rounded-lg cursor-pointer transition-colors text-xs font-display font-bold uppercase text-outline hover:text-white">
                      <Upload className="w-4 h-4 text-primary-container" />
                      <span>{paymentProofFile ? paymentProofFile.name : "Pilih File Bukti Bayar (JPG/PNG)"}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleProofChange}
                      />
                    </label>

                    {paymentProofPreview && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-primary-container shrink-0">
                        <Image
                          src={paymentProofPreview}
                          alt="Preview Bukti"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs font-body text-on-surface-variant">
                    <input
                      type="checkbox"
                      checked={paymentConfirmed}
                      onChange={(e) => setPaymentConfirmed(e.target.checked)}
                      className="w-4 h-4 accent-secondary-container rounded"
                    />
                    <span>Saya sudah menyelesaikan transfer pembayaran sebesar Rp 350.000.</span>
                  </label>
                </div>

                {/* Navigasi Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-outline hover:text-white font-display text-xs font-bold uppercase rounded-lg border border-white/5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Akun</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="inline-flex items-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg transition-all"
                  >
                    <span>Lanjut ke Biodata Atlet</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 3: BIODATA LENGKAP ATLET */}
            {/* ========================================================== */}
            {currentStep === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitRegistration();
                }}
                className="space-y-5 animate-in fade-in duration-300"
              >
                <div className="p-3 bg-secondary-container/15 border border-secondary-container/40 rounded-xl flex items-center gap-2 text-xs text-white">
                  <Sparkles className="w-4 h-4 text-primary-container shrink-0" />
                  <span>
                    Pembayaran QRIS telah dicatat. Sekarang lengkapi biodata fisik & profil atlet Anda untuk masuk ke sistem seleksi & roster resmi.
                  </span>
                </div>

                {/* Upload Foto Atlet */}
                <div className="space-y-2">
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline">
                    Foto Pemain Atlet *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 bg-surface-container-high rounded-xl overflow-hidden border border-white/10 relative flex items-center justify-center shrink-0">
                      {photoPreview ? (
                        <Image
                          src={photoPreview}
                          alt="Preview Foto Atlet"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-outline" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-white/10 rounded-lg cursor-pointer text-xs font-display font-bold uppercase text-white transition-colors">
                        <Upload className="w-4 h-4 text-primary-container" />
                        <span>Pilih Foto Pemain (JPG/PNG)</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </label>
                      <p className="font-body text-[11px] text-outline">
                        Gunakan foto portrait jelas dengan seragam basket / pakaian olahraga.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Asal Sekolah/Klub & Tanggal Lahir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Asal (Sekolah / Klub / Kota) *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: SMAN 1 Cibinong / Bogor"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Tanggal Lahir *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => handleBirthDateChange(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                      />
                    </div>
                    {birthDate && (
                      <span className="text-[10px] text-primary-container font-display font-bold uppercase mt-1 block">
                        Usia Terhitung: {calculatedAge} Tahun
                      </span>
                    )}
                  </div>
                </div>

                {/* Posisi & Nomor Punggung */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Posisi Utama Pemain *
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-display text-xs uppercase font-bold"
                    >
                      <option value="Point Guard">Point Guard (PG)</option>
                      <option value="Shooting Guard">Shooting Guard (SG)</option>
                      <option value="Small Forward">Small Forward (SF)</option>
                      <option value="Power Forward">Power Forward (PF)</option>
                      <option value="Center">Center (C)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Nomor Punggung Favorit
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 7, 23, 99"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                    />
                  </div>
                </div>

                {/* Tinggi & Berat Badan */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Tinggi Badan (cm) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      max={240}
                      placeholder="180"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Berat Badan (kg) *
                    </label>
                    <input
                      type="number"
                      required
                      min={30}
                      max={160}
                      placeholder="75"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                    />
                  </div>
                </div>

                {/* Catatan / Pengalaman Basket */}
                <div>
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                    Catatan Tambahan / Prestasi (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Riwayat kejuaraan, posisi sekunder, atau catatan khusus lainnya..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/5 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-xs"
                  />
                </div>

                {/* Submit and Back Button */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-outline hover:text-white font-display text-xs font-bold uppercase rounded-lg border border-white/5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke QRIS</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-secondary-container hover:bg-tertiary-container disabled:opacity-60 text-white font-display text-sm font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-[0_0_20px_rgba(187,1,2,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>{loading ? "Mengirim Pendaftaran..." : "Selesaikan & Kirim Pendaftaran"}</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* Footer Links */}
        {!successData && (
          <div className="flex items-center justify-between text-xs font-body text-outline pt-2 border-t border-white/5">
            <div>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-display font-bold uppercase tracking-wider text-primary-container hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-display font-bold uppercase tracking-wider text-outline hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ke Beranda</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
