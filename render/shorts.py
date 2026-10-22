"""Dựng 2 loại YouTube Short dọc 9:16 từ video dài.

- predict  : "Đoán xem ai thắng" - chỉ dùng phần căng thẳng, KHÔNG lộ kết quả, kết bằng câu hỏi bình chọn 1/2
             để kéo bình luận và dẫn người xem sang video dài lấy đáp án.
- highlight: "Khoảnh khắc quyết định" - dồn dập rồi chậm (slow-mo) đúng cú ngã ngũ, hiện thẳng bên thắng.
"""
from __future__ import annotations

import json
import random
import subprocess
import textwrap
from pathlib import Path

from .metadata import pretty

W, H, FPS = 1080, 1920, 30
KINDS = ("predict", "highlight")

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "app" / "assets" / "fonts" / "Anton-Regular.ttf"
FONT_ALT = ROOT / "app" / "assets" / "fonts" / "BebasNeue-Regular.ttf"
BANNER_COLORS = ["0xE11D48", "0xF59E0B", "0x7C3AED", "0x0EA5E9", "0xDC2626", "0x16A34A", "0xEC4899", "0x0891B2"]

PREDICT_HOOKS = ["WHO WINS?", "LOOK AT THIS!", "THEY ARE COMING", "IT GETS WORSE...", "CAN IT SURVIVE?"]
HIGHLIGHT_HOOKS = ["IT ALL COMES DOWN TO THIS", "NO WAY!", "HOLD ON...", "THE FINAL BLOW!"]


def _run(cmd: list[str]) -> str:
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{cmd[0]} lỗi: {r.stderr[-1500:]}")
    return r.stdout


def probe(mp4: Path) -> tuple[float, bool]:
    out = _run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type",
                "-of", "json", str(mp4)])
    data = json.loads(out)
    has_audio = any(s.get("codec_type") == "audio" for s in data.get("streams", []))
    return float(data["format"]["duration"]), has_audio


def battle_window(meta: dict, total: float) -> tuple[float, float]:
    """Khoảng thời gian trận đánh thật trong video đã ghép (bỏ teaser, mở màn VS và cảnh kết thúc)."""
    lead = float((meta.get("teaser") or {}).get("seconds") or 0) + float((meta.get("intro") or {}).get("seconds") or 0)
    tail = float((meta.get("outro") or {}).get("seconds") or 0)
    return lead, max(lead + 20.0, total - tail)


# Mỗi clip: (thời điểm bắt đầu, độ dài nguồn, tốc độ). Tốc độ < 1 là chậm.
Clip = tuple[float, float, float]


def pick_predict_clips(meta: dict, total: float, rng: random.Random, count: int = 6) -> list[Clip]:
    """Chỉ lấy ~78% đầu của trận: vẫn căng, chưa ngã ngũ nên không lộ ai thắng. Clip cuối sát mốc đó."""
    start, end = battle_window(meta, total)
    span = end - start
    last_ok = start + span * 0.78
    lo_all = start + 3.0
    clips: list[Clip] = []
    for i in range(count):
        dur = rng.uniform(2.4, 3.2)
        lo = lo_all + (last_ok - lo_all) * i / count
        hi = lo_all + (last_ok - lo_all) * (i + 1) / count - dur
        t = rng.uniform(lo, max(lo, hi))
        if i == count - 1:
            t = last_ok - dur
        clips.append((round(max(0.0, min(t, total - dur - 0.1)), 2), round(dur, 2), 1.0))
    return clips


def pick_highlight_clips(meta: dict, total: float, rng: random.Random) -> list[Clip]:
    """Dồn dập ở phần cuối trận rồi chậm hẳn ở cú ngã ngũ (nằm ~3-4s trước hết trận)."""
    start, end = battle_window(meta, total)
    span = end - start
    clips: list[Clip] = []
    for frac in (0.5, 0.66, 0.8):
        dur = rng.uniform(2.2, 2.8)
        t = start + span * frac - dur / 2
        clips.append((round(max(0.0, t), 2), round(dur, 2), 1.0))
    clips.append((round(max(0.0, end - 8.4), 2), 2.4, 1.0))    # máu thấp, sắp ngã ngũ
    clips.append((round(max(0.0, end - 5.6), 2), 2.6, 0.55))   # cú quyết định, quay chậm
    return clips


def _banner(work: Path, name: str, text: str, wrap: int = 16) -> Path:
    path = work / f"{name}.txt"
    path.write_text("\n".join(textwrap.wrap(text, wrap)) or text, encoding="utf-8")
    return path


def _banner_lines(work: Path, name: str, lines: list[str]) -> Path:
    path = work / f"{name}.txt"
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def _drawtext(textfile: Path, *, size: int, y: str, color: str, start: float, end: float,
              fontcolor: str = "white", enable: str | None = None) -> str:
    font = FONT if FONT.exists() else FONT_ALT
    cond = enable or "between(t,%.2f,%.2f)" % (start, end)
    return (
        f"drawtext=fontfile={font}:textfile={textfile}:fontsize={size}:fontcolor={fontcolor}"
        f":borderw=5:bordercolor=black:box=1:boxcolor={color}@0.88:boxborderw=26"
        f":x=(w-text_w)/2:y={y}:line_spacing=10"
        f":enable='{cond}'"
    )


