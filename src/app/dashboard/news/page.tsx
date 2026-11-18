"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, Check, AlertCircle, Loader2, Upload, FileText } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "draft" | "published";
  created_at: string;
}

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "preview">("create");
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  // Form State
  const [formLoading, setFormLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchNews = () => {
    setLoading(true);
    fetch("/api/admin/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNews(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setActiveArticle(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("published");
    setThumbnailFile(null);
    setPreviewUrl("/images/news-championship.jpg");
    setModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setModalMode("edit");
    setActiveArticle(item);
    setTitle(item.title);
    setExcerpt(item.excerpt);
    setContent(item.content);
    setStatus(item.status);
    setThumbnailFile(null);
    setPreviewUrl(item.thumbnail_path);
    setModalOpen(true);
  };

  const openPreviewModal = (item: NewsItem) => {
    setModalMode("preview");
    setActiveArticle(item);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("status", status);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (modalMode === "edit" && activeArticle) {
        formData.append("id", activeArticle.id);
      }

      const method = modalMode === "edit" ? "PUT" : "POST";
      const res = await fetch("/api/admin/news", {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess(
        modalMode === "edit"
          ? "Berita berhasil diperbarui."
          : "Berita baru berhasil ditambahkan dan langsung aktif."
      );
      setModalOpen(false);
      fetchNews();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Hapus berita: "${titleStr}"?`)) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setSuccess("Berita berhasil dihapus.");
      fetchNews();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl uppercase text-white tracking-tight">
            CRUD Berita & Warta Wolves
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Berita yang diterbitkan di sini akan langsung tampil secara dinamis pada halaman utama.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_16px_rgba(187,1,2,0.35)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Berita Baru</span>
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

      {/* News Table */}
      <div className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-surface-container-high/60 text-outline uppercase font-display font-bold">
                <th className="py-3.5 px-4">Thumbnail</th>
                <th className="py-3.5 px-4">Judul Berita</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tanggal Buat</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-outline">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-container" />
                    Memuat daftar berita...
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-outline">
                    Belum ada berita. Klik tombol "Buat Berita Baru" untuk menambahkan artikel.
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-16 h-11 relative rounded overflow-hidden bg-surface-container-high border border-white/5">
                        <Image
                          src={item.thumbnail_path || "/images/news-championship.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-display font-bold text-sm text-white line-clamp-1">
                        {item.title}
                      </div>
                      <div className="font-body text-xs text-outline line-clamp-1 mt-0.5">
                        {item.excerpt}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-display text-[10px] font-bold uppercase ${
                          item.status === "published"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "published" ? "bg-emerald-400" : "bg-neutral-500"
                          }`}
                        />
                        <span>{item.status === "published" ? "Terbit" : "Draft"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-outline font-body">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openPreviewModal(item)}
                          className="p-1.5 rounded bg-surface-container-high hover:bg-surface-variant text-outline hover:text-white transition-colors"
                          title="Pratinjau Berita"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded bg-surface-container-high hover:bg-surface-variant text-outline hover:text-white transition-colors"
                          title="Edit Berita"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded bg-surface-container-high hover:bg-error-container text-outline hover:text-white transition-colors"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD & Preview */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-display font-bold text-lg uppercase text-white">
                {modalMode === "create"
                  ? "Tambah Berita Baru"
                  : modalMode === "edit"
                  ? "Edit Berita"
                  : "Pratinjau Artikel Berita"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-outline hover:text-white">
                ✕
              </button>
            </div>

            {modalMode === "preview" && activeArticle ? (
              <div className="space-y-4">
                <div className="h-64 relative rounded-xl overflow-hidden bg-surface-container-high border border-white/5">
                  <Image
                    src={activeArticle.thumbnail_path || "/images/news-championship.jpg"}
                    alt={activeArticle.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-secondary-container text-white px-2.5 py-1 rounded font-display text-xs font-bold uppercase">
                    {activeArticle.status}
                  </div>
                </div>
                <div>
                  <span className="font-body text-xs text-outline">
                    {new Date(activeArticle.created_at).toLocaleDateString("id-ID", {
                      dateStyle: "full",
                    })}
                  </span>
                  <h2 className="font-display font-bold text-xl uppercase text-white mt-1">
                    {activeArticle.title}
                  </h2>
                  <p className="font-body text-sm font-semibold text-primary-container mt-2">
                    {activeArticle.excerpt}
                  </p>
                  <div className="font-body text-sm text-on-surface-variant mt-4 whitespace-pre-wrap leading-relaxed">
                    {activeArticle.content}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-variant text-white font-display text-xs uppercase font-bold rounded-lg"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                    Judul Berita
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Wolves Basketball U-17 Menang Telak di Laga Perdana"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
                  />
                </div>

                <div>
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                    Ringkasan / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ringkasan singkat 1-2 kalimat untuk kartu depan..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container"
                  />
                </div>

                <div>
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                    Konten Lengkap Berita
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Tuliskan isi artikel berita secara lengkap..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2 rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-secondary-container font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Upload Gambar Thumbnail (Lokal)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-surface-container-high hover:bg-surface-variant text-white rounded-lg text-xs font-display font-bold uppercase transition-colors border border-white/5">
                        <Upload className="w-4 h-4 text-primary-container" />
                        <span>Pilih Foto</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-outline truncate max-w-[150px]">
                        {thumbnailFile ? thumbnailFile.name : "Format JPG/PNG/WebP, Max 2MB"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5">
                      Status Publikasi
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-3.5 py-2 rounded-lg text-xs font-display font-bold uppercase focus:outline-none focus:ring-2 focus:ring-secondary-container"
                    >
                      <option value="published">PUBLISHED (Tampil di Website)</option>
                      <option value="draft">DRAFT (Disimpan saja)</option>
                    </select>
                  </div>
                </div>

                {previewUrl && (
                  <div className="pt-2">
                    <span className="font-display font-bold text-[10px] text-outline uppercase block mb-1">
                      Pratinjau Thumbnail Terpilih:
                    </span>
                    <div className="w-32 h-20 relative rounded-lg overflow-hidden border border-white/10">
                      <Image src={previewUrl} alt="Thumbnail preview" fill className="object-cover" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
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
                    className="py-2.5 rounded-lg bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs uppercase font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(187,1,2,0.35)]"
                  >
                    {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>{modalMode === "edit" ? "Simpan Perubahan" : "Terbitkan Berita"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

