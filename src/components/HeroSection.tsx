import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { ArrowRight, Ticket, Trophy, Calendar, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative w-full pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-surface-container-lowest"
    >
      {/* Ambient Red Lighting Effects */}
      <div
        className="absolute -top-24 left-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -right-20 w-80 h-80 bg-primary-container/15 rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Tactical Ticker Badge */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-white font-display text-xs font-bold uppercase tracking-widest rounded shadow-[0_0_12px_rgba(187,1,2,0.4)]">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            WOLVES KABUPATEN BOGOR
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-container-highest text-primary-container font-display text-xs font-bold uppercase tracking-wider">
            DIVISI UTAMA
          </span>
          <span className="font-body text-xs sm:text-sm text-outline tracking-wider uppercase">
            {siteConfig.establishment}
          </span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-5xl uppercase text-white leading-[1.1] tracking-tight">
              SIAPKAN MENTAL, ASAH SKILL, DAN{" "}
              <span className="text-primary-container block">DOMINASI LAPANGAN!</span>
            </h1>

            <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              {siteConfig.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#program-dan-layanan"
                className="inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-sm sm:text-base font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-[0_0_24px_rgba(255,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Daftar Akademi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#kontak"
                className="inline-flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-variant text-white font-display text-sm sm:text-base font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg border border-white/5 transition-all"
              >
                <Ticket className="w-4 h-4 text-primary-container" />
                <span>Jadwal & Tiket Tanding</span>
              </a>
            </div>

            {/* Metrics Strip */}
            <div className="pt-4 grid grid-cols-3 gap-3 sm:gap-4">
              {siteConfig.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-surface-container-low border border-white/5 p-3 sm:p-4 rounded-lg"
                >
                  <span
                    className={`font-display font-black text-2xl sm:text-3xl block leading-none ${
                      metric.highlight ? "text-primary-container" : "text-white"
                    }`}
                  >
                    {metric.value}
                  </span>
                  <span className="font-body text-xs sm:text-sm text-outline uppercase tracking-wider mt-1 block">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Frame & Floating Match Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-surface-container border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.8)] group">
              <div className="relative w-full h-[380px] sm:h-[460px] overflow-hidden bg-[#1a1a1a]">
                <Image
                  src="/images/hero-basketball.jpg"
                  alt="Skuad Juara Wolves Basketball Club Kabupaten Bogor bersama Trofi & Medali"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent" />
              </div>

              {/* Floated Top Badge */}
              <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2 shadow-lg border border-white/5">
                <Trophy className="w-4 h-4 text-primary-container" />
                <span className="font-display font-bold text-xs uppercase text-white tracking-wider">
                  Juara 1 Kejurda • #WeAreWolves
                </span>
              </div>

              {/* Floated Bottom Matchday Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(187,1,2,0.5)]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-xs sm:text-sm uppercase text-white leading-tight">
                      Next Matchday
                    </div>
                    <div className="font-body text-xs text-primary-container">
                      Wolves vs Patriot Bekasi • GOR Pakansari
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-surface-container-highest text-white font-display text-xs font-bold rounded shrink-0">
                  SABTU, 19:30
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