def _short_name(zip_name: str, limit: int = 14) -> str:
    return (pretty(str(zip_name or "")) or "?").upper()[:limit].strip()


def _banners(kind: str, meta: dict, info: dict, clips: list[Clip], work: Path) -> tuple[list[tuple[Path, int, str, str]], str]:
    """Trả về (danh sách biểu ngữ theo từng clip: file, cỡ chữ, vị trí y, màu) và dòng chữ chân trang."""
    mount, boss = _short_name(meta.get("mount")), _short_name(meta.get("boss"))
    hooks = list(info.get("hooks") or [])
    items: list[tuple[Path, int, str, str]] = []
    last = len(clips) - 1

    if kind == "predict":
        pool = PREDICT_HOOKS + hooks
        for i in range(last):
            items.append((_banner(work, f"hook{i}", pool[i % len(pool)]), 104, "250", BANNER_COLORS[i % len(BANNER_COLORS)]))
        vote = _banner_lines(work, "vote", ["WHO WINS?", f"1  {mount}", f"2  {boss}", "COMMENT 1 OR 2"])
        items.append((vote, 84, "300", "0xE11D48"))
        return items, "ANSWER IN THE FULL VIDEO"

    pool = HIGHLIGHT_HOOKS
    for i in range(last):
        items.append((_banner(work, f"hook{i}", pool[i % len(pool)]), 104, "250", BANNER_COLORS[(i + 2) % len(BANNER_COLORS)]))
    winner = (meta.get("outro") or {}).get("winner")
    if not winner:
        winner = {"lose": "boss", "timeup": "draw"}.get(str(meta.get("result")), "mount")
    verdict = "IT'S A DRAW!" if winner == "draw" else f"{boss if winner == 'boss' else mount} WINS!"
    items.append((_banner(work, "verdict", verdict, 14), 112, "300", "0x16A34A" if winner != "boss" else "0xE11D48"))
    return items, str(info.get("end_cta") or "WATCH THE FULL BATTLE")


def build_short(mp4: Path, meta: dict, info: dict, out: Path, work: Path, kind: str = "highlight") -> Path:
    """Tạo Short 1080x1920 từ video dài. `kind` là 'predict' (không lộ kết quả) hoặc 'highlight' (cú quyết định)."""
    if kind not in KINDS:
        raise ValueError(f"kind phải là một trong {KINDS}")
    work.mkdir(parents=True, exist_ok=True)
    total, has_audio = probe(mp4)
    rng = random.Random(f"{meta.get('seed', '')}-{kind}-{int(total)}")
    clips = pick_predict_clips(meta, total, rng) if kind == "predict" else pick_highlight_clips(meta, total, rng)

    cmd = ["ffmpeg", "-y", "-hide_banner", "-nostdin", "-loglevel", "error"]
    for start, dur, _ in clips:
        cmd += ["-ss", f"{start}", "-t", f"{dur}", "-i", str(mp4)]

    parts, labels = [], ""
    out_durs: list[float] = []
    for i, (_, dur, speed) in enumerate(clips):
        od = dur / speed
        out_durs.append(od)
        parts.append(
            f"[{i}:v]split=2[bg{i}][fg{i}];"
            f"[bg{i}]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=30:6,eq=brightness=-0.18[b{i}];"
            f"[fg{i}]scale={W}:-2[f{i}];"
            f"[b{i}][f{i}]overlay=(W-w)/2:(H-h)/2,fps={FPS},setsar=1,format=yuv420p,setpts=(PTS-STARTPTS)/{speed}[v{i}]"
        )
        if has_audio:
            parts.append(
                f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,asetpts=PTS-STARTPTS"
                + (f",atempo={speed}" if speed != 1 else "")
                + f",afade=t=in:d=0.08,afade=t=out:st={max(od - 0.12, 0):.2f}:d=0.12[a{i}]"
            )
            labels += f"[v{i}][a{i}]"
        else:
            labels += f"[v{i}]"
    parts.append(f"{labels}concat=n={len(clips)}:v=1:a={1 if has_audio else 0}[vc]" + ("[ac]" if has_audio else ""))

    banners, footer = _banners(kind, meta, info, clips, work)
    chain, cursor = [], 0.0
    for i, od in enumerate(out_durs):
        tf, size, y, color = banners[i]
        chain.append(_drawtext(tf, size=size, y=y, color=color, start=cursor + 0.05, end=cursor + od - 0.05))
        cursor += od
    total_out = cursor
    tail = _banner(work, "tail", footer, 40)
    chain.append(
        _drawtext(tail, size=64, y="1500", color="0x111827", start=0, end=total_out, fontcolor="0xFDE047",
                  enable="lt(mod(t,1.2),0.85)")
    )
    chain.append(f"fade=t=in:d=0.15,fade=t=out:st={max(total_out - 0.25, 0):.2f}:d=0.25")
    parts.append(f"[vc]{','.join(chain)}[vout]")

    cmd += ["-filter_complex", ";".join(parts), "-map", "[vout]"]
    if has_audio:
        cmd += ["-map", "[ac]", "-c:a", "aac", "-b:a", "160k"]
    cmd += ["-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-r", str(FPS),
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-t", f"{total_out:.2f}", str(out)]
    _run(cmd)
    print(f"Đã dựng Short {kind} {out.name}: {len(clips)} phân cảnh, {total_out:.1f}s")
    return out
