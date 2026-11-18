const sharp = require('sharp');
const path = require('path');

const src = path.join(__dirname, '../public/uploads/aa65623b-962c-48a9-9768-410616655f52.jpg');
const dest = path.join(__dirname, '../public/images/athletes/raisya-izza.jpg');

async function cropRaisya() {
  // Source is 2048 x 1365
  // Raisya is centered around x: 980, y: 650
  // Let crop a box 900 wide x 1125 high (4:5 portrait)
  const left = 680;
  const top = 220;
  const width = 880;
  const height = 1100;

  await sharp(src)
    .extract({ left, top, width, height })
    .resize(600, 750, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(dest);

  console.log('Saved Raisya portrait to:', dest);
}

cropRaisya().catch(console.error);
