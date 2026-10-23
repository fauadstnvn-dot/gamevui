// Chạy chính game gốc (app/index.html) trong Chromium headless, bấm nút "Tạo video" của game
// và thay api.php bằng bộ xử lý cục bộ (nhận khung hình + âm thanh, gọi ffmpeg).
// Nhờ vậy video có đủ thanh máu, chữ, hiệu ứng tấn công và âm thanh y như bản gốc.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const here = path.dirname(fileURLToPath(import.meta.url))
const appDir = path.resolve(here, '..', 'app')

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : 'true'])
    return acc
  }, []),
)
const planPath = args.plan ?? 'plan.json'
const outDir = path.resolve(args.out ?? 'output')
const width = Number(args.width ?? 2560)
const height = Number(args.height ?? 1440)
const fps = Number(args.fps ?? 30)
const crf = Number(args.crf ?? 20)
const preset = args.preset ?? 'veryfast'
// Nhạc ngoài ở mức nền (~35%); nhạc synth gốc của game được tắt khi có nhạc ngoài để không bị chồi giai điệu.
const MUSIC_GAIN = Number(args['music-gain'] ?? 0.35)
const GAME_MUSIC_VOL_WITH_EXTERNAL = 0
// Hiệu ứng cú KO: quay chậm + rung + chớp trắng (trong game), im lặng ngắn trước KO và tiếng boom khi KO (khâu trộn âm).
const KO_FX = args['ko-fx'] !== 'false'
const KO_SILENCE = Number(args['ko-silence'] ?? 0.55)
let koSec = null
const maxMinutes = Number(args.timeout ?? 170)

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'))
const work = path.resolve('.work')
fs.mkdirSync(work, { recursive: true })
fs.mkdirSync(outDir, { recursive: true })

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const rel = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)
  const file = path.join(appDir, rel)
  if (!file.startsWith(appDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' })
  fs.createReadStream(file).pipe(res)
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${server.address().port}`

const jobs = new Map()
let finalName = null
let frameCount = 0

function field(buf, name) {
  const m = buf.toString('latin1').match(new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]*)`))
  return m ? m[1] : ''
}

function startEncode(id, form) {
  const frameDir = path.join(work, `${id}_frames`)
  const wav = path.join(work, `${id}.wav`)
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14).replace(/^(\d{8})(\d{6})$/, '$1-$2')
  const name = `video-${stamp}-${plan.seed}.mp4`
  const outFile = path.join(outDir, name)
  const hasAudio = fs.existsSync(wav) && fs.statSync(wav).size > 1000
  const total = fs.readdirSync(frameDir).filter((f) => f.endsWith('.jpg')).length
  frameCount = total
  // JPEG của trình duyệt là full-range BT.601; đổi sang limited-range BT.709 chuẩn video.
  const vf = `scale=${width}:${height}:flags=lanczos:in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p`
  const musicFile = plan.musicFile && fs.existsSync(plan.musicFile) ? path.resolve(plan.musicFile) : ''
  const useMusic = hasAudio && musicFile !== ''
  const videoSec = total / fps
  // Nhạc ngoài lặp vô hạn rồi bị cắt theo độ dài tiếng game (amix duration=first). Nhạc tự hạ khi có tiếng
  // chiến đấu (sidechain), nhỏ hơn hiệu ứng, vào/ra mờ dần để không bị cắt đột ngột.
  // Dải âm động quanh cú KO: im lặng ngắn ngay trước KO (cả nhạc lẫn tiếng game), rồi một tiếng boom trầm đúng lúc KO.
  const koFx = KO_FX && koSec != null && koSec > KO_SILENCE + 1
  const dip = koFx
    ? `volume='1-0.94*clip((t-${(koSec - KO_SILENCE).toFixed(3)})/0.12,0,1)*(1-clip((t-${koSec.toFixed(3)})/0.03,0,1))':eval=frame`
    : 'anull'
  const boomMs = koFx ? Math.max(0, Math.round((koSec - 0.02) * 1000)) : 0
  const boom =
    "aevalsrc='0.95*sin(2*PI*(46+70*exp(-t*10))*t)*exp(-t*3.2)+0.35*(random(0)*2-1)*exp(-t*16)':d=2.2:s=48000," +
    `aformat=channel_layouts=stereo,adelay=${boomMs}|${boomMs}[boom]`
  const graphParts = useMusic
    ? [
        '[1:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[sfx][key]',
        `[2:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${MUSIC_GAIN},afade=t=in:st=0:d=2[mus]`,
        '[mus][key]sidechaincompress=threshold=0.04:ratio=5:attack=15:release=450:makeup=1[duck]',
        `[sfx][duck]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,${dip}[mixed]`,
      ]
    : [`[1:a]aformat=sample_rates=48000:channel_layouts=stereo,${dip}[mixed]`]
  if (koFx) graphParts.push(boom)
  const tail = `alimiter=limit=0.95,afade=t=out:st=${Math.max(0, videoSec - 3).toFixed(2)}:d=3[aout]`
  graphParts.push(koFx ? `[mixed][boom]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,${tail}` : `[mixed]${tail}`)
  const audioGraph = graphParts.join(';')
  const useGraph = hasAudio && (useMusic || koFx)
  const ff = [
    '-y', '-hide_banner', '-nostdin', '-loglevel', 'error', '-progress', 'pipe:1',
    '-framerate', String(fps), '-start_number', '0', '-i', path.join(frameDir, 'f%06d.jpg'),
    ...(hasAudio ? ['-i', wav] : []),
    ...(useMusic ? ['-stream_loop', '-1', '-i', musicFile] : []),
    ...(useGraph ? ['-filter_complex', audioGraph, '-map', '0:v', '-map', '[aout]'] : []),
    '-vf', vf, '-r', String(fps),
    '-c:v', 'libx264', '-preset', preset, '-crf', String(crf), '-profile:v', 'high', '-level', '5.2',
    '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709',
    '-color_trc', 'bt709', '-g', String(fps * 2),
    ...(hasAudio ? ['-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest'] : ['-an']),
    '-movflags', '+faststart', outFile,
  ]
  const job = { state: 'running', percent: 0, log: '', file: name, size: 0 }
  jobs.set(id, job)
  const proc = spawn(process.env.FFMPEG ?? 'ffmpeg', ff)
  proc.stdout.on('data', (d) => {
    const m = String(d).match(/frame=(\d+)/g)
    if (m && total) job.percent = Math.min(99, Math.round((Number(m.at(-1).slice(6)) / total) * 100))
  })
  proc.stderr.on('data', (d) => (job.log += String(d)))
  proc.on('close', (code) => {
    if (code === 0) {
      job.state = 'done'
      job.percent = 100
      job.size = fs.statSync(outFile).size
      finalName = name
      fs.rmSync(frameDir, { recursive: true, force: true })
      fs.rmSync(wav, { force: true })
    } else {
      job.state = 'error'
      job.error = `ffmpeg lỗi (mã ${code})`
    }
  })
  return form
}

