import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "lucide-react";

export default function ServiceSection() {
  const { services } = siteConfig;

  return (
    <section id="program-dan-layanan" className="w-full py-20 lg:py-24 bg-surface-container-lowest relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-display font-bold text-xs uppercase tracking-widest text-primary-container block mb-2">
            PENGEMBANGAN ATLET & ENTERTAINMENT
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight">
            PROGRAM & LAYANAN <span className="text-primary-container">UNGGULAN</span>
          </h2>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-3">
            Dirancang untuk melayani seluruh lapisan ekosistem: bibit muda, tim pro, komunitas umum, dan fans setia Wolves.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:border-primary-container/40 hover:shadow-[0_12px_28px_rgba(187,1,2,0.25)] transition-all duration-300 flex flex-col group"
            >
              <div className="h-48 bg-surface-container-high relative overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-secondary-container/90 backdrop-blur-sm text-white px-2.5 py-1 rounded font-display text-xs font-bold uppercase shadow-sm">
                  {service.badge}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display font-bold text-lg uppercase text-white mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {service.ctaHref.startsWith("/") && !service.ctaHref.startsWith("/#") ? (
                  <Link
                    href={service.ctaHref}
                    className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wider font-bold text-primary-container hover:text-white transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a
                    href={service.ctaHref}
                    className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wider font-bold text-primary-container hover:text-white transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

