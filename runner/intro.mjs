// Dựng đoạn mở màn "VS" (thú cưỡi vs boss + quái, câu hỏi, đếm ngược, READY/GO, âm thanh) rồi ghép lên đầu video đã dựng.
// Dùng:  node runner/intro.mjs --plan plan.json --out output --width 2560 --height 1440 --fps 30 [--style random] [--countdown random]
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const here = path.dirname(fileURLToPath(import.meta.url))
const appDir = path.resolve(here, '..', 'app')
const gameDir = path.join(appDir, 'game')

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : 'true'])
    return acc
  }, []),
)
const plan = JSON.parse(fs.readFileSync(args.plan ?? 'plan.json', 'utf8'))
const outDir = path.resolve(args.out ?? 'output')
const width = Number(args.width ?? 2560)
const height = Number(args.height ?? 1440)
const fps = Number(args.fps ?? 30)
const crf = Number(args.crf ?? 20)
const preset = args.preset ?? 'veryfast'
const work = path.resolve('.work')
fs.mkdirSync(work, { recursive: true })

const STYLES = ['clash', 'inferno', 'cyber', 'arena', 'storm']
const COUNTDOWNS = ['ring', 'shock', 'tile', 'slice']
const QUESTIONS = [
  'WHO WILL WIN?',
  'WHO WILL SURVIVE?',
  'WHO RULES THE ARENA?',
  'CAN THE MOUNT BEAT THE BOSS?',
  'HEROES OR MONSTERS?',
  'WHO IS STRONGER?',
  'WHO FALLS FIRST?',
  'ONLY ONE WALKS AWAY...',
  'WHO WILL TAKE THE VICTORY?',
  'BEAST OR BOSS: PICK YOUR SIDE!',
  'CAN THE BOSS BE STOPPED?',
  'WHO WILL BE LEFT STANDING?',
]
const SUBTITLES = ['COMMENT YOUR PICK BELOW', 'TEAM LEFT OR TEAM RIGHT?', 'MAKE YOUR PREDICTION NOW', 'WATCH TO THE END TO FIND OUT']
const READY = ['READY?', 'GET READY!', 'ARE YOU READY?', 'BRACE YOURSELF!', 'FIGHT STARTS NOW!']
const GO = ['FIGHT!', 'GO!', 'BEGIN!', 'BATTLE START!']

function mulberry(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rnd = mulberry((Number(plan.seed) || 1) ^ 0x51ed)
const pick = (arr, forced, fallbackList) => (forced && forced !== 'random' && fallbackList.includes(forced) ? forced : arr[Math.floor(rnd() * arr.length)])

const style = pick(STYLES, args.style, STYLES)
const countdown = pick(COUNTDOWNS, args.countdown, COUNTDOWNS)
const question = pick(QUESTIONS, null, [])
const subtitle = pick(SUBTITLES, null, [])
const readyText = pick(READY, null, [])
const goText = pick(GO, null, [])

const stem = (n) => String(n).replace(/\.zip$/i, '')
const pretty = (id) => stem(id).replace(/[-_]+/g, ' ').replace(/\d+$/, '').trim().toUpperCase()

const manifest = JSON.parse(fs.readFileSync(path.join(gameDir, 'manifest.json'), 'utf8'))
const toDataUrl = (rel) => {
  if (!rel) return null
  const f = path.join(gameDir, rel)
  if (!fs.existsSync(f)) return null
  return `data:image/${path.extname(f).slice(1) === 'png' ? 'png' : 'webp'};base64,${fs.readFileSync(f).toString('base64')}`
}
const mountEntry = manifest.mounts?.find((m) => m.id === stem(plan.mount))
const bossId = stem(plan.boss)
const bossRel = ['evil', 'enraged', 'furious', 'annoyed', 'calm'].map((m) => `bosses/${bossId}-${m}.webp`).find((r) => fs.existsSync(path.join(gameDir, r)))
const monsterRels = (plan.monsters ?? [])
  .map((m) => manifest.monsters?.find((e) => e.id === stem(m))?.frames?.[0])
  .filter(Boolean)
  .slice(0, 3)

const fontUrl = (name) => `data:font/ttf;base64,${fs.readFileSync(path.join(appDir, 'assets', 'fonts', name)).toString('base64')}`

const cfg = {
  seed: Number(plan.seed) || 1,
  width,
  height,
  fps,
  style,
  countdown,
  question,
  subtitle,
  readyText,
  goText,
  labels: { left: pretty(plan.mount), right: `${pretty(plan.boss)} & MONSTERS` },
  mountImg: toDataUrl(mountEntry?.idle ?? mountEntry?.run?.[0]),
  bossImg: toDataUrl(bossRel),
  monsterImgs: monsterRels.map(toDataUrl),
  fonts: { anton: fontUrl('Anton-Regular.ttf'), bebas: fontUrl('BebasNeue-Regular.ttf'), russo: fontUrl('RussoOne-Regular.ttf') },
}

console.log(`Mở màn: kiểu ${style}, đồng hồ ${countdown}, câu hỏi "${question}", "${readyText}" -> "${goText}"`)
if (!cfg.mountImg || !cfg.bossImg) console.log('  ! thiếu ảnh thú cưỡi hoặc boss, mở màn sẽ thiếu nhân vật')

const frameDir = path.join(work, 'intro_frames')
fs.rmSync(frameDir, { recursive: true, force: true })
fs.mkdirSync(frameDir, { recursive: true })
const wavPath = path.join(work, 'intro.wav')
const introMp4 = path.join(work, 'intro.mp4')

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 800, height: 600 } })
page.on('pageerror', (e) => console.log('[intro page error]', e.message))
await page.setContent('<!doctype html><html><body></body></html>')
await page.addScriptTag({ path: path.join(here, 'intro', 'intro-page.js') })
const { frames } = await page.evaluate((c) => window.Intro.init(c), cfg)

