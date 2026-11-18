import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-white/5 text-on-surface-variant py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="#beranda" className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  width={40}
                  height={40}
                  className="object-contain drop-shadow-[0_0_10px_rgba(255,85,64,0.35)]"
                />
              </div>
              <span className="font-display font-black text-lg uppercase text-white tracking-wider">
                WOLVES BASKETBALL
              </span>
            </Link>
            <p className="font-body text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Klub basket resmi pembinaan prestasi dan kompetisi elit usia dini hingga senior di Kabupaten Bogor. Membangun karakter, disiplin, dan mental juara di atas hardwood court.
            </p>
          </div>

          {/* Quick Nav (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm uppercase text-white tracking-wider">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2">
              {siteConfig.navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-body text-xs sm:text-sm text-on-surface-variant hover:text-primary-container transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Training Base (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-sm uppercase text-white tracking-wider">
              Markas Pelatihan
            </h4>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant">
              {siteConfig.contact.maps.address}
            </p>
            <p className="font-display font-bold text-xs uppercase text-primary-container pt-1">
              {siteConfig.contact.email.address}
            </p>
            <p className="font-body text-xs text-outline">
              WhatsApp: {siteConfig.contact.whatsapp.label}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-outline">
          <p>{siteConfig.footer.copyright}</p>
          <p className="font-display font-bold uppercase tracking-wider text-primary-container/80">
            {siteConfig.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

