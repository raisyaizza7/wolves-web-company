import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Award, Landmark, Flame } from "lucide-react";

export default function AboutSection() {
  const { about } = siteConfig;

  const strengthIcons = [
    <Award key="0" className="w-6 h-6 text-primary-container" />,
    <Landmark key="1" className="w-6 h-6 text-primary-container" />,
    <Flame key="2" className="w-6 h-6 text-primary-container" />,
  ];

  return (
    <section id="profil" className="w-full py-20 lg:py-24 bg-surface-container-low border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-4">
          <div>
            <span className="font-display font-bold text-xs uppercase tracking-widest text-primary-container block mb-2">
              {about.tagline}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight">
              {about.title} <span className="text-primary-container">{about.titleHighlight}</span>
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-md">
            {about.subtitle}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Narrative Card & Visual */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-surface-container border border-white/5 p-6 sm:p-8 rounded-2xl shadow-lg space-y-4">
              <h3 className="font-display font-bold text-xl uppercase text-white">
                {about.narrativeTitle}
              </h3>
              {about.paragraphs.map((p, idx) => (
                <p key={idx} className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl bg-surface-container border border-white/5 relative group h-64 sm:h-72">
              <Image
                src={about.image}
                alt={about.imageCaption}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/90 via-transparent to-transparent flex items-end p-5">
                <span className="font-display font-bold text-xs uppercase text-white tracking-wider bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10">
                  {about.imageCaption}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Key Strengths Cards */}
          <div className="lg:col-span-7 flex flex-col gap-5 justify-between">
            {about.strengths.map((item, idx) => (
              <div
                key={item.title}
                className="bg-surface-container border border-white/5 p-6 rounded-2xl shadow-md hover:border-primary-container/30 hover:bg-surface-container-high transition-all duration-300 flex flex-col sm:flex-row items-start gap-5 group"
              >
                <div className="w-14 h-14 shrink-0 rounded-xl bg-secondary-container/20 border border-secondary-container/30 flex items-center justify-center shadow-[0_0_16px_rgba(187,1,2,0.2)] group-hover:scale-105 transition-transform">
                  {strengthIcons[idx]}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-display font-bold text-lg uppercase text-white">
                      {item.title}
                    </h4>
                    <span className="px-2 py-0.5 bg-surface-container-highest text-primary-container font-display text-xs font-bold uppercase rounded">
                      {item.badge}
                    </span>
                  </div>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

