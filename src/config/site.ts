export interface NavItem {
  label: string;
  href: string;
}

export interface MetricItem {
  value: string;
  label: string;
  highlight?: boolean;
}

export interface StrengthItem {
  icon: string;
  badge: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  badge: string;
  badgeVariant?: 'primary' | 'secondary' | 'accent';
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaHref: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

export interface ContactInfo {
  hq: {
    title: string;
    description: string;
  };
  whatsapp: {
    label: string;
    number: string;
    link: string;
  };
  email: {
    label: string;
    address: string;
  };
  operationalHours: {
    title: string;
    schedule: string;
  };
  maps: {
    name: string;
    address: string;
    notes: string;
    badge: string;
    directUrl: string;
    embedUrl: string;
  };
}

export const siteConfig = {
  name: "Wolves Basketball Club Kabupaten Bogor",
  shortName: "Wolves Kab. Bogor",
  tagline: "Siapkan Mental, Asah Skill, dan Dominasi Lapangan Bersama Kami!",
  description:
    "Mari bergabung & kembangkan potensi terbaikmu bersama kami! Wolves Kabupaten Bogor siap membina talenta muda menuju pentas nasional dengan kurikulum berjenjang dan fasilitas berstandar FIBA yang berlokasi di GOR Laga Tangkas Pakansari, Cibinong.",
  establishment: "PERBASI KABUPATEN BOGOR • EST. 2018",
  logo: "/images/logo.png",
  navItems: [
    { label: "Beranda", href: "/#beranda" },
    { label: "Profil", href: "/#profil" },
    { label: "Pemain Atlet", href: "/#pemain-atlet" },
    { label: "Program", href: "/#program-dan-layanan" },
    { label: "Merchandise", href: "/merchandise" },
    { label: "Berita", href: "/#berita" },
    { label: "Kontak", href: "/#kontak" },
  ] as NavItem[],
  metrics: [
    { value: "500+", label: "Siswa Akademi" },
    { value: "12", label: "Trofi Daerah", highlight: true },
    { value: "#1", label: "Sportainment" },
  ] as MetricItem[],
  about: {
    tagline: "PROFIL KLUB",
    title: "TENTANG WOLVES",
    titleHighlight: "KAB. BOGOR",
    subtitle:
      "Berdiri dengan komitmen membangkitkan gairah basket di Bogor Raya, Wolves Basketball Club menghadirkan pembinaan profesional berstandar nasional, fasilitas modern, serta kultur sportivitas tangguh bermental pemenang.",
    narrativeTitle: "Dari Cibinong Untuk Indonesia",
    paragraphs: [
      "Berdiri dengan tekad mengangkat martabat bola basket Kabupaten Bogor, Wolves memadukan metode kepelatihan berstandar internasional dengan kedisiplinan lokal. Kami melatih mental pantang menyerah sebelum mencetak poin.",
      "Kurikulum latihan terstruktur dan berjenjang memastikan perkembangan fundamental teknis, fisik, dan taktik setiap kelompok usia di dalam maupun di luar court.",
    ],
    image: "/images/about-clinic.jpg",
    imageCaption: "Pusat Latihan Pakansari",
    strengths: [
      {
        icon: "sports",
        badge: "Certified",
        title: "Pelatih Berlisensi Nasional & FIBA",
        description:
          "Kurikulum latihan terstruktur dan berjenjang untuk memastikan perkembangan fundamental teknis dan taktik setiap kelompok usia.",
      },
      {
        icon: "stadium",
        badge: "Pakansari Base",
        title: "Fasilitas Court Standar FIBA",
        description:
          "GOR representatif dengan hardwood court berstandar turnamen, scoring board digital, serta pusat kebugaran performa atletik.",
      },
      {
        icon: "military_tech",
        badge: "Pathways",
        title: "Jalur Karir & Kompetisi Rutin",
        description:
          "Akses langsung menuju kejuaraan Perbasi, sirkuit pelajar, hingga scouting talent menuju seleksi tim PON Jawa Barat dan IBL.",
      },
    ] as StrengthItem[],
  },
  services: [
    {
      badge: "U-10 • U-14 • U-18",
      badgeVariant: "secondary",
      title: "Akademi Basket Usia Muda",
      description:
        "Kurikulum berjenjang melatih fundamental dribbling, shooting mechanics, agility, dan sportivitas sejak dini. Kelas intensif 3x seminggu.",
      image: "/images/service-academy.jpg",
      ctaText: "Daftar Akademi",
      ctaHref: "/register",
    },
    {
      badge: "Pro • 3x3 Tour",
      badgeVariant: "accent",
      title: "Tim Prestasi & Sportainment",
      description:
        "Laga kompetitif liga, eksibisi selebriti/atlet nasional, festival musik half-time, serta turnamen 3x3 sirkuit Bogor Open.",
      image: "/images/service-sportainment.jpg",
      ctaText: "Kalender Event",
      ctaHref: "/#kontak",
    },
    {
      badge: "Pakansari Arena",
      badgeVariant: "accent",
      title: "Penyewaan Lapangan & Venue",
      description:
        "Sewa court indoor berstandar FIBA, ruang ganti VIP, scoring board LED, dan sound system untuk turnamen korporat maupun komunitas.",
      image: "/images/service-court.jpg",
      ctaText: "Reservasi Lapangan",
      ctaHref: "/#kontak",
    },
    {
      badge: "Official Merch",
      badgeVariant: "primary",
      title: "Merchandise & Wolves Store",
      description:
        "Jersey tanding authentic Wolves Bogor, hoodie warm-up, shooting shirts, basketball socks, dan aksesoris eksklusif suporter.",
      image: "/images/service-merch.jpg",
      ctaText: "Beli via QRIS",
      ctaHref: "/merchandise",
    },
  ] as ServiceItem[],
  news: [
    {
      id: "1",
      title: "Wolves U-17 Raih Gelar Juara Perbasi Cup Bogor 2025",
      slug: "wolves-u17-raih-gelar-juara-perbasi-cup-bogor-2025",
      category: "Prestasi",
      date: "18 Mei 2025",
      excerpt:
        "Tampil dominan dengan pertahanan kokoh sejak kuarter pertama, skuad muda Wolves mengunci kemenangan final dramatis 78-71 di GOR Laga Tangkas.",
      image: "/images/news-championship.jpg",
    },
    {
      id: "2",
      title: "Open Recruitment: Seleksi Beasiswa Talenta Muda Wolves Academy",
      slug: "open-recruitment-seleksi-beasiswa-talenta-muda-wolves-academy",
      category: "Akademi",
      date: "12 Mei 2025",
      excerpt:
        "Peluang beasiswa penuh pembinaan basket bagi atlet potensial kelahiran 2008-2012 di wilayah Kabupaten Bogor dan sekitarnya.",
      image: "/images/news-recruitment.jpg",
    },
    {
      id: "3",
      title: "Pesta Sportainment Wolves di Pakansari Hadirkan Dunk Show Spektakuler",
      slug: "pesta-sportainment-wolves-di-pakansari-hadirkan-dunk-show-spektakuler",
      category: "Sportainment",
      date: "05 Mei 2025",
      excerpt:
        "Ribuan penonton memadati arena menyaksikan duel bintang 3x3, kompetisi three-point shoot-out komunitas, serta pertunjukan slam dunk eksibisi.",
      image: "/images/news-dunk.jpg",
    },
  ] as NewsItem[],
  contact: {
    hq: {
      title: "Markas Latihan",
      description: "GOR Laga Tangkas Pakansari, Cibinong, Kab. Bogor",
    },
    whatsapp: {
      label: "+62 812-8899-7700",
      number: "6281288997700",
      link: "https://wa.me/6281288997700?text=Halo%20Admin%20Wolves%20Bogor,%20saya%20ingin%20bertanya%20mengenai%20layanan%20Wolves.",
    },
    email: {
      label: "sekretariat@wolvesbogor.id",
      address: "sekretariat@wolvesbogor.id",
    },
    operationalHours: {
      title: "Jam Operasional",
      schedule: "Selasa - Minggu: 08.00 - 22.00",
    },
    maps: {
      name: "Wolves Basketball Arena (GOR Laga Tangkas)",
      address: "GOR Laga Tangkas Pakansari, Kawasan Stadion Pakansari, Cibinong, Kab. Bogor",
      notes: "Parkir Luas & Akses Tol Jagorawi (10 Menit dari Exit Tol Sentul Utara)",
      badge: "Home Court",
      directUrl: "https://maps.google.com/?q=GOR+Laga+Tangkas+Pakansari+Bogor",
      embedUrl: "https://maps.google.com/maps?q=GOR%20Laga%20Tangkas%20Pakansari%20Bogor&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  } as ContactInfo,
  footer: {
    copyright: "© 2025 Wolves Basketball Club Kabupaten Bogor. Seluruh hak cipta dilindungi.",
    tagline: "Bogor Pride - Championship Mentality",
  },
};

