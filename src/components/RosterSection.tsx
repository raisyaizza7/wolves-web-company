"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UserPlus, Sparkles, ShieldCheck } from "lucide-react";

interface AthleteItem {
  id: string;
  name: string;
  position: string;
  jersey_number: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  photo_url: string;
  status: string;
}

export default function RosterSection() {
  const [athletes, setAthletes] = useState<AthleteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetch("/api/athletes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAthletes(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredAthletes = athletes.filter((a) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "guard") return a.position.toLowerCase().includes("guard");
    if (activeFilter === "forward") return a.position.toLowerCase().includes("forward");
    if (activeFilter === "center") return a.position.toLowerCase().includes("center");
    return true;
  });

  return (
    <section id="pemain-atlet" className="w-full py-20 lg:py-24 bg-surface-container-lowest relative overflow-hidden">
      <div id="roster" className="relative -top-24 invisible" aria-hidden="true" />
      {/* Ambient Red Glow */}
      <div
        className="absolute top-1/2 left-0 w-96 h-96 bg-secondary-container/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-container/10 rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-6 bg-secondary-container rounded-sm" />
              <span className="font-display font-bold text-xs uppercase tracking-widest text-primary-container">
                SKUAD RESMI WOLVES
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight">
              PEMAIN ATLET <span className="text-primary-container">WOLVES BOGOR</span>
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl">
              Deretan pemain atlet muda berbakat binaan Wolves Basketball Club yang siap bertanding dan mendominasi court di setiap kompetisi resmi.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-surface-container/70 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm self-start md:self-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === "all"
                  ? "bg-secondary-container text-white shadow-[0_0_12px_rgba(187,1,2,0.4)]"
                  : "text-outline hover:text-white"
              }`}
            >
              Semua Posisi
            </button>
            <button
              onClick={() => setActiveFilter("guard")}
              className={`px-3.5 py-1.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === "guard"
                  ? "bg-secondary-container text-white shadow-[0_0_12px_rgba(187,1,2,0.4)]"
                  : "text-outline hover:text-white"
              }`}
            >
              Guards
            </button>
            <button
              onClick={() => setActiveFilter("forward")}
              className={`px-3.5 py-1.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === "forward"
                  ? "bg-secondary-container text-white shadow-[0_0_12px_rgba(187,1,2,0.4)]"
                  : "text-outline hover:text-white"
              }`}
            >
              Forwards
            </button>
            <button
              onClick={() => setActiveFilter("center")}
              className={`px-3.5 py-1.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === "center"
                  ? "bg-secondary-container text-white shadow-[0_0_12px_rgba(187,1,2,0.4)]"
                  : "text-outline hover:text-white"
              }`}
            >
              Centers
            </button>
          </div>
        </div>

        {/* Athletes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-outline">
              Memuat data pemain atlet...
            </div>
          ) : filteredAthletes.length === 0 ? (
            <div className="col-span-full py-16 text-center text-outline">
              Belum ada pemain atlet yang terdaftar di kategori ini.
            </div>
          ) : (
            filteredAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-primary-container/40 hover:shadow-[0_12px_32px_rgba(187,1,2,0.3)] transition-all duration-300 flex flex-col group relative"
              >
                {/* Photo & Jersey Badge */}
                <div className="h-64 sm:h-72 bg-surface-container-high relative overflow-hidden">
                  <Image
                    src={athlete.photo_url || "/images/hero-basketball.jpg"}
                    alt={athlete.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-90" />

                  {/* Jersey Number Tag */}
                  {athlete.jersey_number && athlete.jersey_number !== "-" && (
                    <div className="absolute top-3 left-3 bg-secondary-container/95 backdrop-blur-sm text-white px-2.5 py-1 rounded font-display font-black text-sm uppercase shadow-lg border border-white/10">
                      #{athlete.jersey_number}
                    </div>
                  )}

                  {/* Position Tag */}
                  <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm text-primary-container px-2.5 py-1 rounded font-display text-[10px] font-bold uppercase tracking-wider border border-white/5">
                    {athlete.position}
                  </div>

                  {/* Name Over Photo */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="font-display font-bold text-[10px] text-outline uppercase tracking-widest block mb-0.5">
                      PEMAIN ATLET WOLVES
                    </span>
                    <h3 className="font-display font-black text-xl uppercase text-white leading-tight drop-shadow-md">
                      {athlete.name}
                    </h3>
                  </div>
                </div>

                {/* Stat Box Strip */}
                <div className="p-4 bg-surface-container space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center bg-surface-container-low p-2.5 rounded-xl border border-white/5">
                    <div>
                      <span className="font-body text-[10px] text-outline uppercase block">Umur</span>
                      <span className="font-display font-bold text-xs text-white">
                        {athlete.age ? `${athlete.age} Thn` : "-"}
                      </span>
                    </div>
                    <div className="border-x border-white/5">
                      <span className="font-body text-[10px] text-outline uppercase block">Tinggi</span>
                      <span className="font-display font-bold text-xs text-primary-container">
                        {athlete.height_cm ? `${athlete.height_cm} cm` : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="font-body text-[10px] text-outline uppercase block">Berat</span>
                      <span className="font-display font-bold text-xs text-white">
                        {athlete.weight_kg ? `${athlete.weight_kg} kg` : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] font-display font-bold text-outline uppercase">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Pemain Resmi</span>
                    </span>
                    <span className="text-primary-container/80">Kab. Bogor</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA Banner: Register as Athlete */}
        <div className="mt-14 bg-gradient-to-r from-secondary-container/30 via-surface-container to-surface-container border border-secondary-container/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-primary-container font-display text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Peluang Beasiswa & Prestasi</span>
            </div>
            <h3 className="font-display font-black text-2xl uppercase text-white">
              Ingin Menjadi Bagian dari Skuad Serigala?
            </h3>
            <p className="font-body text-sm text-on-surface-variant max-w-xl">
              Daftarkan diri Anda dengan melengkapi posisi, tinggi badan, berat badan, dan foto. Setelah diverifikasi dan di-ACC oleh manajemen Wolves, nama Anda akan otomatis tampil di daftar pemain atlet resmi website!
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-sm font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-[0_0_24px_rgba(255,0,0,0.35)] transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Sebagai Pemain Atlet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