for (let i = 0; i < frames; i++) {
  const b64 = await page.evaluate((t) => window.Intro.renderFrame(t), i / fps)
  fs.writeFileSync(path.join(frameDir, `f${String(i).padStart(6, '0')}.jpg`), Buffer.from(b64, 'base64'))
  if (i % 60 === 0) console.log(`  khung mở màn ${i}/${frames}`)
}
fs.writeFileSync(wavPath, Buffer.from(await page.evaluate(() => window.Intro.renderAudio()), 'base64'))
await browser.close()

function run(cmd, a) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, a, { stdio: ['ignore', 'inherit', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} lỗi ${code}\n${err.slice(-1500)}`))))
  })
}
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg'
const vf = `scale=${width}:${height}:flags=lanczos:in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p`
const encodeArgs = [
  '-c:v', 'libx264', '-preset', preset, '-crf', String(crf), '-profile:v', 'high', '-level', '5.2',
  '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
  '-g', String(fps * 2),
]
await run(ffmpeg, [
  '-y', '-hide_banner', '-nostdin', '-loglevel', 'error',
  '-framerate', String(fps), '-i', path.join(frameDir, 'f%06d.jpg'), '-i', wavPath,
  '-vf', vf, '-r', String(fps), ...encodeArgs,
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart', introMp4,
])
fs.rmSync(frameDir, { recursive: true, force: true })
fs.rmSync(wavPath, { force: true })

// Ghép intro + video chính (giữ nguyên tên file để bước upload không phải đổi gì).
const mains = fs.readdirSync(outDir).filter((f) => f.endsWith('.mp4')).sort()
if (!mains.length) throw new Error('Không thấy video chính trong thư mục output để ghép mở màn')
const mainFile = path.join(outDir, mains.at(-1))
const merged = path.join(work, 'merged.mp4')
const probe = spawnSync(process.env.FFPROBE ?? 'ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', mainFile], { encoding: 'utf8' })
const mainHasAudio = probe.status === 0 && probe.stdout.trim() !== ''

let ok = false
if (mainHasAudio) {
  const list = path.join(work, 'concat.txt')
  fs.writeFileSync(list, `file '${introMp4.replace(/'/g, "'\\''")}'\nfile '${mainFile.replace(/'/g, "'\\''")}'\n`)
  try {
    await run(ffmpeg, ['-y', '-hide_banner', '-nostdin', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', merged])
    ok = true
  } catch (e) {
    console.log('  ghép nhanh (copy) lỗi, chuyển sang ghép có mã hóa lại:', e.message.split('\n')[0])
  }
}
if (!ok) {
  const norm = `[1:v]scale=${width}:${height}:flags=lanczos,fps=${fps},setsar=1,format=yuv420p[v1];[0:v]setsar=1[v0]`
  const common = ['-y', '-hide_banner', '-nostdin', '-loglevel', 'error', '-i', introMp4, '-i', mainFile]
  if (mainHasAudio) {
    await run(ffmpeg, [
      ...common,
      '-filter_complex', `${norm};[1:a]aresample=48000,aformat=channel_layouts=stereo[a1];[v0][0:a][v1][a1]concat=n=2:v=1:a=1[v][a]`,
      '-map', '[v]', '-map', '[a]', ...encodeArgs, '-r', String(fps),
      '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', merged,
    ])
  } else {
    await run(ffmpeg, [
      ...common,
      '-filter_complex', `${norm};[v0][v1]concat=n=2:v=1:a=0[v]`,
      '-map', '[v]', ...encodeArgs, '-r', String(fps), '-an', '-movflags', '+faststart', merged,
    ])
  }
}
fs.renameSync(merged, mainFile)
fs.rmSync(introMp4, { force: true })

const metaFile = mainFile.replace(/\.mp4$/, '.json')
if (fs.existsSync(metaFile)) {
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'))
  meta.intro = { style, countdown, question, ready: readyText, go: goText }
  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2))
}
console.log(`Đã ghép mở màn vào ${path.basename(mainFile)} (${(fs.statSync(mainFile).size / 1e6).toFixed(1)} MB)`)
