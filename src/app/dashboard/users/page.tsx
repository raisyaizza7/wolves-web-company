"use client";

import React, { useState, useEffect } from "react";
import { Search, Shield, User, Trash2, Check, X, AlertCircle, Loader2 } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserItem | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/admin/users?q=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchRoles = () => {
    fetch("/api/admin/roles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRoles(data.data);
        }
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user: UserItem) => {
    setError("");
    setSuccess("");
    const newStatus = user.status === "active" ? "inactive" : "active";
    setActionLoading(user.id);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(`Status user ${user.name} berhasil diubah.`);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (user: UserItem, newRole: string) => {
    setError("");
    setSuccess("");
    setActionLoading(user.id);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role_id: newRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(`Role user ${user.name} berhasil diubah menjadi ${newRole}.`);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setError("");
    setSuccess("");
    setActionLoading(deleteConfirmUser.id);

    try {
      const res = await fetch(`/api/admin/users?id=${deleteConfirmUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(`User ${deleteConfirmUser.name} berhasil dihapus.`);
      setDeleteConfirmUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl uppercase text-white tracking-tight">
            Manajemen Pengguna
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Daftar seluruh akun, kontrol role, dan status keaktifan anggota Wolves Bogor.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container border border-white/5 text-white pl-9 pr-3 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container w-60"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase rounded-lg"
          >
            Cari
          </button>
        </form>
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

      {/* Table */}
      <div className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-surface-container-high/60 text-outline uppercase font-display font-bold">
                <th className="py-3.5 px-4">Nama Pengguna</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tanggal Daftar</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-outline">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-container" />
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-outline">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-3.5 px-4 font-display font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary-container/30 flex items-center justify-center text-primary-container shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant font-mono">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role_id}
                        disabled={actionLoading === u.id}
                        onChange={(e) => handleChangeRole(u, e.target.value)}
                        className={`bg-surface-container-low border border-white/10 rounded px-2.5 py-1 text-xs font-display font-bold uppercase ${
                          u.role_id === "admin"
                            ? "text-primary-container border-primary-container/40"
                            : "text-on-surface"
                        }`}
                      >
                        {roles.length > 0 ? (
                          roles.map((r) => (
                            <option key={r.id} value={r.name}>
                              {r.name.toUpperCase()}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="admin">ADMIN</option>
                            <option value="user">USER</option>
                          </>
                        )}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={actionLoading === u.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-display text-[10px] font-bold uppercase transition-all ${
                          u.status === "active"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/40"
                            : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === "active" ? "bg-emerald-400" : "bg-neutral-500"
                          }`}
                        />
                        <span>{u.status === "active" ? "Aktif" : "Nonaktif"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-outline font-body">
                      {new Date(u.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setDeleteConfirmUser(u)}
                        disabled={actionLoading === u.id}
                        className="p-1.5 rounded bg-surface-container-high hover:bg-error-container text-outline hover:text-white transition-colors"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-xl bg-error-container/20 border border-error/30 flex items-center justify-center text-error mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg uppercase text-white">
                Konfirmasi Hapus Pengguna
              </h3>
              <p className="font-body text-xs text-on-surface-variant">
                Apakah Anda yakin ingin menghapus akun <strong className="text-white">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-white font-display text-xs uppercase font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoading === deleteConfirmUser.id}
                className="py-2.5 rounded-lg bg-error hover:bg-error-container text-white font-display text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading === deleteConfirmUser.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                <span>Hapus Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

