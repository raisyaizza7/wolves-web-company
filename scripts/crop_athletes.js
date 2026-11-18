const sharp = require('sharp');
const path = require('path');

const srcImage = path.join(__dirname, '../public/images/hero-basketball.jpg');
const outDir = path.join(__dirname, '../public/images/athletes');

// Precision adjusted coordinates
const players = [
  {
    name: 'player-6',
    desc: 'Jersey 6 (Sitting Left)',
    left: 175,
    top: 340,
    width: 155,
    height: 195,
  },
  {
    name: 'player-8',
    desc: 'Jersey 8 (Far Left standing)',
    left: 110,
    top: 115,
    width: 145,
    height: 185,
  },
  {
    name: 'player-12',
    desc: 'Jersey 12 (Standing left)',
    left: 230,
    top: 125,
    width: 125,
    height: 165,
  },
  {
    name: 'player-9',
    desc: 'Jersey 9 (Standing next to coach)',
    left: 315,
    top: 125,
    width: 115,
    height: 155,
  },
  {
    name: 'player-17',
    desc: 'Jersey 17 (Sitting Right)',
    left: 475,
    top: 325,
    width: 150,
    height: 190,
  },
  {
    name: 'player-11',
    desc: 'Jersey 11 (Center Right)',
    left: 545,
    top: 165,
    width: 140,
    height: 180,
  },
  {
    name: 'player-5',
    desc: 'Jersey 5 (Front Right crouching)',
    left: 660,
    top: 200,
    width: 140,
    height: 180,
  },
  {
    name: 'player-10',
    desc: 'Jersey 10 (Back Right)',
    left: 650,
    top: 115,
    width: 125,
    height: 160,
  },
  {
    name: 'player-15',
    desc: 'Jersey 15 (Far Right standing)',
    left: 730,
    top: 120,
    width: 125,
    height: 160,
  },
  {
    name: 'player-captain',
    desc: 'Captain (Center with trophy)',
    left: 345,
    top: 270,
    width: 150,
    height: 195,
  }
];

async function run() {
  for (const p of players) {
    const outFile = path.join(outDir, `${p.name}.jpg`);
    await sharp(srcImage)
      .extract({ left: p.left, top: p.top, width: p.width, height: p.height })
      .resize(400, 500, { fit: 'cover' })
      .jpeg({ quality: 92 })
      .toFile(outFile);
    console.log(`Saved ${p.name}`);
  }
}

run().catch(console.error);
