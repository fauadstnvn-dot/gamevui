// Chạy trong Chromium: vẽ màn mở màn "VS" theo thời gian t (xác định, không ngẫu nhiên theo thời gian thực)
// và tổng hợp âm thanh bằng OfflineAudioContext. Được runner/intro.mjs gọi qua window.Intro.
(() => {
  const W = 1920
  const H = 1080
  const TLI = {
    slideEnd: 0.9,
    vsAt: 0.9,
    questionAt: 2.2,
    countAt: 4.8,
    readyAt: 7.8,
    goAt: 8.8,
    end: 9.7,
  }
  let TL = TLI
  let mode = 'intro'

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
  const lerp = (a, b, k) => a + (b - a) * k
  const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x), 3)
  const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)))
  const easeOutBack = (x) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    const k = clamp(x)
    return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2)
  }
  const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
  const mulberry = (seed) => () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const hash = (n) => {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
    return s - Math.floor(s)
  }

  const THEMES = {
    clash: { colA: '#18a0ff', colB: '#ff2b3d', accent: '#ffe14d', bg: ['#0a0f2c', '#1b1040', '#2a0a22'], font: 'Anton' },
    inferno: { colA: '#ffb300', colB: '#d9001b', accent: '#ff7a00', bg: ['#1a0300', '#4a0a00', '#140000'], font: 'Anton' },
    cyber: { colA: '#00f0ff', colB: '#ff2bd6', accent: '#b6ff3b', bg: ['#03041a', '#0b0630', '#16033a'], font: 'RussoOne' },
    arena: { colA: '#3fe0a0', colB: '#b02bff', accent: '#ffd23d', bg: ['#0c0720', '#26104a', '#0a0414'], font: 'Bebas' },
    storm: { colA: '#5ad7ff', colB: '#ff5a3d', accent: '#e6f3ff', bg: ['#050b14', '#0d1d33', '#0a0f1c'], font: 'Anton' },
    frost: { colA: '#7fdcff', colB: '#b57bff', accent: '#e9fbff', bg: ['#06142a', '#0f2b52', '#0a1a33'], font: 'Bebas' },
    toxic: { colA: '#a6ff00', colB: '#ff2e7e', accent: '#e6ff4d', bg: ['#04120a', '#0a2e12', '#05140a'], font: 'RussoOne' },
    royal: { colA: '#ffd23d', colB: '#7a3bff', accent: '#fff1a8', bg: ['#12061f', '#2a0f4a', '#0c0414'], font: 'Bebas' },
    void: { colA: '#46e6ff', colB: '#ff3b6b', accent: '#c9a8ff', bg: ['#02020a', '#0a0620', '#050210'], font: 'RussoOne' },
    sunset: { colA: '#ff9a3d', colB: '#d62bff', accent: '#ffef7a', bg: ['#1a0630', '#4a0a4a', '#2a0626'], font: 'Anton' },
  }
  const COUNT_COLORS = ['#ff3b3b', '#ffd23d', '#3fe0ff'] // 1, 2, 3 (index = n-1)

  let cfg = null
  let imgs = {}
  let canvas = null
  let ctx = null
  let scale = 1
  let particles = []

  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null)
      const im = new Image()
      im.onload = () => resolve(im)
      im.onerror = () => resolve(null)
      im.src = src
    })
  }

  async function init(config) {
    cfg = config
    mode = cfg.mode === 'outro' ? 'outro' : 'intro'
    TL = mode === 'outro' ? window.IntroOutro.TL : TLI
    cfg.theme = THEMES[cfg.style] ?? THEMES.clash
    canvas = document.createElement('canvas')
    canvas.width = cfg.width
    canvas.height = cfg.height
    ctx = canvas.getContext('2d')
    scale = cfg.width / W
    const faces = [
      ['Anton', cfg.fonts.anton],
      ['Bebas', cfg.fonts.bebas],
      ['RussoOne', cfg.fonts.russo],
    ]
    for (const [name, url] of faces) {
      const ff = new FontFace(name, `url(${url})`)
      await ff.load()
      document.fonts.add(ff)
    }
    imgs.mount = await loadImage(cfg.mountImg)
    imgs.boss = await loadImage(cfg.bossImg)
    imgs.monsters = (await Promise.all(cfg.monsterImgs.map(loadImage))).filter(Boolean)
    const rnd = mulberry(cfg.seed)
    particles = Array.from({ length: 90 }, () => ({
      x: rnd() * W,
      y: rnd() * H,
      s: 0.4 + rnd() * 1.6,
      v: 40 + rnd() * 140,
      p: rnd() * 6.28,
      r: 2 + rnd() * 5,
    }))
    return { frames: Math.ceil(TL.end * cfg.fps), duration: TL.end }
  }

  const fontOf = (px, family) => `${px}px "${family ?? cfg.theme.font}", "Noto Sans", Impact, sans-serif`

  // ---------- nền ----------
  function drawBackground(t) {
    const th = cfg.theme
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, th.bg[0])
    g.addColorStop(0.55, th.bg[1])
    g.addColorStop(1, th.bg[2])
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    switch (cfg.style) {
      case 'inferno': {
        const glow = ctx.createRadialGradient(W / 2, H + 100, 50, W / 2, H, 900)
        glow.addColorStop(0, 'rgba(255,140,0,0.75)')
        glow.addColorStop(1, 'rgba(255,60,0,0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, W, H)
        for (let i = 0; i < 70; i++) {
          const x = (hash(i) * W + Math.sin(t * 1.5 + i) * 40 + W) % W
          const life = (t * (0.18 + hash(i + 9) * 0.25) + hash(i + 3)) % 1
          const y = H + 40 - life * (H + 120)
          const r = (1 - life) * (28 + hash(i + 5) * 38)
          const fg = ctx.createRadialGradient(x, y, 0, x, y, r)
          fg.addColorStop(0, `rgba(255,${Math.round(210 - life * 120)},40,${0.55 * (1 - life)})`)
          fg.addColorStop(1, 'rgba(255,60,0,0)')
          ctx.fillStyle = fg
          ctx.fillRect(x - r, y - r, r * 2, r * 2)
        }
        break
      }
      case 'cyber': {
        ctx.save()
        ctx.strokeStyle = 'rgba(0,240,255,0.35)'
        ctx.lineWidth = 2
        const hor = H * 0.52
        for (let i = -20; i <= 20; i++) {
          ctx.beginPath()
          ctx.moveTo(W / 2 + i * 40, hor)
          ctx.lineTo(W / 2 + i * 260, H)
          ctx.stroke()
        }
        const off = (t * 0.9) % 1
        for (let i = 0; i < 14; i++) {
          const k = (i + off) / 14
          const y = hor + Math.pow(k, 2.2) * (H - hor)
          ctx.globalAlpha = 0.15 + k * 0.5
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(W, y)
          ctx.stroke()
        }
        ctx.restore()
        ctx.fillStyle = 'rgba(255,43,214,0.08)'
        for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2)
        break
      }
      case 'arena': {
        ctx.save()
        ctx.translate(W / 2, H / 2)
        ctx.rotate(t * 0.12)
        const rays = 28
        for (let i = 0; i < rays; i++) {
          if (i % 2) continue
          ctx.beginPath()
          ctx.moveTo(0, 0)
          const a0 = (i / rays) * Math.PI * 2
          const a1 = ((i + 1) / rays) * Math.PI * 2
          ctx.lineTo(Math.cos(a0) * 1800, Math.sin(a0) * 1800)
          ctx.lineTo(Math.cos(a1) * 1800, Math.sin(a1) * 1800)
          ctx.closePath()
          const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, 1300)
          rg.addColorStop(0, 'rgba(255,210,61,0.38)')
          rg.addColorStop(1, 'rgba(255,210,61,0)')
          ctx.fillStyle = rg
          ctx.fill()
        }
        ctx.restore()
        for (const sx of [330, 1590]) {
          const sp = ctx.createLinearGradient(sx, 0, sx + (sx < W / 2 ? 160 : -160), H)
          sp.addColorStop(0, 'rgba(255,255,255,0.22)')
          sp.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = sp
          ctx.beginPath()
          ctx.moveTo(sx - 30, 0)
          ctx.lineTo(sx + 30, 0)
          ctx.lineTo(sx + (sx < W / 2 ? 420 : -420), H)
          ctx.lineTo(sx + (sx < W / 2 ? -260 : 260), H)
          ctx.closePath()
          ctx.fill()
        }
        break
      }
      case 'storm': {
        ctx.strokeStyle = 'rgba(180,220,255,0.22)'
        ctx.lineWidth = 2
        for (let i = 0; i < 110; i++) {
          const x = (hash(i) * (W + 300) - 150 + t * 120 * 0 + ((t * 900 * (0.6 + hash(i + 2))) % 1) * 0) % W
          const y = ((hash(i + 7) * H + t * (1400 + hash(i + 4) * 900)) % (H + 200)) - 100
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x - 22, y + 70)
          ctx.stroke()
        }
        const slot = Math.floor(t * 2.2)
        const ph = t * 2.2 - slot
        if (hash(slot + 17) > 0.35 && ph < 0.18) {
          ctx.fillStyle = `rgba(210,235,255,${0.35 * (1 - ph / 0.18)})`
          ctx.fillRect(0, 0, W, H)
          drawBolt(hash(slot) * W, 0, 0.5 + hash(slot + 1) * 0.5, slot, 'rgba(235,245,255,0.95)')
        }
        break
      }
      case 'frost': {
        const glow = ctx.createRadialGradient(W / 2, H * 0.35, 40, W / 2, H * 0.35, 1000)
        glow.addColorStop(0, 'rgba(160,230,255,0.28)')
        glow.addColorStop(1, 'rgba(160,230,255,0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = 'rgba(220,245,255,0.85)'
        for (let i = 0; i < 120; i++) {
          const y = ((hash(i) * H + t * (60 + hash(i + 1) * 160)) % (H + 20)) - 10
          const x = (hash(i + 2) * W + Math.sin(t * 0.8 + i) * 50 + W) % W
          ctx.globalAlpha = 0.35 + hash(i + 4) * 0.6
          ctx.beginPath()
          ctx.arc(x, y, 2 + hash(i + 3) * 5, 0, 6.283)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        ctx.fillStyle = 'rgba(150,215,255,0.18)'
        for (let i = 0; i < 9; i++) {
          const x = i * 260 - 40
          const h = 160 + hash(i + 11) * 220
          ctx.beginPath()
          ctx.moveTo(x, H)
          ctx.lineTo(x + 90, H - h)
          ctx.lineTo(x + 200, H)
          ctx.fill()
        }
        break
      }
      case 'toxic': {
        const g2 = ctx.createRadialGradient(W / 2, H + 60, 40, W / 2, H, 1000)
        g2.addColorStop(0, 'rgba(120,255,0,0.45)')
        g2.addColorStop(1, 'rgba(120,255,0,0)')
        ctx.fillStyle = g2
        ctx.fillRect(0, 0, W, H)
        ctx.lineWidth = 3
        for (let i = 0; i < 60; i++) {
          const life = (t * (0.1 + hash(i + 2) * 0.18) + hash(i)) % 1
          const x = hash(i + 1) * W + Math.sin(t * 1.2 + i) * 30
          const y = H + 40 - life * (H + 120)
          const r = 10 + hash(i + 3) * 40 * (0.5 + life * 0.6)
          ctx.fillStyle = `rgba(120,255,0,${0.1 * (1 - life)})`
          ctx.strokeStyle = `rgba(190,255,90,${0.55 * (1 - life)})`
          ctx.beginPath()
          ctx.arc(x, y, r, 0, 6.283)
          ctx.fill()
          ctx.stroke()
        }
        break
      }
      case 'royal': {
        const rg = ctx.createRadialGradient(W / 2, H * 0.45, 50, W / 2, H * 0.45, 950)
        rg.addColorStop(0, 'rgba(255,210,61,0.32)')
        rg.addColorStop(1, 'rgba(255,210,61,0)')
        ctx.fillStyle = rg
        ctx.fillRect(0, 0, W, H)
        ctx.strokeStyle = 'rgba(255,210,61,0.09)'
        ctx.lineWidth = 2
        for (let i = -10; i < 30; i++) {
          ctx.beginPath()
          ctx.moveTo(i * 120, 0)
          ctx.lineTo(i * 120 + H, H)
          ctx.moveTo(i * 120 + H, 0)
          ctx.lineTo(i * 120, H)
          ctx.stroke()
        }
        ctx.fillStyle = '#ffe9a0'
        for (let i = 0; i < 80; i++) {
          const y = (hash(i + 2) * H - t * (20 + hash(i) * 50) + H * 4) % H
          const x = hash(i) * W
          const r = 2 + hash(i + 5) * 5
          ctx.globalAlpha = 0.2 + 0.8 * Math.abs(Math.sin(t * 2 + i))
          ctx.fillRect(x - r, y - 1, r * 2, 2)
          ctx.fillRect(x - 1, y - r, 2, r * 2)
        }
        ctx.globalAlpha = 1
        break
      }
      case 'void': {
        ctx.fillStyle = '#fff'
        for (let i = 0; i < 140; i++) {
          const z = 0.3 + hash(i) * 1.2
          const x = (hash(i + 1) * W - t * 30 * z + W * 4) % W
          ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t * z + i))
          ctx.beginPath()
          ctx.arc(x, hash(i + 2) * H, z * 1.6, 0, 6.283)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        ctx.save()
        ctx.translate(W / 2, H * 0.5)
        ctx.lineWidth = 6
        for (let k = 0; k < 4; k++) {
          ctx.save()
          ctx.rotate(t * (0.25 + k * 0.1))
          ctx.strokeStyle = hexA(k % 2 ? th.colB : th.colA, 0.24)
          ctx.beginPath()
          ctx.ellipse(0, 0, 420 + k * 110, 150 + k * 40, k * 0.7, 0, 5)
          ctx.stroke()
          ctx.restore()
        }
        ctx.restore()
        break
      }
      case 'sunset': {
        const sy = H * 0.46
        const sr = 330
        const sg2 = ctx.createLinearGradient(0, sy - sr, 0, sy + sr)
        sg2.addColorStop(0, '#ffef7a')
        sg2.addColorStop(1, '#ff4fa0')
        ctx.save()
        ctx.beginPath()
        ctx.arc(W / 2, sy, sr, 0, 6.283)
        ctx.clip()
        ctx.fillStyle = sg2
        ctx.fillRect(W / 2 - sr, sy - sr, sr * 2, sr * 2)
        ctx.fillStyle = th.bg[1]
        for (let i = 0; i < 9; i++) ctx.fillRect(W / 2 - sr, sy + 20 + i * 36, sr * 2, 3 + i * 3.2)
        ctx.restore()
        const gy = H * 0.64
        ctx.fillStyle = '#12041f'
        ctx.fillRect(0, gy, W, H - gy)
        ctx.strokeStyle = 'rgba(255,79,160,0.4)'
        ctx.lineWidth = 2
        for (let i = -20; i <= 20; i++) {
          ctx.beginPath()
          ctx.moveTo(W / 2 + i * 40, gy)
          ctx.lineTo(W / 2 + i * 240, H)
          ctx.stroke()
        }
        const off = (t * 0.7) % 1
        for (let i = 0; i < 10; i++) {
          const y = gy + Math.pow((i + off) / 10, 2) * (H - gy)
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(W, y)
          ctx.stroke()
        }
        ctx.fillStyle = '#12041f'
        for (let i = 0; i < 22; i++) {
          const bh = 40 + hash(i + 31) * 150
          ctx.fillRect(i * 90 + 10, gy - bh, 70, bh)
        }
        break
      }
      default: {
        // clash: tia tốc độ chạy ngang
        ctx.save()
        for (let i = 0; i < 40; i++) {
          const y = hash(i + 1) * H
          const len = 200 + hash(i + 2) * 500
          const x = ((t * (900 + hash(i + 3) * 1200) + hash(i + 4) * (W + len)) % (W + len)) - len
          ctx.fillStyle = `rgba(255,255,255,${0.04 + hash(i + 5) * 0.08})`
          ctx.fillRect(x, y, len, 3 + hash(i + 6) * 4)
        }
        ctx.restore()
      }
    }

    if (mode === 'outro') {
      drawParticles(t)
      return
    }

    // hai phe: tấm nghiêng nhuộm màu
    const slideA = easeOutCubic(t / TL.slideEnd)
    ctx.save()
    ctx.globalAlpha = 0.9
    const left = ctx.createLinearGradient(0, 0, 1000, 0)
    left.addColorStop(0, hexA(th.colA, 0.7))
    left.addColorStop(1, hexA(th.colA, 0.05))
    ctx.fillStyle = left
    ctx.beginPath()
    ctx.moveTo(-1000 * (1 - slideA), 0)
    ctx.lineTo(1080 - 1000 * (1 - slideA), 0)
    ctx.lineTo(840 - 1000 * (1 - slideA), H)
    ctx.lineTo(-1000 * (1 - slideA), H)
    ctx.fill()
    const right = ctx.createLinearGradient(W, 0, 920, 0)
    right.addColorStop(0, hexA(th.colB, 0.7))
    right.addColorStop(1, hexA(th.colB, 0.05))
    ctx.fillStyle = right
    ctx.beginPath()
    ctx.moveTo(W + 1000 * (1 - slideA), 0)
    ctx.lineTo(1080 + 1000 * (1 - slideA), 0)
    ctx.lineTo(840 + 1000 * (1 - slideA), H)
    ctx.lineTo(W + 1000 * (1 - slideA), H)
    ctx.fill()
    ctx.restore()

    // đường nứt điện ở giữa
    if (t > TL.vsAt) {
      const k = clamp((t - TL.vsAt) / 0.25)
      ctx.save()
      ctx.globalAlpha = k
      drawBolt(960 + 120, 0, 1, Math.floor(t * 14), hexA(th.accent, 0.95), H, -240)
      ctx.restore()
    }

    drawParticles(t)
  }

  function drawParticles(t) {
    const th = cfg.theme
    for (const p of particles) {
      const y = (p.y - t * p.v + H * 4) % H
      const x = p.x + Math.sin(t * p.s + p.p) * 30
      ctx.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(t * 2 * p.s + p.p))
      ctx.fillStyle = th.accent
      ctx.beginPath()
      ctx.arc(x, y, p.r * 0.6, 0, 6.283)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16)
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
  }

  function drawBolt(x, y, k, seed, color, length = H, drift = 0) {
    const rnd = mulberry(seed * 977 + 13)
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineJoin = 'round'
    ctx.shadowColor = color
    ctx.shadowBlur = 30
    for (const [w, a] of [[10, 0.35], [4, 1]]) {
      ctx.lineWidth = w * k
      ctx.globalAlpha = a
      ctx.beginPath()
      let cx = x
      ctx.moveTo(cx, y)
      const seg = 14
      const r2 = mulberry(seed * 977 + 13)
      for (let i = 1; i <= seg; i++) {
        cx = x + (drift * i) / seg + (r2() - 0.5) * 110 * k
        ctx.lineTo(cx, y + (length * i) / seg)
      }
      ctx.stroke()
    }
    void rnd
    ctx.restore()
  }

  // ---------- nhân vật ----------
  function drawFit(im, cx, baseY, maxW, maxH, opts = {}) {
    if (!im) return
    const s = Math.min(maxW / im.width, maxH / im.height)
    const w = im.width * s
    const h = im.height * s
    ctx.save()
    ctx.translate(cx, baseY)
    if (opts.flip) ctx.scale(-1, 1)
    ctx.shadowColor = opts.glow ?? 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = opts.blur ?? 36
    ctx.drawImage(im, -w / 2, -h, w, h)
    ctx.restore()
    return { w, h }
  }

  function groundShadow(cx, y, rx) {
    const g = ctx.createRadialGradient(cx, y, 0, cx, y, rx)
    g.addColorStop(0, 'rgba(0,0,0,0.55)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.save()
    ctx.translate(0, 0)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(cx, y, rx, rx * 0.2, 0, 0, 6.283)
    ctx.fill()
    ctx.restore()
  }

  function nameTag(text, cx, y, color, k) {
    ctx.save()
    ctx.globalAlpha = k
    ctx.font = fontOf(46)
    const w = ctx.measureText(text).width + 90
    ctx.translate(cx, y)
    ctx.transform(1, 0, -0.2, 1, 0, 0)
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0)
    g.addColorStop(0, hexA(color, 0.95))
    g.addColorStop(1, hexA(color, 0.55))
    ctx.fillStyle = g
    ctx.fillRect(-w / 2, -42, w, 78)
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillRect(-w / 2, -42, w, 4)
    ctx.transform(1, 0, 0.2, 1, 0, 0)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    ctx.shadowColor = 'rgba(0,0,0,0.7)'
    ctx.shadowBlur = 8
    ctx.fillText(text, 0, 0)
    ctx.restore()
  }

  function drawSides(t, shake) {
    const th = cfg.theme
    const a = easeOutCubic(t / TL.slideEnd)
    const dim = t > TL.countAt ? 0.82 : 1
    const bob = Math.sin(t * 3.2) * 8
    const bob2 = Math.sin(t * 3.2 + 1.6) * 8
    const charY = 880
    // Phe trái: thú cưỡi
    ctx.save()
    ctx.globalAlpha = dim
    const lx = lerp(-700, 470, a)
    groundShadow(lx, charY + 8, 330)
    const sc = 1 + Math.max(0, 1 - (t - TL.vsAt) / 0.4) * 0.04 * (t > TL.vsAt ? 1 : 0)
    ctx.save()
    ctx.translate(lx, charY + bob)
    ctx.scale(sc, sc)
    drawFit(imgs.mount, 0, 0, 760, 680, { glow: th.colA, blur: 46 })
    ctx.restore()
    nameTag(cfg.labels.left, lx, 960, th.colA, a)
    ctx.restore()
    // Phe phải: boss + quái
    ctx.save()
    ctx.globalAlpha = dim
    const rx = lerp(W + 700, 1450, a)
    groundShadow(rx, charY + 8, 380)
    ctx.save()
    ctx.translate(rx, charY + bob2)
    ctx.scale(sc, sc)
    drawFit(imgs.boss, 0, 0, 800, 720, { glow: th.colB, blur: 46 })
    ctx.restore()
    const ms = imgs.monsters.slice(0, 3)
    ms.forEach((im, i) => {
      const mxp = rx - 330 + i * 260 + (W + 700 - rx) * 0.2
      const my = charY + 20 + Math.sin(t * 4 + i * 2) * 6
      ctx.save()
      ctx.globalAlpha = dim * (0.4 + 0.6 * easeOutCubic((t - 0.25 - i * 0.12) / 0.5))
      drawFit(im, mxp, my, 230, 230, { glow: th.colB, blur: 24 })
      ctx.restore()
    })
    nameTag(cfg.labels.right, rx, 975, th.colB, a)
    ctx.restore()
    void shake
  }

  // ---------- VS ----------
  function drawVS(t, cx, cy, size, alpha, rot = 0) {
    const th = cfg.theme
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rot)
    ctx.globalAlpha = alpha
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const px = size
    ctx.font = fontOf(px)
    ctx.lineJoin = 'round'
    const grad = ctx.createLinearGradient(0, -px / 2, 0, px / 2)
    let glow = th.accent
    switch (cfg.style) {
      case 'inferno':
        grad.addColorStop(0, '#fff6a0')
        grad.addColorStop(0.5, '#ff9d00')
        grad.addColorStop(1, '#e8000f')
        glow = '#ff5a00'
        break
      case 'cyber':
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(1, '#8cf6ff')
        glow = '#00f0ff'
        break
      case 'arena':
        grad.addColorStop(0, '#fffbe0')
        grad.addColorStop(0.5, '#ffd23d')
        grad.addColorStop(1, '#b8740a')
        glow = '#ffd23d'
        break
      case 'storm':
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(1, '#8fc7ff')
        glow = '#7fc8ff'
        break
      case 'frost':
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(1, '#7fdcff')
        glow = '#9be8ff'
        break
      case 'toxic':
        grad.addColorStop(0, '#f4ffb0')
        grad.addColorStop(0.5, '#a6ff00')
        grad.addColorStop(1, '#1f8a00')
        glow = '#a6ff00'
        break
      case 'royal':
        grad.addColorStop(0, '#fff6c8')
        grad.addColorStop(0.5, '#ffd23d')
        grad.addColorStop(1, '#9a5b00')
        glow = '#b57bff'
        break
      case 'void':
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(1, '#c9a8ff')
        glow = '#7a3bff'
        break
      case 'sunset':
        grad.addColorStop(0, '#fff2a0')
        grad.addColorStop(0.5, '#ff9a3d')
        grad.addColorStop(1, '#d62bff')
        glow = '#ff4fa0'
        break
      default:
        grad.addColorStop(0, '#fff7a8')
        grad.addColorStop(0.55, '#ffd21f')
        grad.addColorStop(1, '#ff7b00')
        glow = '#ff4a1f'
    }
    if (cfg.style === 'cyber') {
      const j = 8 + Math.sin(t * 40) * 5
      ctx.fillStyle = 'rgba(255,43,214,0.9)'
      ctx.fillText('VS', -j, 4)
      ctx.fillStyle = 'rgba(0,240,255,0.9)'
      ctx.fillText('VS', j, -4)
    }
    ctx.shadowColor = glow
    ctx.shadowBlur = 60 + 20 * Math.sin(t * 8)
    ctx.lineWidth = px * 0.1
    ctx.strokeStyle = '#1a0612'
    ctx.strokeText('VS', 0, 0)
    ctx.shadowBlur = 0
    ctx.lineWidth = px * 0.035
    ctx.strokeStyle = '#ffffff'
    ctx.strokeText('VS', 0, 0)
    ctx.fillStyle = grad
    ctx.fillText('VS', 0, 0)
    // vệt sáng quét qua chữ
    ctx.save()
    ctx.globalCompositeOperation = 'source-atop'
    const sh = ((t * 0.7) % 1.6) - 0.3
    const sg = ctx.createLinearGradient(-px + sh * px * 2, -px, -px + sh * px * 2 + px * 0.5, px)
    sg.addColorStop(0, 'rgba(255,255,255,0)')
    sg.addColorStop(0.5, 'rgba(255,255,255,0.85)')
    sg.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = sg
    ctx.fillText('VS', 0, 0)
    ctx.restore()
    ctx.restore()
  }

  function shockwave(cx, cy, p, color, maxR = 900, lw = 24) {
    if (p <= 0 || p >= 1) return
    ctx.save()
    ctx.strokeStyle = color
    ctx.globalAlpha = (1 - p) * 0.9
    ctx.lineWidth = lw * (1 - p) + 2
    ctx.beginPath()
    ctx.arc(cx, cy, easeOutCubic(p) * maxR, 0, 6.283)
    ctx.stroke()
    ctx.restore()
  }

  // ---------- câu hỏi ----------
  function drawQuestion(t) {
    if (t < TL.questionAt) return
    const th = cfg.theme
    const k = t - TL.questionAt
    const text = cfg.question
    const shown = Math.min(text.length, Math.floor(k * 34))
    const out = t > TL.goAt - 0.1 ? clamp(1 - (t - (TL.goAt - 0.1)) / 0.2) : 1
    ctx.save()
    ctx.globalAlpha = out
    ctx.translate(W / 2, 150)
    const pulse = 1 + Math.sin(t * 7) * 0.012
    ctx.scale(pulse, pulse)
    ctx.font = fontOf(112)
    const full = ctx.measureText(text).width
    const w = Math.min(W - 120, full + 160)
    const sc = w < full + 160 ? w / (full + 160) : 1
    ctx.scale(sc, sc)
    const bw = full + 160
    const bandK = easeOutExpo(k / 0.35)
    ctx.fillStyle = 'rgba(8,6,20,0.78)'
    ctx.beginPath()
    ctx.moveTo(-bw / 2 * bandK - 40, -85)
    ctx.lineTo(bw / 2 * bandK + 40, -85)
    ctx.lineTo(bw / 2 * bandK, 85)
    ctx.lineTo(-bw / 2 * bandK, 85)
    ctx.closePath()
    ctx.fill()
    ctx.lineWidth = 6
    ctx.strokeStyle = th.accent
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const startX = -full / 2
    let x = startX
    for (let i = 0; i < shown; i++) {
      const ch = text[i]
      const age = k - i / 34
      const pop = easeOutBack(age / 0.18)
      const cw = ctx.measureText(ch).width
      ctx.save()
      ctx.translate(x + cw / 2, 6)
      ctx.scale(pop, pop)
      ctx.shadowColor = th.accent
      ctx.shadowBlur = 24
      const g = ctx.createLinearGradient(0, -56, 0, 56)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(1, th.accent)
      ctx.fillStyle = g
      ctx.textAlign = 'center'
      ctx.fillText(ch, 0, 0)
      ctx.restore()
      x += cw
    }
    ctx.restore()
    // phụ đề kêu gọi bình luận
    if (k > 1.1) {
      const a = easeOutCubic((k - 1.1) / 0.4) * out
      ctx.save()
      ctx.globalAlpha = a
      ctx.font = fontOf(46, 'Bebas')
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.shadowColor = 'rgba(0,0,0,0.9)'
      ctx.shadowBlur = 12
      ctx.fillText(cfg.subtitle, W / 2, 275 + (1 - a) * 20)
      ctx.restore()
    }
  }

  // ---------- đồng hồ đếm ngược ----------
  function drawCountdown(t) {
    if (t < TL.countAt || t >= TL.readyAt) return
    const idx = Math.floor(t - TL.countAt) // 0,1,2
    const n = 3 - idx
    const p = t - TL.countAt - idx
    const col = COUNT_COLORS[n - 1]
    const cx = W / 2
    const cy = 600
    const popIn = easeOutBack(p / 0.28)
    const fadeOut = p > 0.82 ? 1 - (p - 0.82) / 0.18 : 1
    switch (cfg.countdown) {
      case 'ring': {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.globalAlpha = fadeOut
        const R = 250
        ctx.fillStyle = 'rgba(6,4,18,0.78)'
        ctx.beginPath()
        ctx.arc(0, 0, R + 30, 0, 6.283)
        ctx.fill()
        ctx.lineWidth = 26
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'
        ctx.beginPath()
        ctx.arc(0, 0, R, 0, 6.283)
        ctx.stroke()
        ctx.shadowColor = col
        ctx.shadowBlur = 40
        ctx.strokeStyle = col
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(0, 0, R, -Math.PI / 2, -Math.PI / 2 + (1 - p) * Math.PI * 2)
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.lineWidth = 4
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        for (let i = 0; i < 60; i++) {
          const a = (i / 60) * 6.283
          const r0 = R + 44
          const r1 = r0 + (i % 5 === 0 ? 26 : 12)
          ctx.beginPath()
          ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0)
          ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1)
          ctx.stroke()
        }
        bigNumber(String(n), 0, 14, 380 * popIn, col)
        ctx.restore()
        shockwave(cx, cy, p / 0.6, col, 700, 16)
        break
      }
      case 'shock': {
        const shakeK = Math.max(0, 1 - p / 0.25)
        ctx.save()
        ctx.translate(cx + (Math.random() - 0.5) * 0, cy)
        ctx.globalAlpha = fadeOut
        ctx.translate(Math.sin(t * 90) * 14 * shakeK, Math.cos(t * 77) * 14 * shakeK)
        bigNumber(String(n), 0, 0, 560 * (0.8 + 0.2 * popIn) * (1 - 0.06 * p), col)
        ctx.restore()
        shockwave(cx, cy, p / 0.55, col, 1000, 34)
        shockwave(cx, cy, (p - 0.08) / 0.55, '#ffffff', 900, 12)
        break
      }
      case 'tile': {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.globalAlpha = fadeOut
        const flip = p < 0.3 ? Math.cos((1 - p / 0.3) * (Math.PI / 2)) : 1
        ctx.scale(Math.max(0.02, flip), 1)
        const S = 440
        const g = ctx.createLinearGradient(0, -S / 2, 0, S / 2)
        g.addColorStop(0, '#2a2f55')
        g.addColorStop(1, '#0b0c20')
        ctx.shadowColor = col
        ctx.shadowBlur = 60
        ctx.fillStyle = g
        roundRect(-S / 2, -S / 2, S, S, 60)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.lineWidth = 14
        ctx.strokeStyle = col
        roundRect(-S / 2, -S / 2, S, S, 60)
        ctx.stroke()
        ctx.lineWidth = 3
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'
        roundRect(-S / 2 + 22, -S / 2 + 22, S - 44, S - 44, 40)
        ctx.stroke()
        // đèn chạy quanh viền
        for (let i = 0; i < 16; i++) {
          const q = (i / 16 + p) % 1
          const per = S * 4
          let d = q * per
          let x
          let y
          if (d < S) { x = -S / 2 + d; y = -S / 2 } else if ((d -= S) < S) { x = S / 2; y = -S / 2 + d } else if ((d -= S) < S) { x = S / 2 - d; y = S / 2 } else { d -= S; x = -S / 2; y = S / 2 - d }
          ctx.fillStyle = i % 2 ? '#fff' : col
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, 6.283)
          ctx.fill()
        }
        bigNumber(String(n), 0, 18, 360 * popIn, col)
        ctx.restore()
        shockwave(cx, cy, p / 0.5, col, 650, 12)
        break
      }
      case 'stopwatch': {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.globalAlpha = fadeOut
        const R = 270
        const sc = 0.85 + 0.15 * popIn
        ctx.scale(sc, sc)
        ctx.fillStyle = '#c9ced8'
        roundRect(-34, -R - 74, 68, 56, 12)
        ctx.fill()
        roundRect(-60, -R - 88, 120, 26, 10)
        ctx.fill()
        const bg = ctx.createRadialGradient(-60, -80, 40, 0, 0, R + 40)
        bg.addColorStop(0, '#3a3f66')
        bg.addColorStop(1, '#0b0c20')
        ctx.shadowColor = col
        ctx.shadowBlur = 50
        ctx.fillStyle = bg
        ctx.beginPath()
        ctx.arc(0, 0, R + 26, 0, 6.283)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.lineWidth = 12
        ctx.strokeStyle = '#d9dde8'
        ctx.stroke()
        ctx.lineCap = 'round'
        for (let i = 0; i < 60; i++) {
          const a = (i / 60) * 6.283 - Math.PI / 2
          const big = i % 5 === 0
          const r0 = R - (big ? 38 : 22)
          ctx.lineWidth = big ? 7 : 3
          ctx.strokeStyle = i / 60 < p ? col : 'rgba(255,255,255,0.55)'
          ctx.beginPath()
          ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0)
          ctx.lineTo(Math.cos(a) * (R - 6), Math.sin(a) * (R - 6))
          ctx.stroke()
        }
        ctx.lineWidth = 20
        ctx.strokeStyle = hexA(col, 0.45)
        ctx.beginPath()
        ctx.arc(0, 0, R - 70, -Math.PI / 2, -Math.PI / 2 + p * 6.283)
        ctx.stroke()
        bigNumber(String(n), 0, 18, 330 * popIn, col)
        const ang = -Math.PI / 2 + p * 6.283
        ctx.strokeStyle = '#ff3b3b'
        ctx.lineWidth = 9
        ctx.shadowColor = '#ff3b3b'
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.moveTo(-Math.cos(ang) * 46, -Math.sin(ang) * 46)
        ctx.lineTo(Math.cos(ang) * (R - 12), Math.sin(ang) * (R - 12))
        ctx.stroke()
        ctx.fillStyle = '#ff3b3b'
        ctx.beginPath()
        ctx.arc(0, 0, 18, 0, 6.283)
        ctx.fill()
        ctx.restore()
        shockwave(cx, cy, p / 0.5, col, 650, 14)
        break
      }
      case 'radar': {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.globalAlpha = fadeOut
        const R = 290
        ctx.save()
        ctx.beginPath()
        ctx.arc(0, 0, R, 0, 6.283)
        ctx.clip()
        ctx.fillStyle = 'rgba(2,22,14,0.9)'
        ctx.fillRect(-R, -R, R * 2, R * 2)
        ctx.strokeStyle = 'rgba(80,255,170,0.35)'
        ctx.lineWidth = 3
        for (let k = 1; k <= 4; k++) {
          ctx.beginPath()
          ctx.arc(0, 0, (R * k) / 4, 0, 6.283)
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.moveTo(-R, 0)
        ctx.lineTo(R, 0)
        ctx.moveTo(0, -R)
        ctx.lineTo(0, R)
        ctx.stroke()
        const sweep = t * 4.2
        for (let i = 0; i < 26; i++) {
          ctx.fillStyle = hexA(col, (1 - i / 26) * 0.4)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.arc(0, 0, R, sweep - (i + 1) * 0.045, sweep - i * 0.045)
          ctx.closePath()
          ctx.fill()
        }
        for (let i = 0; i < 6; i++) {
          const a = hash(i + n * 7) * 6.283
          const d = 60 + hash(i + 40) * (R - 90)
          const diff = (((sweep - a) % 6.283) + 6.283) % 6.283
          ctx.fillStyle = hexA('#ffffff', Math.max(0, 1 - diff / 2.4))
          ctx.beginPath()
          ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 9, 0, 6.283)
          ctx.fill()
        }
        ctx.restore()
        ctx.lineWidth = 12
        ctx.strokeStyle = col
        ctx.shadowColor = col
        ctx.shadowBlur = 40
        ctx.beginPath()
        ctx.arc(0, 0, R, 0, 6.283)
        ctx.stroke()
        ctx.shadowBlur = 0
        bigNumber(String(n), 0, 14, 300 * popIn, col)
        ctx.restore()
        shockwave(cx, cy, p / 0.55, col, 700, 16)
        break
      }
      case 'digital': {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.globalAlpha = fadeOut
        const pw = 600
        const ph = 580
        const sc = 0.88 + 0.12 * popIn
        ctx.scale(sc, sc)
        ctx.fillStyle = '#07090f'
        ctx.shadowColor = col
        ctx.shadowBlur = 60
        roundRect(-pw / 2, -ph / 2, pw, ph, 40)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.lineWidth = 10
        ctx.strokeStyle = col
        ctx.stroke()
        ctx.font = fontOf(52, 'RussoOne')
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.fillText('T-MINUS', 0, -ph / 2 + 64)
        if (p < 0.14) {
          drawSegDigit(n, -14, -10, 330, '#ff2bd6')
          drawSegDigit(n, 14, -10, 330, '#00f0ff')
        }
        drawSegDigit(n, 0, -10, 330, col)
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        roundRect(-230, ph / 2 - 90, 460, 28, 14)
        ctx.fill()
        ctx.fillStyle = col
        ctx.shadowColor = col
        ctx.shadowBlur = 20
        roundRect(-230, ph / 2 - 90, Math.max(8, 460 * (1 - p)), 28, 14)
        ctx.fill()
        ctx.restore()
        shockwave(cx, cy, p / 0.5, col, 650, 12)
        break
      }
      case 'hex': {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.globalAlpha = fadeOut
        const hexPath = (r, rot) => {
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const a = rot + (i * Math.PI) / 3
            if (i) ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
            else ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
          }
          ctx.closePath()
        }
        ctx.fillStyle = 'rgba(6,4,18,0.82)'
        hexPath(280, t * 0.8)
        ctx.fill()
        ctx.lineWidth = 16
        ctx.strokeStyle = col
        ctx.shadowColor = col
        ctx.shadowBlur = 40
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.lineWidth = 4
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'
        hexPath(225, -t * 0.5)
        ctx.stroke()
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3 + t * 0.8
          const lit = p > i / 6
          ctx.save()
          ctx.translate(Math.cos(a) * 380, Math.sin(a) * 340)
          ctx.fillStyle = lit ? col : 'rgba(255,255,255,0.12)'
          ctx.shadowColor = lit ? col : 'transparent'
          ctx.shadowBlur = 30
          hexPath(36, 0)
          ctx.fill()
          ctx.restore()
        }
        bigNumber(String(n), 0, 16, 340 * popIn, col)
        ctx.restore()
        shockwave(cx, cy, p / 0.55, col, 700, 16)
        break
      }
      default: {
        // slice: số rơi xuống nảy + tia xuyên tâm + 3 chấm tiến độ
        ctx.save()
        ctx.translate(cx, cy)
        ctx.globalAlpha = fadeOut * 0.9
        for (let i = 0; i < 36; i++) {
          const a = (i / 36) * 6.283 + t * 0.6
          const l = 340 + hash(i + n * 9) * 380
          ctx.fillStyle = hexA(col, 0.18 + hash(i) * 0.25)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(a - 0.03) * l, Math.sin(a - 0.03) * l)
          ctx.lineTo(Math.cos(a + 0.03) * l, Math.sin(a + 0.03) * l)
          ctx.fill()
        }
        ctx.globalAlpha = fadeOut
        const drop = p < 0.35 ? -(1 - easeOutBounce(p / 0.35)) * 520 : 0
        bigNumber(String(n), 0, drop, 520, col)
        ctx.restore()
        for (let i = 0; i < 3; i++) {
          const on = i >= idx
          ctx.save()
          ctx.translate(cx + (i - 1) * 90, cy + 340)
          ctx.shadowColor = on ? COUNT_COLORS[2 - i] : 'transparent'
          ctx.shadowBlur = 30
          ctx.fillStyle = on ? COUNT_COLORS[2 - i] : 'rgba(255,255,255,0.18)'
          ctx.beginPath()
          ctx.arc(0, 0, 26 + (i === idx ? Math.sin(p * 20) * 3 : 0), 0, 6.283)
          ctx.fill()
          ctx.restore()
        }
        if (p < 0.35) shockwave(cx, cy + 90, p / 0.35, col, 800, 20)
      }
    }
  }

  function drawSegDigit(n, x, y, h, col) {
    const w = h * 0.56
    const th = h * 0.13
    const hw = w / 2
    const hh = h / 2
    const horiz = (cy2) => [-hw + th * 0.7, cy2 - th / 2, w - th * 1.4, th]
    const vert = (cx2, y0, y1) => [cx2 - th / 2, y0, th, y1 - y0]
    const seg = {
      a: horiz(-hh),
      d: horiz(hh),
      g: horiz(0),
      f: vert(-hw, -hh + th * 0.7, -th * 0.7),
      b: vert(hw, -hh + th * 0.7, -th * 0.7),
      e: vert(-hw, th * 0.7, hh - th * 0.7),
      c: vert(hw, th * 0.7, hh - th * 0.7),
    }
    const on = { 1: 'bc', 2: 'abged', 3: 'abgcd' }[n] ?? ''
    ctx.save()
    ctx.translate(x, y)
    for (const [k, r] of Object.entries(seg)) {
      const lit = on.includes(k)
      ctx.fillStyle = lit ? col : hexA(col, 0.08)
      ctx.shadowColor = lit ? col : 'transparent'
      ctx.shadowBlur = lit ? 36 : 0
      roundRect(r[0], r[1], r[2], r[3], th / 2.2)
      ctx.fill()
    }
    ctx.restore()
  }

  function easeOutBounce(x) {
    const n1 = 7.5625
    const d1 = 2.75
    if (x < 1 / d1) return n1 * x * x
    if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75
    if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  function bigNumber(text, x, y, px, col) {
    ctx.save()
    ctx.translate(x, y)
    ctx.font = fontOf(px, 'Anton')
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'
    ctx.shadowColor = col
    ctx.shadowBlur = 70
    ctx.lineWidth = px * 0.1
    ctx.strokeStyle = '#12061a'
    ctx.strokeText(text, 0, 0)
    ctx.shadowBlur = 0
    ctx.lineWidth = px * 0.03
    ctx.strokeStyle = '#fff'
    ctx.strokeText(text, 0, 0)
    const g = ctx.createLinearGradient(0, -px / 2, 0, px / 2)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.45, col)
    g.addColorStop(1, '#10061c')
    ctx.fillStyle = g
    ctx.fillText(text, 0, 0)
    ctx.restore()
  }

  // ---------- READY nhấp nháy + GO ----------
  function drawReady(t) {
    if (t < TL.readyAt || t >= TL.goAt) return
    const k = t - TL.readyAt
    const blink = Math.floor(k * 6) % 2 === 0
    // dải cảnh báo chạy
    ctx.save()
    ctx.translate(0, 590)
    const grow = easeOutExpo(k / 0.15)
    ctx.beginPath()
    ctx.rect(0, -150 * grow, W, 300 * grow)
    ctx.clip()
    ctx.fillStyle = blink ? 'rgba(255,40,60,0.88)' : 'rgba(20,6,26,0.9)'
    ctx.fillRect(0, -150, W, 300)
    ctx.fillStyle = blink ? 'rgba(0,0,0,0.25)' : 'rgba(255,210,61,0.25)'
    for (let i = -4; i < 40; i++) {
      const x = i * 90 + ((t * 300) % 90)
      ctx.beginPath()
      ctx.moveTo(x, -150)
      ctx.lineTo(x + 45, -150)
      ctx.lineTo(x - 35, 150)
      ctx.lineTo(x - 80, 150)
      ctx.fill()
    }
    ctx.restore()
    ctx.save()
    ctx.translate(W / 2, 600)
    const s = 1 + (blink ? 0.06 : 0)
    ctx.scale(s, s)
    ctx.globalAlpha = blink ? 1 : 0.6
    ctx.font = fontOf(Math.min(260, 3000 / Math.max(6, cfg.readyText.length) * 1.5), 'Anton')
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'
    ctx.shadowColor = blink ? '#ffe14d' : '#ff3b3b'
    ctx.shadowBlur = 50
    ctx.lineWidth = 22
    ctx.strokeStyle = '#12061a'
    ctx.strokeText(cfg.readyText, 0, 6)
    ctx.shadowBlur = 0
    ctx.fillStyle = blink ? '#fff6a8' : '#ffffff'
    ctx.fillText(cfg.readyText, 0, 6)
    ctx.restore()
  }

  function drawGo(t) {
    if (t < TL.goAt) return
    const k = t - TL.goAt
    const th = cfg.theme
    ctx.save()
    ctx.translate(W / 2, 560)
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * 6.283
      const l = 300 + easeOutCubic(k / 0.5) * 1400
      ctx.fillStyle = hexA(th.accent, 0.35 * (1 - clamp(k / 0.8)))
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(a - 0.02) * l, Math.sin(a - 0.02) * l)
      ctx.lineTo(Math.cos(a + 0.02) * l, Math.sin(a + 0.02) * l)
      ctx.fill()
    }
    ctx.restore()
    shockwave(W / 2, 560, k / 0.6, '#ffffff', 1500, 50)
    shockwave(W / 2, 560, (k - 0.1) / 0.6, th.accent, 1300, 30)
    const sc = lerp(0.3, 1, easeOutBack(k / 0.3)) * (1 + k * 0.25)
    const a = 1 - clamp((k - 0.55) / 0.2)
    ctx.save()
    ctx.translate(W / 2 + Math.sin(t * 100) * 10 * Math.max(0, 1 - k / 0.3), 560)
    ctx.scale(sc, sc)
    ctx.globalAlpha = a
    ctx.font = fontOf(320, 'Anton')
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'
    ctx.shadowColor = th.accent
    ctx.shadowBlur = 90
    ctx.lineWidth = 34
    ctx.strokeStyle = '#12061a'
    ctx.strokeText(cfg.goText, 0, 0)
    ctx.shadowBlur = 0
    ctx.lineWidth = 10
    ctx.strokeStyle = '#fff'
    ctx.strokeText(cfg.goText, 0, 0)
    const g = ctx.createLinearGradient(0, -160, 0, 160)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.5, th.accent)
    g.addColorStop(1, '#ff3b00')
    ctx.fillStyle = g
    ctx.fillText(cfg.goText, 0, 0)
    ctx.restore()
    // chớp trắng rồi mờ dần chuyển vào trận
    if (k < 0.18) {
      ctx.fillStyle = `rgba(255,255,255,${0.9 * (1 - k / 0.18)})`
      ctx.fillRect(0, 0, W, H)
    }
    const fade = clamp((t - (TL.end - 0.35)) / 0.35)
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade})`
      ctx.fillRect(0, 0, W, H)
    }
  }

  function vignette() {
    const g = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1150)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, 'rgba(0,0,0,0.65)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, W, 0)
  }

  function renderIntroFrame(t) {
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.clearRect(0, 0, W, H)
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0

    // rung màn hình ở các nhịp va đập
    const hits = [TL.vsAt, TL.countAt, TL.countAt + 1, TL.countAt + 2, TL.goAt]
    let shake = 0
    for (const h of hits) {
      const d = t - h
      if (d >= 0 && d < 0.35) shake = Math.max(shake, (1 - d / 0.35) * (h === TL.goAt ? 28 : 16))
    }
    ctx.save()
    if (shake) ctx.translate(Math.sin(t * 130) * shake, Math.cos(t * 111) * shake)

    drawBackground(t)
    drawSides(t, shake)

    // VS: đập xuống rồi thu nhỏ lên trên khi bắt đầu đếm ngược
    if (t >= TL.vsAt) {
      const k = t - TL.vsAt
      const slam = k < 0.35 ? lerp(4.2, 1, easeOutCubic(k / 0.35)) : 1 + Math.sin(t * 6) * 0.025
      const alpha = clamp(k / 0.12)
      const moveK = easeInOut(clamp((t - (TL.countAt - 0.4)) / 0.5))
      const size = lerp(430, 150, moveK) * slam
      const cy = lerp(560, 330, moveK)
      const rot = lerp(-0.08, 0, moveK) + (k < 0.35 ? (1 - k / 0.35) * 0.25 : 0)
      const out = 1 - clamp((t - (TL.countAt - 0.3)) / 0.35)
      shockwave(W / 2, 560, k / 0.7, '#ffffff', 1300, 40)
      shockwave(W / 2, 560, (k - 0.1) / 0.7, cfg.theme.accent, 1100, 24)
      drawVS(t, W / 2, cy, size, alpha * out, rot)
    }

    drawQuestion(t)
    drawCountdown(t)
    drawReady(t)
    ctx.restore()
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    vignette()
    // chớp trắng khi VS va xuống
    if (t >= TL.vsAt && t < TL.vsAt + 0.15) {
      ctx.fillStyle = `rgba(255,255,255,${0.8 * (1 - (t - TL.vsAt) / 0.15)})`
      ctx.fillRect(0, 0, W, H)
    }
    drawGo(t)
    // vào cảnh: mờ từ đen
    if (t < 0.25) {
      ctx.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`
      ctx.fillRect(0, 0, W, H)
    }
    return canvas.toDataURL('image/jpeg', 0.92).split(',')[1]
  }

  // ---------- âm thanh ----------
  function makeAudioKit(seconds) {
    const sr = 48000
    const dur = seconds + 0.6
    const oc = new OfflineAudioContext(2, Math.ceil(sr * dur), sr)
    const master = oc.createGain()
    master.gain.value = 0.9
    const comp = oc.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 6
    comp.attack.value = 0.003
    comp.release.value = 0.2
    master.connect(comp)
    comp.connect(oc.destination)

    const nbuf = oc.createBuffer(1, sr * 3, sr)
    const nd = nbuf.getChannelData(0)
    const rnd = mulberry(cfg.seed ^ 0x9e3779b9)
    for (let i = 0; i < nd.length; i++) nd[i] = rnd() * 2 - 1

    const env = (g, t0, a, d, peak, sustain = 0) => {
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.linearRampToValueAtTime(peak, t0 + a)
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, sustain || 0.0001), t0 + a + d)
    }
    const noise = (t0, d, vol, type, f0, f1, q = 1, attack = 0.005) => {
      const s = oc.createBufferSource()
      s.buffer = nbuf
      s.loop = true
      const f = oc.createBiquadFilter()
      f.type = type
      f.Q.value = q
      f.frequency.setValueAtTime(f0, t0)
      f.frequency.exponentialRampToValueAtTime(f1, t0 + d)
      const g = oc.createGain()
      env(g, t0, attack, d - attack, vol)
      s.connect(f).connect(g).connect(master)
      s.start(t0)
      s.stop(t0 + d + 0.05)
    }
    const tone = (t0, d, f0, f1, type, vol, attack = 0.005, lp = 0) => {
      const o = oc.createOscillator()
      o.type = type
      o.frequency.setValueAtTime(f0, t0)
      o.frequency.exponentialRampToValueAtTime(f1, t0 + d)
      const g = oc.createGain()
      env(g, t0, attack, d - attack, vol)
      let node = o
      if (lp) {
        const f = oc.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.value = lp
        o.connect(f)
        node = f
      }
      node.connect(g).connect(master)
      o.start(t0)
      o.stop(t0 + d + 0.05)
    }
    const kick = (t0, vol = 1, len = 0.45) => {
      tone(t0, len, 160, 38, 'sine', vol, 0.002)
      noise(t0, 0.05, vol * 0.35, 'highpass', 2500, 2500)
    }
    const snare = (t0, vol = 0.6) => {
      noise(t0, 0.22, vol, 'bandpass', 1800, 1200, 0.7)
      tone(t0, 0.12, 220, 140, 'triangle', vol * 0.5)
    }
    const hat = (t0, vol = 0.18) => noise(t0, 0.05, vol, 'highpass', 8000, 8000)
    const brass = (t0, d, freqs, vol = 0.22) => {
      for (const f of freqs) {
        tone(t0, d, f * 0.97, f, 'sawtooth', vol, 0.03, 2400)
        tone(t0, d, f * 1.005, f * 1.005, 'sawtooth', vol * 0.7, 0.03, 2000)
      }
    }
    const crash = (t0, d, vol = 0.5) => {
      noise(t0, d, vol, 'highpass', 5000, 3000)
      noise(t0, d * 0.7, vol * 0.5, 'bandpass', 9000, 6000, 0.5)
    }
    const boom = (t0, vol = 1) => {
      kick(t0, vol, 1.3)
      tone(t0, 1.4, 60, 30, 'sine', vol * 0.9, 0.003)
      noise(t0, 1.2, vol * 0.8, 'lowpass', 3500, 120, 0.8)
      crash(t0, 1.4, vol * 0.45)
    }
    const whoosh = (t0, d, vol = 0.5, up = true) => {
      noise(t0, d, vol, 'bandpass', up ? 250 : 5000, up ? 6500 : 250, 2.5, d * 0.7)
    }

    return { oc, master, sr, env, noise, tone, kick, snare, hat, brass, crash, boom, whoosh }
  }

  async function renderIntroAudio() {
    const kit = makeAudioKit(TL.end)
    const { master, tone, noise, kick, snare, hat, brass, crash, boom, whoosh } = kit
    // trống trận suốt phần mở màn (120 bpm)
    for (let b = 0; b < Math.floor(TL.goAt / 0.5); b++) {
      const t0 = b * 0.5
      if (t0 < 0.4) continue
      kick(t0, b % 2 ? 0.55 : 0.8, 0.3)
      if (t0 >= TL.questionAt && b % 2 === 1) snare(t0, 0.45)
      if (t0 >= TL.questionAt) hat(t0 + 0.25, 0.14)
      if (t0 >= TL.countAt - 0.3) hat(t0, 0.12)
    }
    // riser + va đập VS
    whoosh(0, TL.vsAt, 0.7, true)
    tone(0, TL.vsAt, 70, 900, 'sawtooth', 0.12, TL.vsAt * 0.8, 1800)
    boom(TL.vsAt, 1)
    brass(TL.vsAt, 1.2, [82.4, 123.5, 164.8, 246.9], 0.2)
    for (const [f, d] of [[420, 0.9], [668, 0.7], [1130, 0.6]]) tone(TL.vsAt, d, f, f * 0.99, 'square', 0.05, 0.002)
    // pad đe dọa
    for (const f of [55, 82.4]) tone(TL.vsAt, TL.readyAt - TL.vsAt, f, f * 1.12, 'sawtooth', 0.09, 1.2, 500)
    // câu hỏi
    whoosh(TL.questionAt - 0.1, 0.5, 0.35, true)
    for (let i = 0; i < Math.min(cfg.question.length, 24); i++) tone(TL.questionAt + i / 34, 0.05, 1800 + (i % 3) * 200, 1500, 'square', 0.025, 0.001)
    brass(TL.questionAt, 0.8, [110, 164.8], 0.12)
    // đếm ngược 3 - 2 - 1
    const notes = [[110, 164.8, 220], [130.8, 196, 261.6], [164.8, 246.9, 329.6]]
    for (let i = 0; i < 3; i++) {
      const t0 = TL.countAt + i
      boom(t0, 0.8 + i * 0.1)
      brass(t0, 0.7, notes[i], 0.2)
      tone(t0 + 0.5, 0.45, 600 + i * 250, 1500 + i * 500, 'sawtooth', 0.05, 0.3, 3000)
      snare(t0 + 0.5, 0.5)
      snare(t0 + 0.75, 0.5)
    }
    // READY nhấp nháy
    whoosh(TL.readyAt, TL.goAt - TL.readyAt, 0.6, true)
    for (let i = 0; i < 6; i++) {
      const t0 = TL.readyAt + i / 6
      tone(t0, 0.09, i % 2 ? 1100 : 880, i % 2 ? 1100 : 880, 'square', 0.12, 0.003)
      kick(t0, 0.5, 0.2)
      snare(t0 + 1 / 12, 0.3)
    }
    // GO
    boom(TL.goAt, 1.2)
    crash(TL.goAt, 1.6, 0.8)
    brass(TL.goAt, 1.1, [110, 164.8, 220, 329.6, 440], 0.22)
    tone(TL.goAt, 0.9, 200, 1600, 'sawtooth', 0.08, 0.01, 4000)
    // fade cuối
    master.gain.setValueAtTime(0.9, TL.end - 0.35)
    master.gain.linearRampToValueAtTime(0, TL.end)

    return finishAudio(kit, TL.end)
  }

  async function finishAudio(kit, seconds) {
    const { oc, sr } = kit
    const buf = await oc.startRendering()
    const frames = Math.ceil(seconds * sr)
    const L = buf.getChannelData(0)
    const R = buf.getChannelData(1)
    const bytes = new Uint8Array(44 + frames * 4)
    const dv = new DataView(bytes.buffer)
    const wr = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)))
    wr(0, 'RIFF')
    dv.setUint32(4, 36 + frames * 4, true)
    wr(8, 'WAVEfmt ')
    dv.setUint32(16, 16, true)
    dv.setUint16(20, 1, true)
    dv.setUint16(22, 2, true)
    dv.setUint32(24, sr, true)
    dv.setUint32(28, sr * 4, true)
    dv.setUint16(32, 4, true)
    dv.setUint16(34, 16, true)
    wr(36, 'data')
    dv.setUint32(40, frames * 4, true)
    for (let i = 0; i < frames; i++) {
      dv.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true)
      dv.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true)
    }
    let bin = ''
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
    return btoa(bin)
  }

  const renderFrame = (t) => (mode === 'outro' ? window.IntroOutro.frame(t) : renderIntroFrame(t))
  const renderAudio = () => (mode === 'outro' ? window.IntroOutro.audio() : renderIntroAudio())

  window.IntroKit = {
    W,
    H,
    clamp,
    lerp,
    easeOutCubic,
    easeOutExpo,
    easeOutBack,
    easeInOut,
    easeOutBounce,
    hash,
    mulberry,
    hexA,
    fontOf,
    drawBackground,
    drawFit,
    groundShadow,
    shockwave,
    bigNumber,
    roundRect,
    vignette,
    drawBolt,
    makeAudioKit,
    finishAudio,
    jpeg: () => canvas.toDataURL('image/jpeg', 0.92).split(',')[1],
    get ctx() {
      return ctx
    },
    get cfg() {
      return cfg
    },
    get imgs() {
      return imgs
    },
    get scale() {
      return scale
    },
  }
  window.Intro = { init, renderFrame, renderAudio }
})()
