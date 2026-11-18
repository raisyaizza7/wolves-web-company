import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { ArrowLeft, Home, Trophy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient Red Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary-container/20 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-16 h-16 flex items-center justify-center mx-auto">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={64}
              height={64}
              className="object-contain drop-shadow-[0_0_16px_rgba(255,85,64,0.45)]"
            />
          </div>
        </Link>

        {/* 404 Hero */}
        <div className="space-y-2">
          <div className="font-display font-black text-8xl sm:text-9xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-primary-container to-secondary-container">
            404
          </div>
          <h1 className="font-display font-black text-2xl uppercase text-white tracking-wide">
            Halaman Tidak Ditemukan
          </h1>
          <p className="font-body text-sm text-on-surface-variant max-w-sm mx-auto">
            Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau alamat URL yang Anda masukkan salah.
          </p>
        </div>

        {/* Quick Links */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-[0_0_20px_rgba(187,1,2,0.35)] transition-all transform hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/#pemain-atlet"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high border border-white/10 text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all"
          >
            <Trophy className="w-4 h-4 text-primary-container" />
            <span>Lihat Pemain Atlet</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-white/5 text-[11px] font-body text-outline">
          {siteConfig.name} • {siteConfig.establishment}
        </div>
      </div>
    </div>
  );
}