async function handleApi(route) {
  const req = route.request()
  const url = new URL(req.url())
  const action = url.searchParams.get('action')
  const json = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) })
  const body = req.postDataBuffer() ?? Buffer.alloc(0)
  const id = url.searchParams.get('id') ?? ''

  if (url.pathname.endsWith('packs.php')) return json({ ok: true, packs: [] })
  switch (action) {
    case 'check':
      return json({ ok: true, needs_password: false, version: 'ffmpeg (GitHub Actions)' })
    case 'list':
      return json({ ok: true, files: [] })
    case 'chunk': {
      const file = path.join(work, `${id}.wav`)
      if (Number(url.searchParams.get('i')) === 0) fs.rmSync(file, { force: true })
      fs.appendFileSync(file, body)
      return json({ ok: true, size: fs.statSync(file).size })
    }
    case 'frames': {
      const start = Number(url.searchParams.get('start'))
      const lens = (req.headers()['x-lens'] ?? '').split(',').filter(Boolean).map(Number)
      const dir = path.join(work, `${id}_frames`)
      if (start === 0) fs.rmSync(dir, { recursive: true, force: true })
      fs.mkdirSync(dir, { recursive: true })
      let offset = 0
      lens.forEach((len, i) => {
        fs.writeFileSync(path.join(dir, `f${String(start + i).padStart(6, '0')}.jpg`), body.subarray(offset, offset + len))
        offset += len
      })
      return json({ ok: true })
    }
    case 'encode': {
      startEncode(field(body, 'id'), body)
      return json({ ok: true })
    }
    case 'status': {
      const job = jobs.get(id)
      return json(job ?? { state: 'error', error: 'Không có tác vụ.' })
    }
    default:
      return json({ ok: false, error: `action không hỗ trợ: ${action}` }, 400)
  }
}

const browser = await chromium.launch({
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } })
page.on('pageerror', (e) => console.log('[page error]', e.message))
await page.exposeFunction('gvReportKo', (sec) => {
  koSec = sec
  console.log(`KO ở ${sec.toFixed(2)}s`)
})
await page.route(/\/(api|packs)\.php/, handleApi)
await page.goto(base, { waitUntil: 'load' })
await page.waitForSelector('#sceneries button.chip', { timeout: 120_000 })
await page.waitForFunction(() => document.querySelector('#status')?.textContent?.includes('xem trước'), null, { timeout: 180_000 })

