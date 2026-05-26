// Simple SVG-based icon generator - creates 192x192 and 512x512 PNG placeholders
// In production, replace with actual designed icons
const fs = require('fs');

const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="32" fill="#0f0c29"/>
  <text x="96" y="110" font-family="Inter,sans-serif" font-size="72" font-weight="700" fill="#a855f7" text-anchor="middle">K</text>
</svg>`;

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="#0f0c29"/>
  <text x="256" y="300" font-family="Inter,sans-serif" font-size="200" font-weight="700" fill="#a855f7" text-anchor="middle">K</text>
</svg>`;

fs.writeFileSync('/home/runner/workspace/artifacts/academy/public/icon-192.svg', svg192);
fs.writeFileSync('/home/runner/workspace/artifacts/academy/public/icon-512.svg', svg512);
console.log('SVG icons generated');
