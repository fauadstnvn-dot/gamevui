// Cảnh kết thúc: công bố bên thắng + câu trả lời tương ứng với câu hỏi mở màn, thống kê trận đấu, kêu gọi đăng ký kênh.
// Chạy trong Chromium sau intro-page.js (dùng window.IntroKit). Mọi thứ phụ thuộc thời gian t, không ngẫu nhiên.
(() => {
  const K = window.IntroKit
  const { W, H, clamp, lerp, easeOutCubic, easeOutExpo, easeOutBack, easeInOut, easeOutBounce, hash, hexA, fontOf, drawFit, groundShadow, shockwave, roundRect, vignette } = K

  const TL = { statsAt: 5.6, ctaAt: 10.4, end: 15.2 }
  const CLICK = 2.3 // thời điểm bấm nút đăng ký, tính từ đầu đoạn CTA
  const CENTERED = new Set(['trophy', 'crown', 'fireworks', 'suspense'])
  const BASEX = { mount: 470, boss: 1450 }
  const CHAR_Y = 890
  const revealOf = (o) => (o.kind === 'suspense' ? 2.8 : 0.6)

  let ctx = null
  let cfg = null
  let imgs = null
  const bind = () => {
    ctx = K.ctx
    cfg = K.cfg
    imgs = K.imgs
  }

  // ---------- thời điểm dùng chung giữa hình và tiếng ----------
  function suspenseSteps(o) {
    const steps = []
    let t = 0.15
    let d = 0.14
    while (t < 2.7) {
      steps.push({ t, side: steps.length % 2 ? 'boss' : 'mount' })
      t += d
      d *= 1.2
    }
    if (o.winner !== 'draw' && steps.length && steps.at(-1).side !== o.winner) steps.forEach((s) => (s.side = s.side === 'mount' ? 'boss' : 'mount'))
    return steps
  }
  const fireworkTimes = () => Array.from({ length: 10 }, (_, i) => 0.4 + i * 0.42)
  function countStart(o, i) {
    const n = o.stats.length
    switch (o.statsKind) {
      case 'ticker':
        return 0.7 + i * 0.3
      case 'billboard':
        return 0.8 + (i * (TL.ctaAt - TL.statsAt - 1.0)) / n
      default:
        return 0.75 + i * 0.25
    }
  }

  // ---------- tiện ích vẽ ----------
  function ftext(str, x, y, px, o = {}) {
    ctx.save()
    ctx.translate(x, y)
    if (o.rot) ctx.rotate(o.rot)
    ctx.font = fontOf(px, o.family ?? 'Anton')
    ctx.textAlign = o.align ?? 'center'
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'
    ctx.globalAlpha *= o.alpha ?? 1
    let s = 1
    if (o.maxW) {
      const w = ctx.measureText(str).width
      if (w > o.maxW) s = o.maxW / w
    }
    ctx.scale(s * (o.sx ?? 1), s * (o.sy ?? 1))
    if (o.glow) {
      ctx.shadowColor = o.glow
      ctx.shadowBlur = o.glowBlur ?? 40
    }
    if (o.stroke) {
      ctx.lineWidth = o.sw ?? px * 0.1
      ctx.strokeStyle = o.stroke
      ctx.strokeText(str, 0, 0)
      ctx.shadowBlur = 0
    }
    if (o.grad) {
      const g = ctx.createLinearGradient(0, -px / 2, 0, px / 2)
      g.addColorStop(0, o.grad[0])
      g.addColorStop(1, o.grad[1])
      ctx.fillStyle = g
    } else ctx.fillStyle = o.fill ?? '#fff'
    ctx.fillText(str, 0, 0)
    ctx.restore()
  }

  function band(cy, halfH, color, k, alpha = 0.8) {
    const half = (W / 2 - 60) * easeOutExpo(k)
    ctx.save()
    ctx.fillStyle = `rgba(8,6,20,${alpha})`
    ctx.beginPath()
    ctx.moveTo(W / 2 - half - 40, cy - halfH)
    ctx.lineTo(W / 2 + half + 40, cy - halfH)
    ctx.lineTo(W / 2 + half, cy + halfH)
    ctx.lineTo(W / 2 - half, cy + halfH)
    ctx.closePath()
    ctx.fill()
    ctx.lineWidth = 6
    ctx.strokeStyle = color
    ctx.stroke()
    ctx.restore()
  }

  function star4(x, y, r, rot, color, a) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha *= a
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 20
    ctx.beginPath()
    for (let i = 0; i < 8; i++) {
      const rr = i % 2 ? r * 0.28 : r
      const an = (i * Math.PI) / 4
      ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  function tag(text, cx, y, color, a) {
    ctx.save()
    ctx.globalAlpha *= a
    ctx.font = fontOf(44)
    const w = Math.min(760, ctx.measureText(text).width + 90)
    ctx.translate(cx, y)
    ctx.transform(1, 0, -0.2, 1, 0, 0)
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0)
    g.addColorStop(0, hexA(color, 0.95))
    g.addColorStop(1, hexA(color, 0.55))
    ctx.fillStyle = g
    ctx.fillRect(-w / 2, -40, w, 74)
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillRect(-w / 2, -40, w, 4)
    ctx.restore()
    ftext(text, cx, y, 44, { maxW: w - 70, glow: 'rgba(0,0,0,0.7)', glowBlur: 8, alpha: a })
  }

  function rays(cx, cy, t, color, a) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(t * 0.25)
    for (let i = 0; i < 18; i++) {
      const a0 = (i / 18) * 6.283
      const a1 = a0 + 0.17
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1300)
      g.addColorStop(0, hexA(color, 0.32 * a))
      g.addColorStop(1, hexA(color, 0))
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(a0) * 1500, Math.sin(a0) * 1500)
      ctx.lineTo(Math.cos(a1) * 1500, Math.sin(a1) * 1500)
      ctx.fill()
    }
    ctx.restore()
  }

  function confetti(t0, t, count) {
    const age = t - t0
    if (age < 0) return
    const pal = [cfg.theme.colA, cfg.theme.colB, cfg.theme.accent, '#ffffff', '#ffd23d']
    for (let i = 0; i < count; i++) {
      const x = hash(i + 1) * W + Math.sin(age * 2 + i) * 60
      const y = ((age * (260 + hash(i + 9) * 420) + hash(i + 3) * (H + 80)) % (H + 80)) - 40
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(age * (2 + hash(i + 5) * 4) + i)
      ctx.scale(1, Math.cos(age * 6 + i))
      ctx.globalAlpha = clamp(age / 0.3) * 0.95
      ctx.fillStyle = pal[i % pal.length]
      ctx.fillRect(-7, -11, 14, 22)
      ctx.restore()
    }
  }

  function fireworks(t) {
    const pal = [cfg.theme.colA, cfg.theme.colB, cfg.theme.accent, '#ffd23d', '#ffffff']
    fireworkTimes().forEach((t0, i) => {
      const age = t - t0
      if (age < 0) return
      const cx = 220 + hash(i * 3 + 1) * (W - 440)
      const cy = 200 + hash(i * 3 + 2) * 340
      const color = pal[i % pal.length]
      ctx.save()
      if (age < 0.45) {
        const y = lerp(H, cy, easeOutCubic(age / 0.45))
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(cx, y)
        ctx.lineTo(cx, y + 60)
        ctx.stroke()
      } else {
        const dt = age - 0.45
        if (dt < 1.4) {
          const fade = 1 - dt / 1.4
          ctx.shadowColor = color
          ctx.shadowBlur = 18
          for (let j = 0; j < 44; j++) {
            const a = (j / 44) * 6.283
            const sp = 240 + hash(i * 50 + j) * 160
            const d = easeOutCubic(dt / 1.4) * sp * 1.4
            const px = cx + Math.cos(a) * d
            const py = cy + Math.sin(a) * d + 180 * dt * dt
            ctx.strokeStyle = hexA(j % 3 ? color : '#ffffff', fade)
            ctx.lineWidth = 10 * fade + 2
            ctx.beginPath()
            ctx.moveTo(px, py)
            ctx.lineTo(px - Math.cos(a) * 48 * fade, py - Math.sin(a) * 48 * fade)
            ctx.stroke()
          }
        }
      }
      ctx.restore()
    })
  }

  const goldGrad = (x0, y0, x1, y1) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1)
    g.addColorStop(0, '#fff2a8')
    g.addColorStop(0.5, '#ffc400')
    g.addColorStop(1, '#b87700')
    return g
  }

  function trophy(cx, by, h, a) {
    const s = h / 100
    ctx.save()
    ctx.globalAlpha *= a
    ctx.translate(cx, by)
    ctx.scale(s, s)
    ctx.shadowColor = '#ffd23d'
    ctx.shadowBlur = 40
    ctx.fillStyle = goldGrad(-34, 0, 34, 0)
    ctx.strokeStyle = '#ffc400'
    ctx.lineWidth = 7
    ctx.beginPath()
    ctx.arc(-38, -72, 17, Math.PI * 0.5, Math.PI * 1.5)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(38, -72, 17, -Math.PI * 0.5, Math.PI * 0.5)
    ctx.stroke()
    ctx.fillRect(-30, -12, 60, 12)
    ctx.fillRect(-7, -34, 14, 24)
    ctx.fillRect(-20, -40, 40, 8)
    ctx.beginPath()
    ctx.moveTo(-34, -96)
    ctx.lineTo(34, -96)
    ctx.bezierCurveTo(34, -60, 20, -40, 0, -40)
    ctx.bezierCurveTo(-20, -40, -34, -60, -34, -96)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.fillRect(-24, -90, 8, 38)
    star4(0, -70, 14, 0, '#fff7c8', 1)
    ctx.restore()
  }

  function crown(cx, cy, w, a) {
    const s = w / 140
    ctx.save()
    ctx.globalAlpha *= a
    ctx.translate(cx, cy)
    ctx.scale(s, s)
    ctx.shadowColor = '#ffd23d'
    ctx.shadowBlur = 40
    ctx.fillStyle = goldGrad(0, -95, 0, 0)
    ctx.beginPath()
    ctx.moveTo(-60, 0)
    ctx.lineTo(-70, -70)
    ctx.lineTo(-30, -35)
    ctx.lineTo(0, -95)
    ctx.lineTo(30, -35)
    ctx.lineTo(70, -70)
    ctx.lineTo(60, 0)
    ctx.closePath()
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.fillStyle = '#b87700'
    ctx.fillRect(-60, -18, 120, 18)
    for (const [x, y, c] of [[-70, -70, '#ff3b5c'], [0, -95, '#3be0ff'], [70, -70, '#ff3b5c']]) {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, 6.283)
      ctx.fill()
    }
    ctx.fillStyle = '#3be0ff'
    for (const x of [-30, 0, 30]) {
      ctx.beginPath()
      ctx.arc(x, -9, 5, 0, 6.283)
      ctx.fill()
    }
    ctx.restore()
  }

  function heart(cx, cy, s) {
    ctx.beginPath()
    ctx.moveTo(cx, cy + s * 0.45)
    ctx.bezierCurveTo(cx - s, cy - s * 0.1, cx - s * 0.5, cy - s * 0.8, cx, cy - s * 0.3)
    ctx.bezierCurveTo(cx + s * 0.5, cy - s * 0.8, cx + s, cy - s * 0.1, cx, cy + s * 0.45)
    ctx.fill()
  }

  function bubble(cx, cy, s) {
    roundRect(cx - s * 0.8, cy - s * 0.55, s * 1.6, s * 1.05, s * 0.28)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx - s * 0.35, cy + s * 0.4)
    ctx.lineTo(cx - s * 0.6, cy + s * 0.85)
    ctx.lineTo(cx + s * 0.05, cy + s * 0.45)
    ctx.fill()
  }

  function shareArrow(cx, cy, s) {
    ctx.beginPath()
    const p = [[-0.7, 0.25], [-0.05, 0.25], [-0.05, 0.62], [0.78, 0], [-0.05, -0.62], [-0.05, -0.25], [-0.7, -0.25]]
    p.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * s, cy + y * s) : ctx.moveTo(cx + x * s, cy + y * s)))
    ctx.closePath()
    ctx.fill()
  }

  function bell(cx, cy, s, swing) {
    ctx.save()
    ctx.translate(cx, cy - s * 0.8)
    ctx.rotate(swing)
    ctx.translate(0, s * 0.8)
    ctx.beginPath()
    ctx.moveTo(-s * 0.62, s * 0.4)
    ctx.bezierCurveTo(-s * 0.5, s * 0.25, -s * 0.5, -s * 0.1, -s * 0.42, -s * 0.35)
    ctx.bezierCurveTo(-s * 0.3, -s * 0.75, s * 0.3, -s * 0.75, s * 0.42, -s * 0.35)
    ctx.bezierCurveTo(s * 0.5, -s * 0.1, s * 0.5, s * 0.25, s * 0.62, s * 0.4)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.arc(0, s * 0.55, s * 0.13, 0, 6.283)
    ctx.arc(0, -s * 0.8, s * 0.1, 0, 6.283)
    ctx.fill()
    ctx.restore()
  }

  function playLogo(cx, cy, w, sx = 1) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(sx, 1)
    ctx.shadowColor = '#ff1f3d'
    ctx.shadowBlur = 40
    ctx.fillStyle = '#ff1f3d'
    roundRect(-w / 2, -w * 0.35, w, w * 0.7, w * 0.2)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo(-w * 0.12, -w * 0.18)
    ctx.lineTo(w * 0.2, 0)
    ctx.lineTo(-w * 0.12, w * 0.18)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  function cursor(x, y, s) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(s, s)
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 12
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (const [i, [px, py]] of [[0, 0], [0, 56], [14, 43], [25, 66], [36, 61], [26, 39], [44, 39]].entries()) i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  // ---------- nhân vật ----------
  function sideState(side, t, o) {
    const rv = revealOf(o)
    const k = easeInOut(clamp((t - rv) / 0.7))
    const w = o.winner
    const centered = CENTERED.has(o.kind) && w !== 'draw'
    const st = { x: BASEX[side], y: 0, sc: 1, a: 1, gray: 0, rot: 0 }
    st.x += (side === 'mount' ? -1 : 1) * (1 - easeOutCubic(t / 0.7)) * 900
    if (w === 'draw' || t < rv) return st
    if (w === side) {
      if (centered) {
        st.x = lerp(st.x, 960, k)
        st.sc = lerp(1, o.kind === 'crown' ? 0.82 : 0.98, k)
      } else st.sc = lerp(1, 1.12, k)
      st.y = -Math.sin(k * Math.PI) * 30
    } else {
      st.gray = k
      if (centered) {
        st.x += (side === 'mount' ? -1 : 1) * 320 * k
        st.a = 1 - k
        st.sc = lerp(1, 0.8, k)
      } else {
        st.sc = lerp(1, 0.88, k)
        st.a = lerp(1, 0.75, k)
        if (o.kind === 'ko') {
          st.rot = (side === 'mount' ? -1 : 1) * 0.38 * k
          st.y = 70 * k
        }
      }
    }
    return st
  }

  function drawSide(side, st, t) {
    const th = cfg.theme
    ctx.save()
    ctx.globalAlpha = st.a
    if (st.gray) ctx.filter = `grayscale(${st.gray}) brightness(${1 - 0.4 * st.gray})`
    const bob = Math.sin(t * 3.2 + (side === 'boss' ? 1.6 : 0)) * 8
    groundShadow(st.x, CHAR_Y + 8, side === 'mount' ? 330 : 380)
    ctx.translate(st.x, CHAR_Y + st.y + bob)
    ctx.rotate(st.rot)
    ctx.scale(st.sc, st.sc)
    if (side === 'mount') drawFit(imgs.mount, 0, 0, 760, 650, { glow: st.gray ? '#000' : th.colA, blur: 46 })
    else {
      drawFit(imgs.boss, 0, 0, 800, 690, { glow: st.gray ? '#000' : th.colB, blur: 46 })
      imgs.monsters.slice(0, 3).forEach((im, i) => drawFit(im, -330 + i * 260, 20 + Math.sin(t * 4 + i * 2) * 6, 230, 230, { glow: th.colB, blur: 24 }))
    }
    ctx.restore()
  }

  // ---------- giai đoạn 1: công bố bên thắng ----------
  function drawAnswer(t, rv, o) {
    const th = cfg.theme
    const k = t - rv - 0.2
    if (k < 0) return
    const col = o.winner === 'mount' ? th.colA : o.winner === 'boss' ? th.colB : th.accent
    const out = 1 - clamp((t - (TL.statsAt - 0.5)) / 0.35)
    ctx.save()
    ctx.globalAlpha = out
    band(150, 110, col, k / 0.3)
    ftext(o.question, W / 2, 84, 46, { family: 'Bebas', fill: 'rgba(255,255,255,0.85)', maxW: 1500, alpha: clamp((k - 0.25) / 0.2) })
    const text = o.answer
    const shown = Math.min(text.length, Math.floor((k - 0.1) * 36))
    ctx.font = fontOf(112, 'Anton')
    const full = ctx.measureText(text).width
    const s = Math.min(1, 1620 / full)
    ctx.save()
    ctx.translate(W / 2, 168)
    ctx.scale(s * (1 + Math.sin(t * 7) * 0.01), s * (1 + Math.sin(t * 7) * 0.01))
    let x = -full / 2
    for (let i = 0; i < shown; i++) {
      const ch = text[i]
      const cw = ctx.measureText(ch).width
      const pop = easeOutBack((k - 0.1 - i / 36) / 0.18)
      ctx.save()
      ctx.translate(x + cw / 2, 0)
      ctx.scale(pop, pop)
      ctx.shadowColor = col
      ctx.shadowBlur = 28
      const g = ctx.createLinearGradient(0, -56, 0, 56)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(1, col)
      ctx.fillStyle = g
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(ch, 0, 0)
      ctx.restore()
      x += cw
    }
    ctx.restore()
    ctx.restore()
  }

  function drawVerdict(t) {
    const th = cfg.theme
    const o = cfg.outro
    const rv = revealOf(o)
    const rt = t - rv
    const w = o.winner
    const centered = CENTERED.has(o.kind) && w !== 'draw'
    const states = { mount: sideState('mount', t, o), boss: sideState('boss', t, o) }

    if (rt > 0 && centered && o.kind !== 'fireworks') rays(960, 600, t, th.accent, easeOutCubic(rt / 0.6))
    if (o.kind === 'fireworks') fireworks(t)
    if (o.kind === 'ko' && rt > 0) {
      ctx.save()
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * 6.283
        const flick = 0.15 + 0.3 * hash(i + Math.floor(t * 16))
        ctx.strokeStyle = `rgba(255,255,255,${flick * (1 - clamp(rt / 2.2))})`
        ctx.lineWidth = 4 + hash(i) * 7
        ctx.beginPath()
        ctx.moveTo(960 + Math.cos(a) * 280, 560 + Math.sin(a) * 280)
        ctx.lineTo(960 + Math.cos(a) * 1500, 560 + Math.sin(a) * 1500)
        ctx.stroke()
      }
      ctx.restore()
    }

    const order = w === 'mount' ? ['boss', 'mount'] : ['mount', 'boss']
    for (const side of order) drawSide(side, states[side], t)

    for (const side of ['mount', 'boss']) {
      const st = states[side]
      const isW = w === side && rt > 0
      const label = side === 'mount' ? cfg.labels.left : cfg.labels.right
      tag(label, st.x, 985, isW ? '#d99a00' : side === 'mount' ? th.colA : th.colB, st.a * easeOutCubic(t / 0.7))
    }

    if (rt > 0) {
      switch (o.kind) {
        case 'trophy': {
          const drop = easeOutBounce(clamp((rt - 0.3) / 0.9))
          for (const sx of [-1, 1]) trophy(960 + sx * 640, lerp(-300, 900, drop), 360, 1)
          confetti(rv, t, 110)
          break
        }
        case 'crown': {
          const drop = easeOutBounce(clamp((rt - 0.3) / 1.0))
          const st = states[w]
          const im = w === 'mount' ? imgs.mount : imgs.boss
          const box = w === 'mount' ? [760, 650] : [800, 690]
          const fh = im ? im.height * Math.min(box[0] / im.width, box[1] / im.height) : 600
          crown(st.x, lerp(-200, CHAR_Y + st.y - fh * st.sc + 50, drop), 230, 1)
          for (let i = 0; i < 14; i++) {
            const a = (i / 14) * 6.283 + t * 0.6
            star4(960 + Math.cos(a) * (360 + (i % 3) * 90), 560 + Math.sin(a) * (300 + (i % 2) * 70), 14 + (i % 4) * 7, t * 2 + i, '#fff3b0', 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i)))
          }
          break
        }
        case 'ko': {
          const k = clamp(rt / 0.3)
          const sc = lerp(3.2, 1, easeOutExpo(k)) * (1 + Math.sin(t * 9) * 0.02)
          const shake = Math.max(0, 1 - rt / 0.5) * 18
          ctx.save()
          ctx.translate(960 + Math.sin(t * 120) * shake, 560 + Math.cos(t * 100) * shake)
          ctx.rotate(-0.09)
          ctx.scale(sc, sc)
          ftext(w === 'draw' ? 'DRAW' : 'K.O.', 0, 0, 420, { stroke: '#150611', sw: 54, glow: '#ff3b00', glowBlur: 80, grad: ['#fff7a8', '#ff3b00'] })
          ctx.restore()
          if (w !== 'draw') {
            const ls = states[w === 'mount' ? 'boss' : 'mount']
            ctx.save()
            ctx.strokeStyle = 'rgba(255,255,255,0.85)'
            ctx.shadowColor = '#fff'
            ctx.shadowBlur = 14
            ctx.lineWidth = 4
            for (let i = 0; i < 9; i++) {
              const a = (i / 9) * 6.283 + 0.3
              ctx.beginPath()
              let x = ls.x
              let y = 560
              ctx.moveTo(x, y)
              const len = 260 * clamp((rt - 0.1) / 0.3) * (0.6 + hash(i + 2))
              for (let j = 1; j <= 5; j++) {
                x += Math.cos(a + (hash(i * 7 + j) - 0.5) * 0.9) * (len / 5)
                y += Math.sin(a + (hash(i * 7 + j) - 0.5) * 0.9) * (len / 5)
                ctx.lineTo(x, y)
              }
              ctx.stroke()
            }
            ctx.restore()
          }
          break
        }
        case 'suspense': {
          confetti(rv, t, 90)
          break
        }
        case 'stamp': {
          const stamps = w === 'draw' ? [['mount', 'DRAW', '#ffd23d', -0.16, 0], ['boss', 'DRAW', '#ffd23d', 0.14, 0.2]] : [[w, 'VICTORY', '#ffd23d', -0.16, 0], [w === 'mount' ? 'boss' : 'mount', 'DEFEATED', '#ff5a5a', 0.14, 0.45]]
          for (const [side, label, col, rot, delay] of stamps) {
            const k = clamp((rt - delay) / 0.22)
            if (k <= 0) continue
            const st = states[side]
            const sc = lerp(3.4, 1, easeOutExpo(k))
            ctx.save()
            ctx.translate(st.x, 560)
            ctx.rotate(rot)
            ctx.scale(sc, sc)
            ctx.globalAlpha = Math.min(1, k * 3) * 0.95
            ctx.lineWidth = 14
            ctx.strokeStyle = col
            ctx.shadowColor = col
            ctx.shadowBlur = 30
            roundRect(-330, -110, 660, 220, 28)
            ctx.stroke()
            ctx.shadowBlur = 0
            ctx.lineWidth = 4
            roundRect(-312, -92, 624, 184, 18)
            ctx.stroke()
            ftext(label, 0, 6, 150, { fill: col, stroke: 'rgba(10,4,16,0.55)', sw: 14 })
            ctx.restore()
            if (rt - delay < 0.5) shockwave(st.x, 560, (rt - delay) / 0.5, col, 520, 16)
          }
          break
        }
        default:
      }
    }

    if (o.kind === 'suspense' && t < rv) {
      const steps = suspenseSteps(o)
      const cur = steps.filter((s) => s.t <= t).at(-1)
      ctx.save()
      for (const side of ['mount', 'boss']) {
        const cx = BASEX[side]
        if (cur?.side !== side) {
          ctx.fillStyle = 'rgba(0,0,0,0.58)'
          ctx.fillRect(side === 'mount' ? 0 : W / 2, 0, W / 2, H)
        } else {
          const g = ctx.createLinearGradient(0, 0, 0, H)
          g.addColorStop(0, 'rgba(255,255,255,0.4)')
          g.addColorStop(1, 'rgba(255,255,255,0.06)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.moveTo(cx - 70, 0)
          ctx.lineTo(cx + 70, 0)
          ctx.lineTo(cx + 420, H)
          ctx.lineTo(cx - 420, H)
          ctx.closePath()
          ctx.fill()
        }
      }
      ctx.restore()
      const dots = '.'.repeat(1 + (Math.floor(t * 4) % 3))
      band(150, 100, th.accent, t / 0.3)
      ftext(`AND THE WINNER IS${dots}`, W / 2, 150, 104, { maxW: 1600, glow: th.accent, grad: ['#ffffff', th.accent], alpha: clamp((t - 0.2) / 0.2) })
      const q = 1 + Math.sin(t * 9) * 0.06
      ftext('?', W / 2, 560, 420, { stroke: '#150611', sw: 44, glow: th.accent, grad: ['#ffffff', th.accent], sx: q, sy: q, alpha: 0.9 })
    }

    drawAnswer(t, rv, o)

    if (rt > 0 && rt < 0.18) {
      ctx.fillStyle = `rgba(255,255,255,${0.9 * (1 - rt / 0.18)})`
      ctx.fillRect(0, 0, W, H)
    }
  }

  // ---------- giai đoạn 2: thống kê ----------
  const fmtVal = (it, p) => {
    const v = it.value * easeOutCubic(clamp(p))
    if (it.fmt === 'time') {
      const s = Math.round(v)
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    }
    return Math.round(v).toLocaleString('en-US')
  }

  function statsTitle(ts, text, col) {
    band(130, 80, col, clamp(ts / 0.4), 0.78)
    ftext(text.slice(0, Math.floor(ts * 40)), W / 2, 134, 92, { maxW: 1500, glow: col, grad: ['#ffffff', col] })
  }

  function drawStats(t) {
    const th = cfg.theme
    const o = cfg.outro
    const ts = t - TL.statsAt
    const items = o.stats
    const pal = [th.colA, th.accent, th.colB, '#ffffff']
    const out = 1 - clamp((t - (TL.ctaAt - 0.45)) / 0.3)
    ctx.save()
    ctx.globalAlpha = out
    statsTitle(ts, o.statsTitle, th.accent)
    const n = items.length
    switch (o.statsKind) {
      case 'ticker': {
        items.forEach((it, i) => {
          const k = easeOutCubic((ts - (0.45 + i * 0.3)) / 0.5)
          if (k <= 0) return
          const y = 320 + i * 160
          const col = pal[i % pal.length]
          ctx.save()
          ctx.translate(lerp(-1500, 0, k), y)
          ctx.transform(1, 0, -0.18, 1, 0, 0)
          const g = ctx.createLinearGradient(260, 0, 1660, 0)
          g.addColorStop(0, 'rgba(10,8,28,0.92)')
          g.addColorStop(1, 'rgba(24,14,50,0.85)')
          ctx.fillStyle = g
          ctx.fillRect(260, -64, 1400, 128)
          ctx.fillStyle = col
          ctx.fillRect(260, -64, 22, 128)
          ctx.fillStyle = hexA(col, 0.9)
          ctx.fillRect(260, 56, 1400 * clamp((ts - countStart(o, i)) / 1.2), 8)
          ctx.restore()
          ftext(it.label, 330, y, 62, { family: 'Bebas', align: 'left', maxW: 800, alpha: k })
          ftext(fmtVal(it, (ts - countStart(o, i)) / 1.2), 1590, y, 100, { align: 'right', glow: col, glowBlur: 24, grad: ['#ffffff', col], alpha: k })
        })
        break
      }
      case 'gauges': {
        items.forEach((it, i) => {
          const k = easeOutBack((ts - (0.45 + i * 0.25)) / 0.5)
          if (k <= 0) return
          const cx = W / 2 + (i - (n - 1) / 2) * 540
          const cy = 560
          const col = pal[i % pal.length]
          const p = clamp((ts - countStart(o, i)) / 1.3)
          ctx.save()
          ctx.translate(cx, cy)
          ctx.scale(k, k)
          ctx.fillStyle = 'rgba(8,6,22,0.8)'
          ctx.beginPath()
          ctx.arc(0, 0, 215, 0, 6.283)
          ctx.fill()
          ctx.lineCap = 'round'
          for (let s = 0; s < 36; s++) {
            const a = (s / 36) * 6.283 - Math.PI / 2
            const lit = s / 36 < easeOutCubic(p)
            ctx.strokeStyle = lit ? col : 'rgba(255,255,255,0.14)'
            ctx.shadowColor = lit ? col : 'transparent'
            ctx.shadowBlur = lit ? 18 : 0
            ctx.lineWidth = 16
            ctx.beginPath()
            ctx.moveTo(Math.cos(a) * 168, Math.sin(a) * 168)
            ctx.lineTo(Math.cos(a) * 200, Math.sin(a) * 200)
            ctx.stroke()
          }
          ctx.restore()
          ftext(fmtVal(it, (ts - countStart(o, i)) / 1.3), cx, cy + 8, 112, { maxW: 300, glow: col, grad: ['#ffffff', col], alpha: k })
          ftext(it.label, cx, cy + 290, 56, { family: 'Bebas', maxW: 480, alpha: k })
        })
        break
      }
      case 'billboard': {
        const per = (TL.ctaAt - TL.statsAt - 1.0) / n
        const idx = Math.floor((ts - 0.8) / per)
        if (idx >= 0 && idx < n) {
          const it = items[idx]
          const p = ((ts - 0.8) % per) / per
          const col = pal[idx % pal.length]
          const sy = easeOutBack(p / 0.18)
          ctx.save()
          ctx.globalAlpha *= 1 - clamp((p - 0.88) / 0.12)
          ctx.translate(W / 2, 580)
          ctx.scale(1, Math.max(0.01, sy))
          ftext(it.label, 0, -300, 84, { family: 'Bebas', maxW: 1500, glow: col })
          ftext(fmtVal(it, (p * per) / Math.min(1.1, per * 0.7)), 0, 40, 420, { maxW: 1600, stroke: '#150611', sw: 40, glow: col, glowBlur: 70, grad: ['#ffffff', col] })
          if (it.note) ftext(it.note, 0, 300, 70, { family: 'Bebas', maxW: 1500, fill: col })
          ctx.restore()
        }
        for (let i = 0; i < n; i++) {
          ctx.fillStyle = i === idx ? th.accent : 'rgba(255,255,255,0.25)'
          ctx.beginPath()
          ctx.arc(W / 2 + (i - (n - 1) / 2) * 56, 960, i === idx ? 14 : 10, 0, 6.283)
          ctx.fill()
        }
        break
      }
      default: {
        const cw = 500
        const gap = 44
        const total = n * cw + (n - 1) * gap
        items.forEach((it, i) => {
          const k = easeOutCubic((ts - (0.45 + i * 0.25)) / 0.5)
          if (k <= 0) return
          const x = W / 2 - total / 2 + i * (cw + gap) + cw / 2
          const cy = lerp(780, 570, k)
          const col = pal[i % pal.length]
          ctx.save()
          ctx.globalAlpha *= k
          ctx.translate(x, cy)
          const g = ctx.createLinearGradient(0, -280, 0, 280)
          g.addColorStop(0, 'rgba(34,22,70,0.95)')
          g.addColorStop(1, 'rgba(8,6,22,0.95)')
          ctx.fillStyle = g
          ctx.shadowColor = col
          ctx.shadowBlur = 40
          roundRect(-cw / 2, -280, cw, 560, 36)
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.lineWidth = 6
          ctx.strokeStyle = col
          ctx.stroke()
          ctx.fillStyle = col
          roundRect(-cw / 2 + 40, -244, cw - 80, 14, 7)
          ctx.fill()
          ctx.restore()
          ftext(fmtVal(it, (ts - countStart(o, i)) / 1.3), x, cy - 20, 150, { maxW: cw - 70, glow: col, grad: ['#ffffff', col], alpha: k })
          ftext(it.label, x, cy + 120, 54, { family: 'Bebas', maxW: cw - 70, alpha: k })
          if (it.note) ftext(it.note, x, cy + 190, 38, { family: 'Bebas', maxW: cw - 70, fill: col, alpha: k })
        })
      }
    }
    ctx.restore()
  }

  // ---------- giai đoạn 3: kêu gọi đăng ký ----------
  function drawCta(t) {
    const th = cfg.theme
    const o = cfg.outro
    const tc = t - TL.ctaAt
    const chan = o.channel
    const header = (txt, y = 190) => ftext(txt, W / 2, y, 100, { maxW: 1650, stroke: '#150611', sw: 18, glow: th.accent, grad: ['#ffffff', th.accent], alpha: clamp(tc / 0.3), sy: Math.max(0.01, easeOutBack(tc / 0.4)) })
    const footer = () => {
      const k = easeOutCubic((tc - 3.3) / 0.4)
      if (k > 0) ftext('SEE YOU IN THE NEXT BATTLE!', W / 2, 1010, 58, { family: 'Bebas', glow: th.accent, glowBlur: 20, alpha: k })
    }
    switch (o.ctaKind) {
      case 'neon': {
        const fl = tc < 1.2 ? (hash(Math.floor(tc * 26)) > 0.38 ? 1 : 0.12) : 0.93 + 0.07 * Math.sin(tc * 30)
        ctx.save()
        ctx.globalAlpha = fl
        ctx.lineWidth = 10
        ctx.strokeStyle = '#00f0ff'
        ctx.shadowColor = '#00f0ff'
        ctx.shadowBlur = 40
        roundRect(210, 250, 1500, 560, 60)
        ctx.stroke()
        ctx.restore()
        ctx.save()
        ctx.globalAlpha = fl
        ctx.font = fontOf(250, 'RussoOne')
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineJoin = 'round'
        ctx.shadowColor = '#ff2bd6'
        ctx.shadowBlur = 60
        ctx.lineWidth = 12
        ctx.strokeStyle = '#ff2bd6'
        const s = Math.min(1, 1380 / ctx.measureText('SUBSCRIBE').width)
        ctx.translate(W / 2, 470)
        ctx.scale(s, s)
        ctx.strokeText('SUBSCRIBE', 0, 0)
        ctx.shadowBlur = 0
        ctx.lineWidth = 3
        ctx.strokeStyle = '#ffffff'
        ctx.strokeText('SUBSCRIBE', 0, 0)
        ctx.restore()
        ftext('FOR MORE EPIC BATTLES', W / 2, 660, 116, { family: 'Bebas', fill: '#c8fbff', glow: '#00f0ff', glowBlur: 50, alpha: fl })
        if (chan) ftext(chan, W / 2, 330, 70, { family: 'RussoOne', maxW: 1200, glow: '#00f0ff', glowBlur: 30, alpha: fl })
        header('ENJOYED THE BATTLE?', 140)
        for (let i = 0; i < 3; i++) {
          ctx.save()
          ctx.translate(1640, 870 + i * 40 + Math.sin(tc * 6 - i) * 14)
          ctx.globalAlpha = clamp((tc - 1.4 - i * 0.15) / 0.2) * (0.4 + 0.2 * i)
          ctx.strokeStyle = '#ff2bd6'
          ctx.shadowColor = '#ff2bd6'
          ctx.shadowBlur = 24
          ctx.lineWidth = 14
          ctx.beginPath()
          ctx.moveTo(-60, -20)
          ctx.lineTo(0, 30)
          ctx.lineTo(60, -20)
          ctx.stroke()
          ctx.restore()
        }
        break
      }
      case 'banner': {
        const k = easeOutCubic(tc / 0.6)
        const label = 'SUBSCRIBE  \u2022  LIKE  \u2022  COMMENT  \u2022  SHARE  \u2022  '
        const ribbon = (cy, rot, bg, fg, dir) => {
          ctx.save()
          ctx.translate(W / 2 + dir * (1 - k) * 2200, cy)
          ctx.rotate(rot)
          ctx.fillStyle = bg
          ctx.shadowColor = 'rgba(0,0,0,0.6)'
          ctx.shadowBlur = 30
          ctx.fillRect(-1700, -70, 3400, 140)
          ctx.shadowBlur = 0
          ctx.font = fontOf(92, 'Anton')
          ctx.textBaseline = 'middle'
          ctx.fillStyle = fg
          const unit = ctx.measureText(label).width
          const off = (tc * 220 * dir) % unit
          for (let x = -2 * unit; x < 2 * unit; x += unit) ctx.fillText(label, x + off, 4)
          ctx.restore()
        }
        ribbon(320, -0.07, '#ff1f3d', '#ffffff', 1)
        ribbon(830, 0.07, th.accent, '#150611', -1)
        header('ENJOYED THE BATTLE?', 130)
        playLogo(W / 2, 560, 420, Math.cos(tc * 3.2) * Math.min(1, easeOutBack(tc / 0.5)))
        ftext(chan ? `SUBSCRIBE TO ${chan}` : 'SUBSCRIBE FOR MORE EPIC BATTLES!', W / 2, 960, 80, { maxW: 1700, stroke: '#150611', sw: 16, glow: th.accent, grad: ['#ffffff', th.accent], alpha: clamp((tc - 0.8) / 0.3) })
        break
      }
      case 'icons': {
        header('ENJOYED THE BATTLE?', 160)
        ftext(chan ? `SUPPORT ${chan}` : 'SUPPORT THE CHANNEL', W / 2, 290, 62, { family: 'Bebas', maxW: 1600, glow: th.accent, glowBlur: 20, alpha: clamp((tc - 0.3) / 0.3) })
        const icons = [
          ['LIKE', '#ff3b5c', (cx, cy) => heart(cx, cy, 120)],
          ['COMMENT', '#3b9bff', (cx, cy) => bubble(cx, cy, 100)],
          ['SHARE', '#3be07a', (cx, cy) => shareArrow(cx, cy, 120)],
          ['SUBSCRIBE', '#ffd23d', (cx, cy) => bell(cx, cy + 10, 130, Math.sin(tc * 9) * 0.28)],
        ]
        icons.forEach(([label, col, draw], i) => {
          const k = easeOutBack((tc - (0.5 + i * 0.35)) / 0.45)
          if (k <= 0) return
          const cx = 360 + i * 400
          const pulse = 1 + 0.05 * Math.sin(tc * 5 - i * 1.4)
          ctx.save()
          ctx.translate(cx, 620)
          ctx.scale(k * pulse, k * pulse)
          ctx.fillStyle = 'rgba(10,8,28,0.88)'
          ctx.shadowColor = col
          ctx.shadowBlur = 50
          ctx.beginPath()
          ctx.arc(0, 0, 150, 0, 6.283)
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.lineWidth = 10
          ctx.strokeStyle = col
          ctx.stroke()
          ctx.fillStyle = col
          draw(0, 0)
          ctx.restore()
          ftext(label, cx, 850, 70, { family: 'Bebas', fill: col, glow: col, glowBlur: 24, alpha: clamp(k) })
        })
        break
      }
      default: {
        header('ENJOYED THE BATTLE?', 190)
        if (chan) ftext(chan, W / 2, 330, 72, { family: 'RussoOne', maxW: 1400, glow: th.accent, glowBlur: 30, alpha: clamp((tc - 0.3) / 0.3) })
        const subbed = tc >= CLICK
        const since = tc - CLICK
        const k = Math.max(0, easeOutBack((tc - 0.4) / 0.45))
        const bx = 880
        const by = 590
        ctx.save()
        ctx.translate(bx, by)
        const press = subbed && since < 0.15 ? 0.94 : 1
        ctx.scale(k * press, k * press)
        const grad = ctx.createLinearGradient(0, -95, 0, 95)
        grad.addColorStop(0, subbed ? '#4a4a58' : '#ff4a62')
        grad.addColorStop(1, subbed ? '#2a2a36' : '#d0102a')
        ctx.fillStyle = grad
        ctx.shadowColor = subbed ? 'rgba(0,0,0,0.5)' : '#ff1f3d'
        ctx.shadowBlur = 50
        roundRect(-400, -95, 800, 190, 40)
        ctx.fill()
        ctx.restore()
        ftext(subbed ? 'SUBSCRIBED' : 'SUBSCRIBE', bx - (subbed ? 40 : 0), by + 6, 104, { maxW: 640, glow: 'rgba(0,0,0,0.5)', glowBlur: 10, alpha: clamp(k) })
        if (subbed) {
          ctx.save()
          ctx.translate(bx + 290, by + 4)
          ctx.strokeStyle = '#5cff9d'
          ctx.lineWidth = 16
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.beginPath()
          ctx.moveTo(-34, 0)
          ctx.lineTo(-10, 26)
          ctx.lineTo(36, -28)
          ctx.stroke()
          ctx.restore()
        }
        const bellK = Math.max(0, easeOutBack((tc - 0.7) / 0.45))
        const swing = subbed ? Math.sin(since * 22) * 0.55 * Math.exp(-since * 1.5) : Math.sin(tc * 4) * 0.06
        if (bellK > 0) {
          ctx.save()
          ctx.translate(1420, by + 6)
          ctx.scale(bellK, bellK)
          ctx.fillStyle = subbed ? '#ffd23d' : '#cfd3e0'
          ctx.shadowColor = subbed ? '#ffd23d' : 'transparent'
          ctx.shadowBlur = 40
          bell(0, 0, 140, swing)
          ctx.restore()
        }
        if (subbed && since < 1.2) {
          shockwave(bx, by, since / 0.6, '#ffffff', 420, 14)
          shockwave(1420, by, since / 1.0, '#ffd23d', 260, 12)
        }
        const cp = easeInOut(clamp((tc - 1.0) / 1.2))
        const cOut = 1 - clamp((tc - (CLICK + 0.7)) / 0.3)
        if (tc > 0.9 && cOut > 0) {
          ctx.save()
          ctx.globalAlpha = cOut
          cursor(lerp(1500, bx + 160, cp), lerp(1020, by + 40, cp), subbed && since < 0.15 ? 0.82 : 1)
          ctx.restore()
        }
        if (subbed) ftext('TURN ON NOTIFICATIONS', W / 2, 840, 80, { family: 'Bebas', glow: th.accent, glowBlur: 24, alpha: clamp((since - 0.4) / 0.4) })
      }
    }
    footer()
  }

  // ---------- chuyển cảnh ----------
  function wipe(t, at) {
    const p = clamp((t - (at - 0.35)) / 0.7)
    if (p <= 0 || p >= 1) return
    const th = cfg.theme
    const x = lerp(-800, W + 800, p)
    ctx.save()
    const g = ctx.createLinearGradient(x - 600, 0, x + 600, 0)
    g.addColorStop(0, th.colA)
    g.addColorStop(0.5, th.accent)
    g.addColorStop(1, th.colB)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(x - 600, 0)
    ctx.lineTo(x + 800, 0)
    ctx.lineTo(x + 400, H)
    ctx.lineTo(x - 1000, H)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // Câu đố gà vàng: gài bình luận ở phần thống kê, tiết lộ giây xuất hiện ở phần kêu gọi.
  function goldenBait(t) {
    const o = cfg.outro
    if (!Number.isFinite(o.golden)) return
    const inStats = t >= TL.statsAt && t < TL.ctaAt
    const inCta = t >= TL.ctaAt
    if (!inStats && !inCta) return
    const lt = inStats ? t - TL.statsAt : t - TL.ctaAt
    const fadeOut = inStats ? 1 - clamp((t - (TL.ctaAt - 0.5)) / 0.3) : 1 - clamp((t - (TL.end - 1.2)) / 0.5)
    const a = clamp((lt - 0.6) / 0.35) * fadeOut
    if (a <= 0) return
    const total = Math.round(o.golden)
    const stamp = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
    const reveal = inCta && lt > 1.6
    const msg = reveal ? `THE GOLDEN CHICKEN RAN BY AT ${stamp}!` : 'DID YOU SPOT THE GOLDEN CHICKEN? COMMENT THE SECOND!'
    const pop = easeOutBack(clamp((lt - 0.6) / 0.5))
    const pulse = 1 + Math.sin(t * 6) * 0.015
    ctx.save()
    ctx.globalAlpha = a
    ctx.translate(W / 2, H - 78)
    ctx.scale(pop * pulse, pop * pulse)
    ctx.font = fontOf(46, 'Anton')
    const w = Math.min(W - 160, ctx.measureText(msg).width + 120)
    ctx.fillStyle = 'rgba(21,6,17,0.78)'
    ctx.beginPath()
    ctx.roundRect(-w / 2, -42, w, 84, 42)
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#ffd23d'
    ctx.stroke()
    ctx.restore()
    ctx.save()
    ctx.globalAlpha = a
    ftext(msg, W / 2, H - 78, 46, { maxW: W - 220, stroke: '#150611', sw: 8, glow: '#ffd23d', glowBlur: 18, grad: ['#fff6c2', '#ffd23d'] })
    ctx.restore()
  }

  function frame(t) {
    bind()
    ctx.setTransform(K.scale, 0, 0, K.scale, 0, 0)
    ctx.clearRect(0, 0, W, H)
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
    K.drawBackground(t)
    ctx.save()
    if (t < TL.statsAt) drawVerdict(t)
    else if (t < TL.ctaAt) drawStats(t)
    else drawCta(t)
    ctx.restore()
    wipe(t, TL.statsAt)
    wipe(t, TL.ctaAt)
    goldenBait(t)
    vignette()
    if (t < 0.3) {
      ctx.fillStyle = `rgba(0,0,0,${1 - t / 0.3})`
      ctx.fillRect(0, 0, W, H)
    }
    const fade = clamp((t - (TL.end - 0.6)) / 0.6)
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade})`
      ctx.fillRect(0, 0, W, H)
    }
    return K.jpeg()
  }

  // ---------- âm thanh ----------
  async function audio() {
    bind()
    const o = cfg.outro
    const kit = K.makeAudioKit(TL.end)
    const { master, tone, noise, kick, snare, hat, brass, crash, boom, whoosh } = kit
    const rv = revealOf(o)
    const chord = o.winner === 'boss' ? [110, 130.8, 164.8, 220] : o.winner === 'draw' ? [110, 164.8, 220, 329.6] : [130.8, 196, 261.6, 329.6]
    const ding = (t0, f, vol = 0.18, d = 1.6) => {
      for (const [m, v] of [[1, 1], [2.01, 0.5], [3.02, 0.25], [4.2, 0.12]]) tone(t0, d / m ** 0.3, f * m, f * m * 0.998, 'sine', vol * v, 0.002)
    }

    for (let b = 0; b < Math.floor(TL.statsAt / 0.5); b++) {
      const t0 = b * 0.5
      if (t0 < 0.1) continue
      const quiet = o.kind === 'suspense' && t0 < rv
      kick(t0, quiet ? 0.35 : b % 2 ? 0.55 : 0.85, 0.3)
      if (!quiet && b % 2) snare(t0, 0.4)
      hat(t0 + 0.25, quiet ? 0.06 : 0.14)
    }
    whoosh(0, 0.6, 0.5, true)

    if (o.kind === 'suspense') {
      suspenseSteps(o).forEach((s, i) => {
        tone(s.t, 0.12, 700 + (i % 2) * 260, 700 + (i % 2) * 260, 'square', 0.1, 0.002)
        snare(s.t, 0.12 + i * 0.012)
      })
      whoosh(0.2, rv - 0.2, 0.55, true)
      tone(0, rv, 80, 700, 'sawtooth', 0.08, rv * 0.85, 1800)
    }

    boom(rv, 1.1)
    crash(rv, 1.6, 0.7)
    brass(rv, 1.6, chord, 0.24)
    noise(rv, 3, 0.26, 'bandpass', 800, 1700, 0.5, 0.9)
    if (o.winner !== 'boss' && o.winner !== 'draw') [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(rv + 0.15 + i * 0.1, 0.6, f, f, 'triangle', 0.1, 0.01))

    switch (o.kind) {
      case 'trophy':
      case 'crown':
        ;[1568, 2093, 2637, 3136].forEach((f, i) => tone(rv + 0.9 + i * 0.07, 0.7, f, f, 'sine', 0.05, 0.003))
        ding(rv + 1.1, 1318.5, 0.14)
        break
      case 'ko':
        boom(rv + 0.02, 1.2)
        tone(rv, 0.5, 300, 60, 'sawtooth', 0.2, 0.002, 1500)
        break
      case 'fireworks':
        fireworkTimes().forEach((t0) => {
          whoosh(t0, 0.45, 0.25, true)
          noise(t0 + 0.45, 0.6, 0.35, 'bandpass', 3000, 900, 0.7, 0.003)
          noise(t0 + 0.45, 0.25, 0.3, 'highpass', 6000, 3000, 0.5, 0.002)
        })
        break
      case 'stamp':
        for (const d of o.winner === 'draw' ? [0, 0.2] : [0, 0.45]) {
          kick(rv + d, 1, 0.4)
          noise(rv + d, 0.25, 0.5, 'lowpass', 2500, 200, 0.7, 0.002)
        }
        break
      default:
    }

    for (let b = 0; b < Math.floor((TL.ctaAt - TL.statsAt) / 0.5); b++) {
      const t0 = TL.statsAt + b * 0.5
      kick(t0, b % 2 ? 0.4 : 0.6, 0.28)
      hat(t0 + 0.25, 0.1)
      if (b % 2) snare(t0, 0.25)
    }
    whoosh(TL.statsAt - 0.4, 0.6, 0.4, true)
    o.stats.forEach((_, i) => {
      const st = TL.statsAt + countStart(o, i)
      for (let j = 0; j < 24; j++) tone(st + j * 0.05, 0.03, 1400 + j * 55, 1400 + j * 55, 'square', 0.035, 0.001)
      ding(st + 1.25, 880 + i * 220, 0.14, 0.9)
      whoosh(st - 0.3, 0.3, 0.25, true)
    })

    const c0 = TL.ctaAt
    whoosh(c0 - 0.4, 0.6, 0.45, true)
    boom(c0, 0.7)
    for (let b = 0; b < Math.floor((TL.end - c0) / 0.5); b++) {
      kick(c0 + b * 0.5, b % 2 ? 0.3 : 0.5, 0.25)
      hat(c0 + b * 0.5 + 0.25, 0.09)
    }
    ;[[0, [261.6, 329.6, 392]], [1, [220, 261.6, 329.6]], [2, [174.6, 220, 261.6]], [3, [196, 246.9, 392]]].forEach(([i, ch]) => ch.forEach((f) => tone(c0 + i, 1.1, f, f, 'triangle', 0.05, 0.1, 1800)))
    if (o.ctaKind === 'button') {
      const click = c0 + CLICK
      noise(click, 0.05, 0.6, 'highpass', 3000, 3000, 0.5, 0.001)
      tone(click, 0.07, 1200, 600, 'square', 0.18, 0.001)
      ding(click + 0.12, 1568, 0.22, 2.2)
      ding(click + 0.2, 2093, 0.14, 2.0)
      for (let i = 0; i < 6; i++) ding(click + 0.25 + i * 0.12, 2637, 0.05 * (1 - i / 7), 0.6)
    } else {
      for (let i = 0; i < 4; i++) {
        tone(c0 + 0.5 + i * 0.35, 0.18, 880 + i * 220, 880 + i * 220, 'square', 0.08, 0.004)
        ding(c0 + 0.5 + i * 0.35, 1568 + i * 200, 0.1, 1.0)
      }
    }
    ding(c0 + 3.3, 1046.5, 0.12, 1.4)

    master.gain.setValueAtTime(0.9, TL.end - 0.7)
    master.gain.linearRampToValueAtTime(0, TL.end)
    return K.finishAudio(kit, TL.end)
  }

  window.IntroOutro = { TL, frame, audio }
})()
