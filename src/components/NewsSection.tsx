"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

interface DisplayNews {
  id: string;
  title: string;
  slug: string;
  category?: string;
  date?: string;
  excerpt: string;
  image: string;
}

export default function NewsSection() {
  const [newsList, setNewsList] = useState<DisplayNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const mapped: DisplayNews[] = data.data.slice(0, 3).map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            category: "Warta Resmi",
            date: new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            excerpt: item.excerpt,
            image: item.thumbnail_path || "/images/news-championship.jpg",
          }));
          setNewsList(mapped);
        } else {
          setNewsList(siteConfig.news);
        }
      })
      .catch(() => {
        setNewsList(siteConfig.news);
      })
      .finally(() => setLoading(false));
  }, []);

  const items = newsList.length > 0 ? newsList : siteConfig.news;

  return (
    <section id="berita" className="w-full py-20 lg:py-24 bg-surface-container-low border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-display font-bold text-xs uppercase tracking-widest text-primary-container block mb-2">
              WARTA & LIPUTAN TERKINI
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight">
              KABAR TERBARU DARI <span className="text-primary-container">SERIGALA BOGOR</span>
            </h2>
          </div>
          <p className="font-body text-xs sm:text-sm text-outline uppercase tracking-wider">
            Update Prestasi & Rekrutmen • Musim 2025
          </p>
        </div>

        {/* 3 News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-md hover:border-primary-container/30 hover:bg-surface-container-high transition-all duration-300 flex flex-col group"
            >
              <div className="h-52 relative overflow-hidden bg-surface-container-high">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-secondary-container/90 backdrop-blur-sm text-white px-2.5 py-1 rounded font-display text-xs font-bold uppercase shadow-sm">
                  {item.category || "Berita"}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-outline text-xs mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date || "Terbaru"}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg uppercase text-white leading-snug group-hover:text-primary-container transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>

                <a
                  href="#berita"
                  className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wider font-bold text-primary-container hover:text-white transition-colors pt-2 group-hover:translate-x-1 duration-200"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Section Footer CTA */}
        <div className="flex justify-center">
          <a
            href="#kontak"
            className="inline-flex items-center gap-2 bg-surface-container hover:bg-surface-container-highest text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-3.5 rounded-lg border border-white/5 shadow-sm transition-all"
          >
            <span>Lihat Seluruh Berita & Kegiatan</span>
            <ArrowRight className="w-4 h-4 text-primary-container" />
          </a>
        </div>
      </div>
    </section>
  );
}
