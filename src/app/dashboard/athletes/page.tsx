"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertCircle,
  Loader2,
  User,
  ShieldCheck,
  Search,
} from "lucide-react";

interface AthleteItem {
  id: string;
  user_id: string;
  name: string;
  position: string;
  jersey_number: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  photo_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function AthletesManagementPage() {
  const [athletes, setAthletes] = useState<AthleteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAthletes = () => {
    setLoading(true);
    fetch("/api/admin/athletes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAthletes(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  const handleUpdateStatus = async (athlete: AthleteItem, newStatus: "approved" | "rejected") => {
    setError("");
    setSuccess("");
    setActionLoading(athlete.id);

    try {
      const res = await fetch("/api/admin/athletes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: athlete.id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(
        newStatus === "approved"
          ? `Selamat! Pemain atlet ${athlete.name} telah di-ACC dan otomatis tampil di daftar Pemain Atlet Website!`
          : `Status pendaftaran atlet ${athlete.name} ditolak.`
      );
      fetchAthletes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus data atlet ${name}?`)) return;
    setError("");
    setSuccess("");
    setActionLoading(id);

    try {
      const res = await fetch(`/api/admin/athletes?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(`Data atlet ${name} berhasil dihapus.`);
      fetchAthletes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = athletes.filter((a) => {
    const matchFilter = filter === "all" ? true : a.status === filter;
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase()) ||
      a.jersey_number.includes(search);
    return matchFilter && matchSearch;
  });

  const pendingCount = athletes.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl uppercase text-white tracking-tight flex items-center gap-2">
            <span>Verifikasi Pemain Atlet Wolves</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-secondary-container text-white text-xs font-bold rounded-full animate-pulse">
                {pendingCount} Menunggu ACC
              </span>
            )}
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Setujui (ACC) pendaftaran atlet baru agar otomatis masuk dan tampil di daftar Pemain Atlet resmi website.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-surface-container p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold uppercase transition-all ${
              filter === "all"
                ? "bg-secondary-container text-white shadow-sm"
                : "text-outline hover:text-white"
            }`}
          >
            Semua ({athletes.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold uppercase transition-all ${
              filter === "pending"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-amber-400 hover:text-white"
            }`}
          >
            Menunggu ACC ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold uppercase transition-all ${
              filter === "approved"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-400 hover:text-white"
            }`}
          >
            Disetujui ({athletes.filter((a) => a.status === "approved").length})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error-container/30 border border-error/50 rounded-xl flex items-center gap-2.5 text-xs text-white">
          <AlertCircle className="w-4 h-4 text-error shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-secondary-container/20 border border-secondary-container/50 rounded-xl flex items-center gap-2.5 text-xs text-white">
          <ShieldCheck className="w-4 h-4 text-primary-container shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-outline absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Cari nama atlet, posisi, no punggung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-container border border-white/5 text-white pl-9 pr-3 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
        />
      </div>

      {/* Athletes Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-outline">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-container" />
            Memuat data atlet...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-outline bg-surface-container border border-white/5 rounded-2xl">
            Tidak ada atlet yang cocok dengan filter ini.
          </div>
        ) : (
          filtered.map((athlete) => (
            <div
              key={athlete.id}
              className={`bg-surface-container border rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between transition-all ${
                athlete.status === "pending"
                  ? "border-amber-500/40 bg-amber-950/10"
                  : athlete.status === "approved"
                  ? "border-emerald-500/30"
                  : "border-white/5 opacity-70"
              }`}
            >
              <div className="space-y-3">
                {/* Photo & Badge */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-surface-container-high border border-white/10 relative shrink-0">
                    <Image
                      src={athlete.photo_url || "/images/hero-basketball.jpg"}
                      alt={athlete.name}
                      fill
                      className="object-cover object-top"
                    />
                    {athlete.jersey_number && athlete.jersey_number !== "-" && (
                      <div className="absolute top-1 left-1 bg-secondary-container text-white px-1.5 py-0.5 rounded text-[10px] font-display font-black">
                        #{athlete.jersey_number}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-display text-[9px] font-bold uppercase ${
                          athlete.status === "approved"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : athlete.status === "pending"
                            ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                            : "bg-red-950 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {athlete.status === "approved"
                          ? "✓ ACC (Aktif)"
                          : athlete.status === "pending"
                          ? "⏳ Menunggu ACC"
                          : "✕ Ditolak"}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base uppercase text-white leading-tight">
                      {athlete.name}
                    </h3>

                    <div className="font-display font-bold text-xs text-primary-container uppercase">
                      {athlete.position}
                    </div>

                    <div className="text-[11px] font-body text-outline pt-1">
                      Daftar: {new Date(athlete.created_at).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                </div>

                {/* Stats Table */}
                <div className="grid grid-cols-3 gap-2 text-center bg-surface-container-low p-2 rounded-xl border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-outline block">Umur</span>
                    <span className="font-display font-bold text-white">{athlete.age} Thn</span>
                  </div>
                  <div className="border-x border-white/5">
                    <span className="text-[10px] text-outline block">Tinggi</span>
                    <span className="font-display font-bold text-primary-container">
                      {athlete.height_cm} cm
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline block">Berat</span>
                    <span className="font-display font-bold text-white">{athlete.weight_kg} kg</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDelete(athlete.id, athlete.name)}
                  disabled={actionLoading === athlete.id}
                  className="p-2 rounded-lg bg-surface-container-high hover:bg-error-container text-outline hover:text-white transition-colors"
                  title="Hapus data atlet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  {athlete.status !== "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(athlete, "approved")}
                      disabled={actionLoading === athlete.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs font-bold uppercase transition-all shadow-md"
                    >
                      {actionLoading === athlete.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>ACC Atlet</span>
                    </button>
                  )}

                  {athlete.status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus(athlete, "rejected")}
                      disabled={actionLoading === athlete.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-red-900/50 text-red-400 hover:text-white font-display text-xs font-bold uppercase transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

