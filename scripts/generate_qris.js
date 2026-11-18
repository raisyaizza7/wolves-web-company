const QRCode = require('qrcode');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateQRIS() {
  const qrString = '00020101021226600016ID.CO.QRIS.WWW01189360099900012345670215ID10202611080010303UME51440014ID.LINKAJA.WWW01189360099900012345670215ID10202611080010303UME5204581253033605802ID5924WOLVES BASKETBALL CLUB6008CIBINONG61051691562070703A016304E85B';

  // 1. Generate QR buffer
  const qrBuffer = await QRCode.toBuffer(qrString, {
    width: 380,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });

  // 2. Prepare SVG Card template (Width: 500, Height: 700)
  const cardSvg = `
  <svg width="500" height="700" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#bb0102" />
        <stop offset="100%" stop-color="#ff0000" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    </defs>

    <!-- Card Background -->
    <rect width="500" height="700" rx="28" fill="#ffffff" />
    <rect x="2" y="2" width="496" height="696" rx="26" fill="none" stroke="#bb0102" stroke-width="3" />

    <!-- Top Red Banner -->
    <path d="M 0 28 Q 0 0 28 0 L 472 0 Q 500 0 500 28 L 500 70 L 0 70 Z" fill="url(#headerGrad)" />
    
    <!-- Top Text Header -->
    <text x="250" y="44" font-family="'Anybody', sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle" letter-spacing="3">
      QRIS • PEMBAYARAN DIGITAL
    </text>

    <!-- Subtitle Banner -->
    <rect x="30" y="85" width="440" height="58" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
    <text x="250" y="110" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="16" fill="#131313" text-anchor="middle">
      WOLVES BASKETBALL CLUB
    </text>
    <text x="250" y="130" font-family="'Space Grotesk', sans-serif" font-weight="500" font-size="11" fill="#64748b" text-anchor="middle">
      NMID: ID1020261108001 • Cibinong, Kab. Bogor
    </text>

    <!-- QR Code Container Box -->
    <rect x="50" y="160" width="400" height="400" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#shadow)" />

    <!-- Bottom Instructions & Supported Wallets -->
    <rect x="30" y="580" width="440" height="95" rx="14" fill="#0f172a" />
    <text x="250" y="605" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#f8fafc" text-anchor="middle" letter-spacing="1">
      MENERIMA SEMUA PEMBAYARAN QRIS NASIONAL
    </text>
    <text x="250" y="628" font-family="'Space Grotesk', sans-serif" font-weight="500" font-size="11" fill="#cbd5e1" text-anchor="middle">
      BCA Mobile • Mandiri Livin • BRImo • BNI Mobile • BSI
    </text>
    <text x="250" y="648" font-family="'Space Grotesk', sans-serif" font-weight="500" font-size="11" fill="#cbd5e1" text-anchor="middle">
      GoPay • OVO • DANA • ShopeePay • LinkAja
    </text>
    <text x="250" y="666" font-family="'Space Grotesk', sans-serif" font-weight="400" font-size="9" fill="#94a3b8" text-anchor="middle">
      STANDAR PEMBAYARAN RESMI BANK INDONESIA &amp; ASPI
    </text>
  </svg>
  `;

  // 3. Composite QR code onto card and add Wolves logo in center
  const logoPath = path.join(__dirname, '../public/images/logo.png');
  const outPath = path.join(__dirname, '../public/images/qris-wolves.png');

  // Resize logo for QR center
  const logoCenter = await sharp(logoPath)
    .resize(70, 70, { fit: 'contain' })
    .toBuffer();

  const baseCard = await sharp(Buffer.from(cardSvg))
    .png()
    .toBuffer();

  // Overlay QR code at x: 60, y: 170
  // Overlay center logo at x: 215, y: 325
  const finalImage = await sharp(baseCard)
    .composite([
      {
        input: qrBuffer,
        top: 170,
        left: 60,
      },
      {
        // Small white circle behind logo
        input: Buffer.from(`
          <svg width="78" height="78">
            <circle cx="39" cy="39" r="38" fill="#ffffff" stroke="#bb0102" stroke-width="3" />
          </svg>
        `),
        top: 321,
        left: 211,
      },
      {
        input: logoCenter,
        top: 325,
        left: 215,
      }
    ])
    .png()
    .toFile(outPath);

  console.log('Generated QRIS successfully at:', outPath);
}

generateQRIS().catch(console.error);
