// Genera los iconos PWA desde public/favicon.svg. Uso: node scripts-icons.mjs
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
const svg = readFileSync('public/favicon.svg')
const out = (name, size, pad = 0) =>
  sharp(svg, { density: 512 }).resize(size - pad * 2, size - pad * 2)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#243b3f' })
    .png().toFile(`public/${name}`)
await Promise.all([
  out('icon-192.png', 192), out('icon-512.png', 512),
  out('icon-512-maskable.png', 512, 64), out('apple-touch-icon.png', 180),
])
