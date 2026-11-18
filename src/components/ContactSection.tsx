"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Car,
  Train,
  Navigation,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function ContactSection() {
  const { contact } = siteConfig;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    service: "akademi",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="kontak" className="w-full py-20 lg:py-24 bg-surface-container-lowest relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-2xl mb-12">
          <span className="font-display font-bold text-xs uppercase tracking-widest text-primary-container block mb-2">
            HUBUNGI KAMI & MARKAS WOLVES
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight">
            SIAP BERGABUNG DENGAN <span className="text-primary-container">KAWANAN KAMI?</span>
          </h2>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2">
            Konsultasi pendaftaran akademi, reservasi lapangan, kerja sama kemitraan sponsorship, dan informasi tiket laga.
          </p>
        </div>

        {/* 2-Column Wide Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Interactive Form */}
          <div className="lg:col-span-6 bg-surface-container border border-white/5 p-6 sm:p-8 rounded-2xl shadow-xl space-y-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm uppercase text-white">
                    {contact.hq.title}
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    {contact.hq.description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm uppercase text-white">
                    WhatsApp Official
                  </h4>
                  <a
                    href={contact.whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs sm:text-sm text-primary-container hover:underline block mt-0.5"
                  >
                    {contact.whatsapp.label}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm uppercase text-white">
                    Email Sekretariat
                  </h4>
                  <a
                    href={`mailto:${contact.email.address}`}
                    className="font-body text-xs sm:text-sm text-on-surface-variant hover:text-white block mt-0.5"
                  >
                    {contact.email.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm uppercase text-white">
                    {contact.operationalHours.title}
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    {contact.operationalHours.schedule}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            {submitted ? (
              <div className="p-6 bg-surface-container-low border border-primary-container/30 rounded-xl text-center space-y-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-primary-container mx-auto" />
                <h3 className="font-display font-bold text-lg uppercase text-white">
                  Pesan Berhasil Terkirim!
                </h3>
                <p className="font-body text-sm text-on-surface-variant">
                  Terima kasih <strong className="text-white">{formData.name}</strong>. Tim Sekretariat Wolves Kab. Bogor akan segera menghubungi nomor WhatsApp Anda ({formData.whatsapp}).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", whatsapp: "", service: "akademi", message: "" });
                  }}
                  className="font-display text-xs uppercase tracking-wider font-bold text-primary-container hover:underline pt-2 inline-block"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Contoh: Rian Pratama"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm placeholder:text-outline/50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-whatsapp"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5"
                    >
                      Nomor WhatsApp
                    </label>
                    <input
                      id="contact-whatsapp"
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-surface-container-high border border-white/5 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm placeholder:text-outline/50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-service"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5"
                  >
                    Pilihan Layanan
                  </label>
                  <select
                    id="contact-service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-surface-container-high border border-white/5 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm"
                  >
                    <option value="akademi">Pendaftaran Akademi Basket (U-10 / U-14 / U-18)</option>
                    <option value="sewa">Penyewaan Lapangan & Fasilitas FIBA</option>
                    <option value="tiket">Tiket Pertandingan & Event Sportainment</option>
                    <option value="merch">Pemesanan Jersey & Merchandise Resmi</option>
                    <option value="sponsor">Kerjasama Sponsorship & Kemitraan</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-outline mb-1.5"
                  >
                    Pesan / Keterangan
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    placeholder="Tuliskan pertanyaan atau kebutuhan spesifik Anda..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-surface-container-high border border-white/5 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container font-body text-sm placeholder:text-outline/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-sm font-bold uppercase tracking-wider py-3.5 rounded-lg shadow-[0_0_20px_rgba(187,1,2,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Map Location Display & Accessibility */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-primary-container">
                    LOKASI RESMI KANDANG SERIGALA
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl uppercase text-white">
                    {contact.maps.name}
                  </h3>
                </div>
                <a
                  href={contact.maps.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-white rounded-lg font-display text-xs uppercase font-bold border border-white/5 transition-colors self-start sm:self-auto shrink-0"
                >
                  <Navigation className="w-4 h-4 text-primary-container" />
                  <span>Buka Petunjuk Arah</span>
                </a>
              </div>

              {/* Google Maps Embed Container */}
              <div className="w-full h-80 rounded-xl overflow-hidden border border-white/10 relative shadow-inner bg-[#161616]">
                <iframe
                  title="Peta Lokasi Markas Wolves GOR Laga Tangkas Pakansari"
                  src={contact.maps.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[25%] contrast-110"
                />
              </div>

              {/* Location Badge Description */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-secondary-container shrink-0" />
                  <div>
                    <div className="font-display font-bold text-xs sm:text-sm uppercase text-white">
                      GOR Laga Tangkas Pakansari
                    </div>
                    <div className="font-body text-xs text-on-surface-variant">
                      {contact.maps.notes}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-secondary-container/20 text-primary-container font-display text-xs font-bold uppercase rounded shrink-0">
                  {contact.maps.badge}
                </span>
              </div>
            </div>

            {/* Quick Access Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container border border-white/5 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-2 text-primary-container mb-1.5">
                  <Car className="w-5 h-5" />
                  <span className="font-display font-bold text-xs uppercase">Akses Tol Sentul Utara</span>
                </div>
                <p className="font-body text-xs text-on-surface-variant">
                  Hanya 10 menit dari gerbang tol Sirkuit Sentul / Sentul Utara via Jl. Tegar Beriman.
                </p>
              </div>

              <div className="bg-surface-container border border-white/5 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-2 text-primary-container mb-1.5">
                  <Train className="w-5 h-5" />
                  <span className="font-display font-bold text-xs uppercase">Stasiun Commuter Line</span>
                </div>
                <p className="font-body text-xs text-on-surface-variant">
                  15 menit dari Stasiun Bojong Gede atau Stasiun Cibinong dengan transportasi umum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

