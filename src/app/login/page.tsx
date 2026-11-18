"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ArrowLeft, Lock, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal masuk. Periksa email dan password Anda.");
      }

      setSuccess(true);
      setTimeout(() => {
        if (data.user.role_id === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
        router.refresh();
      }, 800);
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

      <div className="w-full max-w-md bg-surface-container border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
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
          <h1 className="font-display font-black text-2xl uppercase text-white tracking-wide">
            Masuk Anggota
          </h1>
          <p className="font-body text-xs text-on-surface-variant">
            Akses portal Wolves Basketball Club Kabupaten Bogor
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg flex items-start gap-2.5 text-xs text-on-surface">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-secondary-container/30 border border-secondary-container rounded-lg flex items-center gap-2.5 text-xs text-white">
            <CheckCircle className="w-4 h-4 text-primary-container shrink-0" />
            <span>Login berhasil! Mengarahkan...</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
              Email
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
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-high border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container disabled:opacity-60 text-white font-display text-sm font-bold uppercase tracking-wider py-3 rounded-lg shadow-[0_0_20px_rgba(187,1,2,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? "Memproses..." : "Masuk Sekarang"}</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-xs font-body text-outline pt-2 border-t border-white/5">
          <Link
            href="/register"
            className="font-display font-bold uppercase tracking-wider text-primary-container hover:underline"
          >
            Daftar Akun Baru
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-display font-bold uppercase tracking-wider text-outline hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
