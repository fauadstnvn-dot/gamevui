// Dựng đoạn mở màn "VS" (thú cưỡi vs boss + quái, câu hỏi, đếm ngược, READY/GO) và cảnh kết thúc (bên thắng + câu trả lời,
// thống kê, kêu gọi đăng ký) rồi ghép vào đầu/cuối video đã dựng.
// Dùng:  node runner/intro.mjs --plan plan.json --out output --width 2560 --height 1440 --fps 30
//          [--intro true|false] [--outro true|false] [--style random] [--countdown random]
//          [--teaser true|false] [--outro-style random] [--stats-style random] [--cta-style random] [--winner auto|mount|boss|draw] [--channel "TÊN KÊNH"]
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { COUNTDOWNS, CTA_KINDS, DRAW_ANSWERS, GO, OUTRO_KINDS, QUESTIONS, READY, STATS_KINDS, STYLES, SUBTITLES, fill } from './intro/content.mjs'

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
const wantIntro = args.intro !== 'false'
const wantOutro = args.outro === 'true'
// Teaser: cắt 2-3 giây căng nhất của trận chiếu ngay đầu video, trước màn VS, để giữ chân người xem trong 3 giây đầu.
const wantTeaser = args.teaser !== 'false'
const work = path.resolve('.work')
fs.mkdirSync(work, { recursive: true })

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
const pick = (arr, forced, allowed) => (forced && forced !== 'random' && allowed.includes(forced) ? forced : arr[Math.floor(rnd() * arr.length)])

const stem = (n) => String(n).replace(/\.zip$/i, '')
const pretty = (id) => stem(id).replace(/[-_]+/g, ' ').replace(/\d+$/, '').trim().toUpperCase()

// Thứ tự bốc thăm giữ nguyên như trước để cùng seed vẫn ra cùng mở màn.
const style = pick(STYLES, args.style, STYLES)
const countdown = pick(COUNTDOWNS, args.countdown, COUNTDOWNS)
const questionEntry = pick(QUESTIONS, null, [])
const subtitle = pick(SUBTITLES, null, [])
const readyText = pick(READY, null, [])
const goText = pick(GO, null, [])

// ---------- kết quả trận (từ file thông tin do bước dựng game ghi) ----------
const mainsBefore = fs.readdirSync(outDir).filter((f) => f.endsWith('.mp4')).sort()
if (!mainsBefore.length) throw new Error('Không thấy video chính trong thư mục output để ghép mở màn / kết thúc')
const mainFile = path.join(outDir, mainsBefore.at(-1))
const metaFile = mainFile.replace(/\.mp4$/, '.json')
const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : null

const names = { M: pretty(plan.mount), B: pretty(plan.boss) }
let winner = ['mount', 'boss', 'draw'].includes(args.winner) ? args.winner : null
if (!winner) winner = meta?.result === 'lose' ? 'boss' : meta?.result === 'timeup' ? 'draw' : 'mount'
const tokens = { ...names, W: winner === 'boss' ? names.B : names.M, L: winner === 'boss' ? names.M : names.B }
const question = fill(questionEntry.q, tokens)

// ---------- ảnh nhân vật ----------
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

const baseCfg = {
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
  labels: { left: names.M, right: `${names.B} & MONSTERS` },
  mountImg: toDataUrl(mountEntry?.idle ?? mountEntry?.run?.[0]),
  bossImg: toDataUrl(bossRel),
  monsterImgs: monsterRels.map(toDataUrl),
  fonts: { anton: fontUrl('Anton-Regular.ttf'), bebas: fontUrl('BebasNeue-Regular.ttf'), russo: fontUrl('RussoOne-Regular.ttf') },
}
if (!baseCfg.mountImg || !baseCfg.bossImg) console.log('  ! thiếu ảnh thú cưỡi hoặc boss, mở màn / kết thúc sẽ thiếu nhân vật')

