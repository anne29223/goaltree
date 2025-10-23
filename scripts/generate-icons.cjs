const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    let svgPath = path.resolve(__dirname, '..', 'vite.svg');
    if (!fs.existsSync(svgPath)) {
      // fallback to a repo-local logo
      svgPath = path.resolve(__dirname, '..', 'public', 'icons', 'logo.svg');
      if (!fs.existsSync(svgPath)) {
        console.error('No svg source found (vite.svg or public/icons/logo.svg)');
        process.exit(1);
      }
      console.log('Using fallback svg at', svgPath);
    }

    const outDir = path.resolve(__dirname, '..', 'public', 'icons');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const svgBuffer = fs.readFileSync(svgPath);

    const sizes = [192, 512];
    for (const size of sizes) {
      const outPath = path.join(outDir, `icon-${size}.png`);
      await sharp(svgBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(outPath);
      console.log('Written', outPath);
    }

    // maskable icon (512)
    const maskPath = path.join(outDir, 'icon-maskable.png');
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(maskPath);
    console.log('Written', maskPath);

    console.log('Icons generated successfully');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
