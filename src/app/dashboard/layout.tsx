"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  LayoutDashboard,
  Users,
  Shield,
  Newspaper,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCheck,
  Trophy,
  ShoppingBag,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role_id: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setCurrentUser(data.user);
        }
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Pesanan & QRIS", href: "/dashboard/orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Verifikasi Atlet", href: "/dashboard/athletes", icon: <Trophy className="w-5 h-5" /> },
    { label: "Manajemen User", href: "/dashboard/users", icon: <Users className="w-5 h-5" /> },
    { label: "Manajemen Role", href: "/dashboard/roles", icon: <Shield className="w-5 h-5" /> },
    { label: "CRUD Berita", href: "/dashboard/news", icon: <Newspaper className="w-5 h-5" /> },
    { label: "Ganti Password", href: "/dashboard/profile", icon: <KeyRound className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col md:flex-row text-on-surface">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-surface-container border-b border-white/5 p-4 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center">
            <Image src={siteConfig.logo} alt="Logo" width={34} height={34} className="object-contain drop-shadow-[0_0_8px_rgba(255,85,64,0.4)]" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white">DASHBOARD ADMIN</div>
            <div className="font-body text-[10px] text-primary-container">Wolves Kab. Bogor</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded bg-surface-container-high text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-container border-r border-white/5 p-5 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image src={siteConfig.logo} alt="Logo" width={40} height={40} className="object-contain drop-shadow-[0_0_10px_rgba(255,85,64,0.4)]" />
            </div>
            <div>
              <span className="font-display font-black text-sm uppercase text-white block leading-tight">
                ADMIN PANEL
              </span>
              <span className="font-display font-bold text-[10px] uppercase text-primary-container tracking-wider">
                Wolves Basketball
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-display text-xs uppercase tracking-wider font-bold transition-all ${
                    active
                      ? "bg-secondary-container text-white shadow-[0_0_16px_rgba(187,1,2,0.35)]"
                      : "text-on-surface-variant hover:text-white hover:bg-surface-container-high"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Actions */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          {currentUser && (
            <div className="p-3 bg-surface-container-low rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-container/30 border border-secondary-container/50 flex items-center justify-center text-primary-container">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="font-display font-bold text-xs text-white truncate">
                  {currentUser.name}
                </div>
                <div className="font-body text-[10px] text-outline truncate">
                  {currentUser.email}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-variant text-white rounded-lg font-display text-[10px] font-bold uppercase transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary-container" />
              <span>Situs</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-error-container/20 hover:bg-error-container text-error hover:text-white rounded-lg font-display text-[10px] font-bold uppercase transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

