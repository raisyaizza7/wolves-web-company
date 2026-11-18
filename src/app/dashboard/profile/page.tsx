"use client";

import React, { useState } from "react";
import { KeyRound, Check, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal harus 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess("Password admin berhasil diperbarui! Harap simpan password baru Anda dengan aman.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-display font-black text-2xl uppercase text-white tracking-tight">
          Keamanan & Ubah Password
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
          Ganti password akun admin default (`123456`) ke kata sandi yang kuat dan aman.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-error-container/30 border border-error/50 rounded-xl flex items-center gap-2.5 text-xs text-white">
          <AlertCircle className="w-4 h-4 text-error shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-secondary-container/20 border border-secondary-container/50 rounded-xl flex items-center gap-2.5 text-xs text-white">
          <Check className="w-4 h-4 text-primary-container shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-surface-container border border-white/5 p-6 rounded-2xl shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-primary-container">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm uppercase text-white">
              Formulir Ganti Password
            </h3>
            <p className="font-body text-xs text-outline">
              Sandi akan dienkripsi menggunakan hashing bcrypt sebelum disimpan.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
              Password Saat Ini
            </label>
            <input
              type="password"
              required
              placeholder="Masukkan password saat ini (default: 123456)"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2.5 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
            />
          </div>

          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
              Password Baru
            </label>
            <input
              type="password"
              required
              placeholder="Minimal 6 karakter kombinasi huruf & angka"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2.5 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
            />
          </div>

          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
              Ulangi Password Baru
            </label>
            <input
              type="password"
              required
              placeholder="Ulangi password baru Anda"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2.5 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container disabled:opacity-60 text-white font-display text-xs font-bold uppercase tracking-wider py-3 rounded-lg shadow-[0_0_16px_rgba(187,1,2,0.35)] transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{loading ? "Menyimpan..." : "Perbarui Password Sekarang"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