// ---------- nội dung cảnh kết thúc ----------
function buildStats(kind) {
  const s = meta?.stats
  const pool = []
  const add = (id, label, value, fmt, note) => {
    if (Number.isFinite(value) && value > 0 && !pool.some((p) => p.id === id)) pool.push({ id, label, value: Math.round(value), fmt, note })
  }
  if (s) {
    add('kills', 'MONSTERS SLAIN', s.kills, 'int', 'IN ONE EPIC BATTLE')
    add('fled', 'MONSTERS RAN AWAY', s.fled, 'int', 'WAVING THE WHITE FLAG')
    add('boss', `${names.B} DEFEATED`, s.sunKills, 'int', 'TIMES THE BOSS WENT DOWN')
    add('score', 'FINAL SCORE', s.score, 'int', 'POINTS EARNED')
    add('coins', 'COINS COLLECTED', s.coins, 'int', 'SHINY COINS')
    add('time', 'BATTLE TIME', s.time, 'time', 'OF NON-STOP ACTION')
    if (s.stages > 1) add('stage', 'STAGES REACHED', Math.min(s.stage + 1, s.stages), 'int', `OUT OF ${s.stages}`)
    if (s.kills > 0 && s.time >= 20) add('kpm', 'KILLS PER MINUTE', s.kills / (s.time / 60), 'int', 'NON-STOP CARNAGE')
  }
  add('time', 'BATTLE TIME', Number(plan.duration), 'time', 'OF NON-STOP ACTION')
  add('types', 'MONSTER TYPES', plan.monsters?.length, 'int', 'FACED IN THIS BATTLE')
  const want = kind === 'ticker' ? 4 : 3
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const chosen = shuffled.slice(0, want)
  return pool.filter((p) => chosen.includes(p))
}

const channelRaw = String(args.channel ?? process.env.CHANNEL_NAME ?? '').trim()
const channel = channelRaw && channelRaw !== 'true' ? channelRaw.toUpperCase() : ''
const drawKinds = ['stamp', 'suspense', 'ko']
let outroKind = pick(winner === 'draw' ? drawKinds : OUTRO_KINDS, args['outro-style'], OUTRO_KINDS)
if (winner === 'draw' && !drawKinds.includes(outroKind)) outroKind = 'stamp'
const statsKind = pick(STATS_KINDS, args['stats-style'], STATS_KINDS)
const ctaKind = pick(CTA_KINDS, args['cta-style'], CTA_KINDS)
const statsTitle = pick(['BATTLE STATS', 'MATCH REPORT', 'BY THE NUMBERS', 'FIGHT RECAP'], null, [])
const answerTpl = winner === 'draw' ? pick(DRAW_ANSWERS, null, []) : (winner === 'mount' ? questionEntry.win : questionEntry.lose) ?? questionEntry.a
const outro = {
  kind: outroKind,
  statsKind,
  ctaKind,
  winner,
  question,
  answer: winner === 'draw' ? answerTpl : fill(answerTpl, tokens),
  statsTitle,
  stats: buildStats(statsKind),
  channel,
}

const ffmpeg = process.env.FFMPEG ?? 'ffmpeg'
const vf = `scale=${width}:${height}:flags=lanczos:in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p`
const encodeArgs = [
  '-c:v', 'libx264', '-preset', preset, '-crf', String(crf), '-profile:v', 'high', '-level', '5.2',
  '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
  '-g', String(fps * 2),
]

