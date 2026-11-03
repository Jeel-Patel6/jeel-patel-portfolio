import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public/assets';
mkdirSync(OUT, { recursive: true });

// Create a high-tech, cinematic AI & ML Developer neural silhouette
const portraitSvg = `
<svg width="900" height="1200" viewBox="0 0 900 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="halo" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#ff3d5a" stop-opacity="0.32" />
      <stop offset="60%" stop-color="#7a0f24" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#07070a" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e202d" />
      <stop offset="45%" stop-color="#12131c" />
      <stop offset="100%" stop-color="#08080d" />
    </linearGradient>
    <linearGradient id="rimRed" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff3d5a" stop-opacity="0.9" />
      <stop offset="10%" stop-color="#ff3d5a" stop-opacity="0" />
      <stop offset="90%" stop-color="#4cc9ff" stop-opacity="0" />
      <stop offset="100%" stop-color="#4cc9ff" stop-opacity="0.85" />
    </linearGradient>
    <linearGradient id="cyberLine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff3d5a" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#ff8a5c" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#4cc9ff" stop-opacity="0" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Aura -->
  <circle cx="450" cy="520" r="420" fill="url(#halo)" />

  <!-- Geometric Neural Grid -->
  <g opacity="0.35" stroke="#ff3d5a" stroke-width="1.2" stroke-dasharray="4 6">
    <circle cx="450" cy="460" r="320" fill="none" />
    <circle cx="450" cy="460" r="230" fill="none" stroke="#4cc9ff" />
    <line x1="130" y1="460" x2="770" y2="460" />
    <line x1="450" y1="140" x2="450" y2="780" />
    <line x1="223" y1="233" x2="677" y2="687" stroke="#b98bff" />
    <line x1="223" y1="687" x2="677" y2="233" stroke="#b98bff" />
  </g>

  <!-- Developer Silhouette: Shoulders & Torso -->
  <path d="M 120 1200 
           C 140 1020, 220 890, 310 820 
           C 360 780, 400 760, 450 760 
           C 500 760, 540 780, 590 820 
           C 680 890, 760 1020, 780 1200 
           Z" 
        fill="url(#bodyGrad)" stroke="url(#rimRed)" stroke-width="3" />

  <!-- Developer Silhouette: Neck & Head -->
  <path d="M 395 770 L 395 650 C 375 640, 330 570, 330 460 C 330 330, 380 250, 450 250 C 520 250, 570 330, 570 460 C 570 570, 525 640, 505 650 L 505 770 Z" 
        fill="url(#bodyGrad)" stroke="url(#rimRed)" stroke-width="3" />

  <!-- Neural Constellation across Developer Silhouette -->
  <g filter="url(#glow)">
    <!-- Synaptic Nodes -->
    <circle cx="450" cy="330" r="6" fill="#ff3d5a" />
    <circle cx="400" cy="380" r="5" fill="#ff8a5c" />
    <circle cx="500" cy="380" r="5" fill="#4cc9ff" />
    <circle cx="450" cy="440" r="7" fill="#ffffff" />
    <circle cx="380" cy="490" r="5" fill="#46e3a8" />
    <circle cx="520" cy="490" r="5" fill="#b98bff" />
    <circle cx="450" cy="550" r="6" fill="#ff3d5a" />
    <circle cx="340" cy="620" r="4" fill="#4cc9ff" />
    <circle cx="560" cy="620" r="4" fill="#ff8a5c" />

    <circle cx="450" cy="690" r="7" fill="#ffffff" />
    <circle cx="360" cy="800" r="6" fill="#ff3d5a" />
    <circle cx="540" cy="800" r="6" fill="#4cc9ff" />
    <circle cx="280" cy="920" r="6" fill="#b98bff" />
    <circle cx="450" cy="880" r="7" fill="#46e3a8" />
    <circle cx="620" cy="920" r="6" fill="#ff8a5c" />
    <circle cx="200" cy="1070" r="7" fill="#ff3d5a" />
    <circle cx="360" cy="1020" r="6" fill="#4cc9ff" />
    <circle cx="540" cy="1020" r="6" fill="#ff3d5a" />
    <circle cx="700" cy="1070" r="7" fill="#46e3a8" />

    <!-- Neural Connecting Fibers -->
    <g stroke="url(#cyberLine)" stroke-width="2" fill="none">
      <line x1="450" y1="330" x2="400" y2="380" />
      <line x1="450" y1="330" x2="500" y2="380" />
      <line x1="400" y1="380" x2="450" y2="440" />
      <line x1="500" y1="380" x2="450" y2="440" />
      <line x1="450" y1="440" x2="380" y2="490" />
      <line x1="450" y1="440" x2="520" y2="490" />
      <line x1="380" y1="490" x2="450" y2="550" />
      <line x1="520" y1="490" x2="450" y2="550" />
      <line x1="380" y1="490" x2="340" y2="620" />
      <line x1="520" y1="490" x2="560" y2="620" />
      <line x1="450" y1="550" x2="450" y2="690" />
      <line x1="340" y1="620" x2="450" y2="690" />
      <line x1="560" y1="620" x2="450" y2="690" />
      <line x1="450" y1="690" x2="360" y2="800" />
      <line x1="450" y1="690" x2="540" y2="800" />
      <line x1="360" y1="800" x2="450" y2="880" />
      <line x1="540" y1="800" x2="450" y2="880" />
      <line x1="360" y1="800" x2="280" y2="920" />
      <line x1="540" y1="800" x2="620" y2="920" />
      <line x1="280" y1="920" x2="200" y2="1070" />
      <line x1="280" y1="920" x2="360" y2="1020" />
      <line x1="450" y1="880" x2="360" y2="1020" />
      <line x1="450" y1="880" x2="540" y2="1020" />
      <line x1="620" y1="920" x2="540" y2="1020" />
      <line x1="620" y1="920" x2="700" y2="1070" />
    </g>
  </g>

  <!-- Futuristic JP Monogram Crest on Chest -->
  <g transform="translate(450, 880)" filter="url(#glow)">
    <rect x="-42" y="-36" width="84" height="72" rx="14" fill="#0b0b12" stroke="#ff3d5a" stroke-width="2" />
    <text x="0" y="14" font-family="'Inter', sans-serif" font-weight="900" font-size="34" fill="#f4f1ec" text-anchor="middle" letter-spacing="3">JP</text>
  </g>
</svg>
`;

