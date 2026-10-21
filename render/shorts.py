"""Cắt các phân cảnh hấp dẫn từ video dài, ghép thành YouTube Short dọc 9:16 kèm biểu ngữ thu hút."""
from __future__ import annotations

import json
import random
import subprocess
import textwrap
from pathlib import Path

W, H, FPS = 1080, 1920, 30
CLIPS = 8
CLIP_MIN, CLIP_MAX = 2.4, 3.4
END_CARD = 2.6

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "app" / "assets" / "fonts" / "Anton-Regular.ttf"
FONT_ALT = ROOT / "app" / "assets" / "fonts" / "BebasNeue-Regular.ttf"
BANNER_COLORS = ["0xE11D48", "0xF59E0B", "0x7C3AED", "0x0EA5E9", "0xDC2626", "0x16A34A", "0xEC4899", "0x0891B2"]


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


def pick_clips(meta: dict, total: float, rng: random.Random) -> list[tuple[float, float]]:
    """Chọn các đoạn rải đều trong phần trận đánh (bỏ mở màn/kết thúc); đoạn cuối lấy gần cao trào."""
    intro = float((meta.get("intro") or {}).get("seconds") or 0)
    outro = float((meta.get("outro") or {}).get("seconds") or 0)
    start = intro + 3.0
    end = max(start + CLIPS * CLIP_MAX, total - outro - 2.0)
    span = end - start
    clips: list[tuple[float, float]] = []
    for i in range(CLIPS):
        dur = rng.uniform(CLIP_MIN, CLIP_MAX)
        lo = start + span * i / CLIPS
        hi = start + span * (i + 1) / CLIPS - dur
        t = rng.uniform(lo, max(lo, hi))
        if i == CLIPS - 1:
            t = max(lo, end - dur - 1.0)
        t = max(0.0, min(t, total - dur - 0.1))
        clips.append((round(t, 2), round(dur, 2)))
    return clips


def _banner(work: Path, name: str, text: str, wrap: int = 16) -> Path:
    path = work / f"{name}.txt"
    path.write_text("\n".join(textwrap.wrap(text, wrap)) or text, encoding="utf-8")
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


def build_short(mp4: Path, meta: dict, info: dict, out: Path, work: Path) -> Path:
    """Tạo Short 1080x1920 (~25s) từ video dài. Trả về đường dẫn file."""
    work.mkdir(parents=True, exist_ok=True)
    total, has_audio = probe(mp4)
    rng = random.Random(f"{meta.get('seed', '')}-{int(total)}")
    clips = pick_clips(meta, total, rng)
    hooks = list(info.get("hooks") or [])
    while len(hooks) < len(clips):
        hooks.append("WATCH THIS!")

    cmd = ["ffmpeg", "-y", "-hide_banner", "-nostdin", "-loglevel", "error"]
    for start, dur in clips:
        cmd += ["-ss", f"{start}", "-t", f"{dur}", "-i", str(mp4)]

    parts, labels = [], ""
    for i, (_, dur) in enumerate(clips):
        parts.append(
            f"[{i}:v]split=2[bg{i}][fg{i}];"
            f"[bg{i}]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=30:6,eq=brightness=-0.18[b{i}];"
            f"[fg{i}]scale={W}:-2[f{i}];"
            f"[b{i}][f{i}]overlay=(W-w)/2:(H-h)/2,fps={FPS},setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v{i}]"
        )
        if has_audio:
            parts.append(
                f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,asetpts=PTS-STARTPTS,"
                f"afade=t=in:d=0.08,afade=t=out:st={max(dur - 0.12, 0):.2f}:d=0.12[a{i}]"
            )
            labels += f"[v{i}][a{i}]"
        else:
            labels += f"[v{i}]"
    parts.append(f"{labels}concat=n={len(clips)}:v=1:a={1 if has_audio else 0}[vc]" + ("[ac]" if has_audio else ""))

    # Biểu ngữ: mỗi cảnh một câu gợi ý, cảnh cuối là lời kêu gọi xem video chính + nút nhấp nháy ở đáy.
    chain, cursor = [], 0.0
    for i, (_, dur) in enumerate(clips):
        last = i == len(clips) - 1
        text = info.get("end_cta") if last else hooks[i]
        tf = _banner(work, f"hook{i}", text or "WATCH THIS!")
        color = "0xE11D48" if last else BANNER_COLORS[i % len(BANNER_COLORS)]
        chain.append(_drawtext(tf, size=104 if not last else 92, y="250" if not last else "230",
                               color=color, start=cursor + 0.05, end=cursor + dur - 0.05))
        cursor += dur
    total_out = cursor
    tail = _banner(work, "tail", "WATCH THE FULL VIDEO", 40)
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
    print(f"Đã dựng Short {out.name}: {len(clips)} phân cảnh, {total_out:.1f}s")
    return out