function run(cmd, a) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, a, { stdio: ['ignore', 'inherit', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} lỗi ${code}\n${err.slice(-1500)}`))))
  })
}

// Dựng một đoạn (mở màn hoặc kết thúc) thành file mp4 có tiếng.
async function renderSegment(mode, outMp4) {
  const frameDir = path.join(work, `${mode}_frames`)
  const wavPath = path.join(work, `${mode}.wav`)
  fs.rmSync(frameDir, { recursive: true, force: true })
  fs.mkdirSync(frameDir, { recursive: true })
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage', '--ignore-gpu-blocklist'] })
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } })
  page.on('pageerror', (e) => console.log(`[${mode} page error]`, e.message))
  await page.setContent('<!doctype html><html><body></body></html>')
  await page.addScriptTag({ path: path.join(here, 'intro', 'intro-page.js') })
  await page.addScriptTag({ path: path.join(here, 'intro', 'outro-page.js') })
  const { frames, duration } = await page.evaluate((c) => window.Intro.init(c), { ...baseCfg, mode, outro })
  for (let i = 0; i < frames; i++) {
    const b64 = await page.evaluate((t) => window.Intro.renderFrame(t), i / fps)
    fs.writeFileSync(path.join(frameDir, `f${String(i).padStart(6, '0')}.jpg`), Buffer.from(b64, 'base64'))
    if (i % 60 === 0) console.log(`  khung ${mode} ${i}/${frames}`)
  }
  fs.writeFileSync(wavPath, Buffer.from(await page.evaluate(() => window.Intro.renderAudio()), 'base64'))
  await browser.close()
  await run(ffmpeg, [
    '-y', '-hide_banner', '-nostdin', '-loglevel', 'error',
    '-framerate', String(fps), '-i', path.join(frameDir, 'f%06d.jpg'), '-i', wavPath,
    '-vf', vf, '-r', String(fps), ...encodeArgs,
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart', outMp4,
  ])
  fs.rmSync(frameDir, { recursive: true, force: true })
  fs.rmSync(wavPath, { force: true })
  return duration
}


const TEASER_LINES = ['WHO WILL SURVIVE?', 'ONLY ONE WALKS AWAY', 'THIS GETS INTENSE...', 'CAN IT HOLD ON?', 'WAIT FOR THE ENDING!', 'NO ONE SAW THIS COMING']
const TEASER_TAILS = ['WATCH TILL THE END', 'COMMENT YOUR PICK', 'WHO WINS? GUESS NOW']

async function renderTeaser(outMp4) {
  const ffprobe = process.env.FFPROBE ?? 'ffprobe'
  const dur = spawnSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mainFile], { encoding: 'utf8' })
  const mainDur = parseFloat(dur.stdout)
  if (!(mainDur > 12)) return 0
  const au = spawnSync(ffprobe, ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', mainFile], { encoding: 'utf8' })
  const hasAudio = au.status === 0 && au.stdout.trim() !== ''

  // Đoạn căng nhất nằm ngay trước khoảnh khắc ngã ngũ (cuối trận) nhưng dừng trước khi lộ bên thắng.
  const SRC = 2.0
  const SPEED = 0.8
  const outSec = SRC / SPEED
  const back = meta?.style === 'dominant' ? 9.5 : 8.2
  const t0 = Math.max(1, Math.min(mainDur - back, mainDur - SRC - 2))

  const r = mulberry((Number(plan.seed) || 1) ^ 0x7ea5)
  const headline = TEASER_LINES[Math.floor(r() * TEASER_LINES.length)]
  const tail = TEASER_TAILS[Math.floor(r() * TEASER_TAILS.length)]
  const headFile = path.join(work, 'teaser-head.txt')
  const tailFile = path.join(work, 'teaser-tail.txt')
  fs.writeFileSync(headFile, headline)
  fs.writeFileSync(tailFile, tail)
  const font = path.join(appDir, 'assets', 'fonts', 'Anton-Regular.ttf')
  const big = Math.round(height * 0.095)
  const small = Math.round(height * 0.05)
  const vfTeaser = [
    `setpts=PTS/${SPEED}`,
    'eq=contrast=1.12:saturation=1.3',
    'vignette=PI/4',
    `fps=${fps}`,
    'fade=t=in:st=0:d=0.12:color=white',
    `drawtext=fontfile=${font}:textfile=${headFile}:fontsize=${big}:fontcolor=white:borderw=6:bordercolor=black` +
      `:box=1:boxcolor=0xE11D48@0.9:boxborderw=${Math.round(big * 0.3)}:x=(w-text_w)/2:y=h*0.12`,
    `drawtext=fontfile=${font}:textfile=${tailFile}:fontsize=${small}:fontcolor=0xFDE047:borderw=4:bordercolor=black` +
      ":x=(w-text_w)/2:y=h*0.84:enable='lt(mod(t,0.8),0.55)'",
    `fade=t=out:st=${(outSec - 0.2).toFixed(2)}:d=0.2`,
    'format=yuv420p',
  ].join(',')
  const af = `atempo=${SPEED},aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.05,afade=t=out:st=${(outSec - 0.3).toFixed(2)}:d=0.3`
  await run(ffmpeg, [
    '-y', '-hide_banner', '-nostdin', '-loglevel', 'error',
    '-ss', t0.toFixed(2), '-t', String(SRC), '-i', mainFile,
    '-vf', vfTeaser, ...(hasAudio ? ['-af', af] : ['-an']), '-r', String(fps), ...encodeArgs,
    ...(hasAudio ? ['-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2'] : []),
    '-t', outSec.toFixed(2), '-movflags', '+faststart', outMp4,
  ])
  console.log(`Teaser: "${headline}" cắt từ ${t0.toFixed(1)}s (${outSec.toFixed(1)}s, chậm ${SPEED}x)`)
  return outSec
}

const teaserMp4 = path.join(work, 'teaser.mp4')
let teaserSeconds = 0

const introMp4 = path.join(work, 'intro.mp4')
const outroMp4 = path.join(work, 'outro.mp4')
let introSeconds = 0
let outroSeconds = 0

if (wantTeaser) {
  try {
    teaserSeconds = await renderTeaser(teaserMp4)
  } catch (e) {
    console.log('  ! không dựng được teaser, bỏ qua:', e.message.split('\n')[0])
    teaserSeconds = 0
  }
}
if (wantIntro) {
  console.log(`Mở màn: kiểu ${style}, đồng hồ ${countdown}, câu hỏi "${question}", "${readyText}" -> "${goText}"`)
  introSeconds = await renderSegment('intro', introMp4)
}
if (wantOutro) {
  const goldenSec = meta?.stats?.golden
  if (Number.isFinite(goldenSec)) {
    outro.golden = teaserSeconds + introSeconds + goldenSec
    console.log(`Gà vàng xuất hiện ở ${outro.golden.toFixed(1)}s trong video cuối`)
  }
  console.log(`Kết thúc: kiểu ${outroKind}, thống kê ${statsKind}, kêu gọi ${ctaKind}, bên thắng ${winner}, trả lời "${outro.answer}"${meta?.stats ? '' : ' (không có thống kê thật, dùng thông tin kế hoạch)'}`)
  outroSeconds = await renderSegment('outro', outroMp4)
}

// ---------- ghép: [mở màn] + video chính + [kết thúc] ----------
const parts = [teaserSeconds > 0 && teaserMp4, wantIntro && introMp4, mainFile, wantOutro && outroMp4].filter(Boolean)
const merged = path.join(work, 'merged.mp4')
const probe = spawnSync(process.env.FFPROBE ?? 'ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', mainFile], { encoding: 'utf8' })
const mainHasAudio = probe.status === 0 && probe.stdout.trim() !== ''

let ok = false
if (mainHasAudio) {
  const list = path.join(work, 'concat.txt')
  fs.writeFileSync(list, parts.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n') + '\n')
  try {
    await run(ffmpeg, ['-y', '-hide_banner', '-nostdin', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', merged])
    ok = true
  } catch (e) {
    console.log('  ghép nhanh (copy) lỗi, chuyển sang ghép có mã hóa lại:', e.message.split('\n')[0])
  }
}
if (!ok) {
  const inputs = parts.flatMap((p) => ['-i', p])
  const norm = parts.map((_, i) => `[${i}:v]scale=${width}:${height}:flags=lanczos,fps=${fps},setsar=1,format=yuv420p[v${i}]`).join(';')
  if (mainHasAudio) {
    const an = parts.map((_, i) => `[${i}:a]aresample=48000,aformat=channel_layouts=stereo[a${i}]`).join(';')
    const seq = parts.map((_, i) => `[v${i}][a${i}]`).join('')
    await run(ffmpeg, [
      '-y', '-hide_banner', '-nostdin', '-loglevel', 'error', ...inputs,
      '-filter_complex', `${norm};${an};${seq}concat=n=${parts.length}:v=1:a=1[v][a]`,
      '-map', '[v]', '-map', '[a]', ...encodeArgs, '-r', String(fps),
      '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', merged,
    ])
  } else {
    const seq = parts.map((_, i) => `[v${i}]`).join('')
    await run(ffmpeg, [
      '-y', '-hide_banner', '-nostdin', '-loglevel', 'error', ...inputs,
      '-filter_complex', `${norm};${seq}concat=n=${parts.length}:v=1:a=0[v]`,
      '-map', '[v]', ...encodeArgs, '-r', String(fps), '-an', '-movflags', '+faststart', merged,
    ])
  }
}
fs.renameSync(merged, mainFile)
fs.rmSync(teaserMp4, { force: true })
fs.rmSync(introMp4, { force: true })
fs.rmSync(outroMp4, { force: true })

if (meta) {
  meta.baseDuration = meta.baseDuration ?? meta.duration
  meta.duration = Math.round(meta.baseDuration + teaserSeconds + introSeconds + outroSeconds)
  if (Number.isFinite(meta.stats?.golden)) meta.goldenChicken = { seconds: Math.round((teaserSeconds + introSeconds + meta.stats.golden) * 10) / 10 }
  if (teaserSeconds > 0) meta.teaser = { seconds: teaserSeconds }
  if (wantIntro) meta.intro = { style, countdown, question, ready: readyText, go: goText, seconds: introSeconds }
  if (wantOutro) meta.outro = { kind: outroKind, stats: statsKind, cta: ctaKind, winner, answer: outro.answer, channel: channel || null, seconds: outroSeconds }
  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2))
}
console.log(`Đã ghép ${[teaserSeconds > 0 && 'teaser', wantIntro && 'mở màn', wantOutro && 'kết thúc'].filter(Boolean).join(' + ')} vào ${path.basename(mainFile)} (${(fs.statSync(mainFile).size / 1e6).toFixed(1)} MB)`)
