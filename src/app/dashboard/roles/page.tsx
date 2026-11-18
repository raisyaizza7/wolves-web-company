"use client";

import React, { useState, useEffect } from "react";
import { Shield, Plus, Trash2, Check, AlertCircle, Loader2, Lock } from "lucide-react";

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean | string;
  created_at: string;
}

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: "read:profile,create:order",
  });

  const fetchRoles = () => {
    setLoading(true);
    fetch("/api/admin/roles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRoles(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormLoading(true);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(`Role "${formData.name}" berhasil ditambahkan.`);
      setModalOpen(false);
      setFormData({ name: "", description: "", permissions: "read:profile,create:order" });
      fetchRoles();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRole = async (role: RoleItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus role "${role.name}"?`)) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/roles?id=${role.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(`Role "${role.name}" berhasil dihapus.`);
      fetchRoles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl uppercase text-white tracking-tight">
            Manajemen Role & Hak Akses
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Daftar role bawaan sistem (`admin`, `user`) dan role kustom tambahan.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_16px_rgba(187,1,2,0.35)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Role Baru</span>
        </button>
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

      {/* Grid of Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-outline">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-container" />
            Memuat daftar role...
          </div>
        ) : (
          roles.map((r) => {
            const isSys = r.is_system === true || r.is_system === "TRUE" || r.name === "admin" || r.name === "user";
            return (
              <div
                key={r.id}
                className="bg-surface-container border border-white/5 p-5 rounded-2xl shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-primary-container">
                        <Shield className="w-4 h-4" />
                      </div>
                      <h3 className="font-display font-bold text-base uppercase text-white">
                        {r.name}
                      </h3>
                    </div>
                    {isSys ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container-highest text-primary-container font-display text-[10px] font-bold uppercase rounded">
                        <Lock className="w-3 h-3" />
                        <span>Sistem</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 font-display text-[10px] font-bold uppercase rounded">
                        Kustom
                      </span>
                    )}
                  </div>

                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    {r.description || "Tidak ada deskripsi khusus."}
                  </p>

                  <div className="pt-2 border-t border-white/5">
                    <span className="font-display font-bold text-[10px] text-outline uppercase block mb-1">
                      Permissions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {r.permissions.split(",").map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 bg-surface-container-low border border-white/5 rounded text-[10px] font-mono text-white/80"
                        >
                          {p.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-outline">
                  <span>Dibuat: {new Date(r.created_at).toLocaleDateString("id-ID")}</span>
                  {!isSys && (
                    <button
                      onClick={() => handleDeleteRole(r)}
                      className="p-1.5 rounded bg-surface-container-high hover:bg-error-container text-outline hover:text-white transition-colors"
                      title="Hapus Role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tambah Role */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-display font-bold text-lg uppercase text-white">
                Tambah Role Baru
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-outline hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                  Nama Role
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: pelatih / staf_medis"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
                />
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan tugas dan wewenang role..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
                />
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                  Permissions (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="read:profile, create:order, read:reports"
                  value={formData.permissions}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                  className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-white font-display text-xs uppercase font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="py-2.5 rounded-lg bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs uppercase font-bold flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Simpan Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

