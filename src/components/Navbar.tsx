"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, ArrowRight, User, LayoutDashboard, LogOut, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [currentUser, setCurrentUser] = useState<{ name: string; role_id: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["beranda", "profil", "program-dan-layanan", "berita", "kontak"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0e0e0e]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-b border-white/5"
          : "bg-[#0e0e0e]/85 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="#beranda" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={44}
              height={44}
              className="object-contain drop-shadow-[0_0_12px_rgba(255,85,64,0.4)]"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-lg uppercase tracking-wider text-white leading-none">
              WOLVES
            </span>
            <span className="font-display font-bold text-xs uppercase tracking-widest text-primary-container leading-tight">
              KAB. BOGOR
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-1 lg:gap-2 bg-surface-container/60 border border-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm"
        >
          {siteConfig.navItems.map((item) => {
            const isExternalOrPage = item.href.startsWith("/") && !item.href.startsWith("/#");
            const targetId = item.href.replace("/#", "").replace("#", "");
            const isActive = activeSection === targetId;

            if (isExternalOrPage) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-display text-xs lg:text-sm uppercase tracking-wider px-3 py-1.5 rounded transition-all duration-200 text-on-surface-variant hover:text-white hover:bg-surface-container-high/50"
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                className={`font-display text-xs lg:text-sm uppercase tracking-wider px-3 py-1.5 rounded transition-all duration-200 ${
                  isActive
                    ? "bg-surface-container-high text-primary-container font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-white hover:bg-surface-container-high/50"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* CTA & User Status */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/orders"
                className="inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-white font-display text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-white/10 shadow-sm transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-primary-container" />
                <span>Pesanan Anda</span>
              </Link>
              {currentUser.role_id === "admin" && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg shadow-md transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-error-container text-outline hover:text-white font-display text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-colors"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-xs lg:text-sm font-bold uppercase tracking-wider px-4 py-2.5 rounded shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <User className="w-4 h-4" />
              <span>Masuk / Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-surface-container text-on-surface hover:text-white focus:outline-none focus:ring-2 focus:ring-secondary-container"
            aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131313]/98 border-b border-white/10 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            {siteConfig.navItems.map((item) => {
              const isPage = item.href.startsWith("/") && !item.href.startsWith("/#");
              if (isPage) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display font-bold uppercase text-sm px-4 py-3 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-primary-container opacity-60" />
                  </Link>
                );
              }
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display font-bold uppercase text-sm px-4 py-3 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-primary-container opacity-60" />
                </a>
              );
            })}
            <div className="pt-2">
              {currentUser ? (
                <div className="space-y-2">
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-white font-display text-sm font-bold uppercase py-3 rounded-lg border border-white/10"
                  >
                    <ShoppingBag className="w-4 h-4 text-primary-container" />
                    <span>Pesanan &amp; Tiket Anda</span>
                  </Link>
                  {currentUser.role_id === "admin" && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-secondary-container text-white font-display text-sm font-bold uppercase py-3 rounded-lg"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Masuk ke Dashboard Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-outline hover:text-white font-display text-sm font-bold uppercase py-3 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar ({currentUser.name})</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-secondary-container hover:bg-tertiary-container text-white font-display text-sm font-bold uppercase tracking-wider py-3 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk Anggota / Login</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
