import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RosterSection from "@/components/RosterSection";
import ServiceSection from "@/components/ServiceSection";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest text-on-surface">
      <Navbar />
      <main className="flex-1 w-full">
        <HeroSection />
        <AboutSection />
        <RosterSection />
        <ServiceSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