// Render the 3 WebP sizes
const portraitBuffer = Buffer.from(portraitSvg);
for (const w of [1100, 720, 420]) {
  const h = Math.round((w * 1200) / 900);
  await sharp(portraitBuffer)
    .resize({ width: w, height: h })
    .webp({ quality: 90, alphaQuality: 92 })
    .toFile(`${OUT}/portrait-${w}.webp`);
}

// Generate Social Share Image (1200x630)
const ogPortrait = await sharp(portraitBuffer).resize({ height: 580 }).png().toBuffer();
await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: '#07070a',
  },
})
  .composite([
    {
      input: Buffer.from(`
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ogGlow" cx="75%" cy="50%" r="55%">
              <stop offset="0%" stop-color="#ff3d5a" stop-opacity="0.38" />
              <stop offset="60%" stop-color="#7a0f24" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#07070a" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#ogGlow)" />
          <text x="75" y="270" font-family="'Impact', 'Arial Black', sans-serif" font-size="124" fill="#f4f1ec" letter-spacing="6">JEEL PATEL</text>
          <text x="80" y="335" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="24" fill="#ff3d5a" letter-spacing="18">THE SERIES</text>
          <text x="80" y="405" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="19" fill="#a7a6ad" letter-spacing="6">AI/ML STUDENT &amp; DEVELOPER</text>
          <text x="80" y="445" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="500" font-size="15" fill="#ffb547" letter-spacing="3">COMPUTER SCIENCE ENGINEERING • INTELLIGENT SYSTEMS</text>
        </svg>
      `),
    },
    { input: ogPortrait, gravity: 'southeast', top: 50, left: 680 },
  ])
  .jpeg({ quality: 88 })
  .toFile(`${OUT}/og-image.jpg`);

console.log('Successfully generated clean, neutral AI/ML assets for Jeel Patel');