const musicValues = await page.$$eval('#music-style option', (o) => o.map((x) => x.value))
const music = musicValues[plan.musicSeed % musicValues.length]
const stem = (n) => n.replace(/\.zip$/i, '')

await page.evaluate(
  ({ plan, size, fps, crf, music, gameMusicVol, koFx }) => {
    const stem = (n) => n.replace(/\.zip$/i, '')
    const setValue = (id, value) => {
      const el = document.getElementById(id)
      if (el instanceof HTMLSelectElement && ![...el.options].some((o) => o.value === value)) el.add(new Option(value, value))
      el.value = value
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }
    setValue('seed', String(plan.seed))
    setValue('mode', 'auto')
    window.__gvStyle = plan.style || ''
    window.__gvKoFx = koFx
    setValue('outcome', ['win', 'lose'].includes(plan.outcome) ? plan.outcome : 'random')
    setValue('rider', 'none')
    setValue('mount', stem(plan.mount))
    setValue('boss', stem(plan.boss))
    setValue('lang', 'en')
    setValue('duration', String(plan.duration))
    setValue('music-style', music)
    setValue('music-vol', String(gameMusicVol))
    setValue('size', size)
    setValue('fps', String(fps))
    setValue('crf', String(crf))
  },
  {
    plan,
    size: `${width}x${height}`,
    fps,
    crf,
    music,
    gameMusicVol: plan.musicFile && fs.existsSync(plan.musicFile) ? GAME_MUSIC_VOL_WITH_EXTERNAL : 0.5,
    koFx: KO_FX,
  },
)

const sceneries = (plan.sceneries?.length ? plan.sceneries : [plan.scenery]).map(stem)
await page.evaluate(
  ({ ids, sceneMonsters, sceneMouth, transition }) => {
    window.__gvTransition = transition
    window.__gvMouthIds = ids
    window.__gvSceneMonsters = sceneMonsters
    window.__gvSceneMouth = sceneMouth
  },
  { ids: (plan.mouthMonsters ?? []).map(stem), sceneMonsters: plan.sceneMonsters ?? {}, sceneMouth: plan.sceneMouth ?? {}, transition: plan.transition ?? 'swallow' },
)

for (const box of ['#sceneries', '#monsters']) {
  const names = await page.$$eval(`${box} button.chip`, (b) => b.map((x) => x.querySelector('span').textContent))
  const wanted = box === '#sceneries' ? sceneries : plan.monsters.map(stem)
  for (const w of wanted) {
    const idx = names.findIndex((n) => n.toLowerCase().includes(w.toLowerCase()))
    if (idx < 0) throw new Error(`Không thấy ${w} trong ${box}`)
    await page.locator(`${box} button.chip`).nth(idx).click()
  }
}

console.log(`Bắt đầu: seed ${plan.seed}, ${plan.duration}s, ${width}x${height}@${fps}, nhạc ${music}`)
await page.click('#make')

const deadline = Date.now() + maxMinutes * 60_000
let lastLog = ''
for (;;) {
  const status = await page.$eval('#status', (e) => ({ text: e.textContent, kind: e.dataset.kind }))
  if (status.text !== lastLog) {
    console.log(status.text)
    lastLog = status.text
  }
  if (finalName) break
  if (status.kind === 'err') throw new Error(status.text)
  const failed = [...jobs.values()].find((j) => j.state === 'error')
  if (failed) throw new Error(`${failed.error}\n${failed.log}`)
  if (Date.now() > deadline) throw new Error('Quá thời gian dựng video')
  await new Promise((r) => setTimeout(r, 5000))
}
const snap = await page.evaluate(() => window.__lastSnap ?? null).catch(() => null)
await browser.close()
server.close()

const meta = {
  result: snap?.result ?? null,
  stats: snap
    ? { kills: snap.kills, fled: snap.fled, golden: snap.golden, sunKills: snap.sunKills, score: snap.score, coins: snap.coins, time: snap.time, stage: snap.stage, stages: snap.stages, hp: snap.hp }
    : null,
  seed: plan.seed,
  duration: plan.duration,
  style: plan.style || null,
  koSec,
  resolution: `${width}x${height}`,
  fps,
  scenery: plan.scenery,
  sceneries: plan.sceneries ?? [plan.scenery],
  mount: plan.mount,
  boss: plan.boss,
  monsters: plan.monsters,
  mouthMonsters: plan.mouthMonsters ?? [],
  file: finalName,
  music: plan.musicFile ? path.basename(plan.musicFile) : null,
}
fs.writeFileSync(path.join(outDir, finalName.replace(/\.mp4$/, '.json')), JSON.stringify(meta, null, 2))
const size = fs.statSync(path.join(outDir, finalName)).size
console.log(`Xong: ${finalName} (${(size / 1e6).toFixed(1)} MB, ${frameCount} khung)`)
