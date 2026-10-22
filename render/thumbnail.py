"""Tạo thumbnail 1280x720 tự động từ video đã dựng: khung hình VS + chữ lớn, màu rực, dưới 2MB."""
from __future__ import annotations

import random
import subprocess
from pathlib import Path

from .metadata import pretty

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "app" / "assets" / "fonts" / "Anton-Regular.ttf"
W, H = 1280, 720
MAX_BYTES = 2 * 1024 * 1024  # giới hạn của YouTube

HEADLINES = ["WHO WINS?", "WHO SURVIVES?", "YOU WON'T GUESS", "ONLY ONE WINS", "NO WAY IT WINS?"]
ACCENTS = ["0xFACC15", "0xFB923C", "0x22D3EE", "0xF472B6"]


def _run(cmd: list[str]) -> str:
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{cmd[0]} lỗi: {r.stderr[-1000:]}")
    return r.stdout


def _duration(mp4: Path) -> float:
    return float(_run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                       "-of", "csv=p=0", str(mp4)]).strip() or 0)


def frame_time(meta: dict, duration: float) -> float:
    """Khung hình hai nhân vật đối mặt cùng câu hỏi: nằm sau teaser, ở nửa đầu của intro."""
    teaser = float((meta.get("teaser") or {}).get("seconds") or 0)
    if meta.get("intro"):
        t = teaser + 2.4
    else:
        t = duration * 0.35
    return max(0.5, min(t, duration - 1))


def _short(name: str, limit: int = 16) -> str:
    name = (name or "").upper().strip()
    return name if len(name) <= limit else name[: limit - 1].rstrip() + "."


def build_thumbnail(mp4: Path, meta: dict, out_jpg: Path, work: Path) -> Path:
    work.mkdir(parents=True, exist_ok=True)
    rng = random.Random(int(meta.get("seed") or 1) ^ 0x7B)
    headline = rng.choice(HEADLINES)
    accent = rng.choice(ACCENTS)
    mount = _short(pretty(str(meta.get("mount", ""))) or "HERO")
    boss = _short(pretty(str(meta.get("boss", ""))) or "BOSS")

    head_txt, vs_txt = work / "thumb-head.txt", work / "thumb-vs.txt"
    head_txt.write_text(headline, encoding="utf-8")
    vs_txt.write_text(f"{mount}  VS  {boss}", encoding="utf-8")

    t = frame_time(meta, _duration(mp4))
    big, mid = 150, 70
    font = str(FONT)
    vf = ",".join([
        f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}",
        "eq=contrast=1.18:saturation=1.45:brightness=0.02",
        "unsharp=5:5:0.8",
        "vignette=PI/5",
        # dải tối ở trên và dưới để chữ luôn đọc được
        f"drawbox=x=0:y=0:w={W}:h=250:color=black@0.55:t=fill",
        f"drawbox=x=0:y={H - 150}:w={W}:h=150:color=black@0.70:t=fill",
        f"drawbox=x=0:y={H - 150}:w={W}:h=8:color={accent}:t=fill",
        f"drawtext=fontfile={font}:textfile={head_txt}:fontsize={big}:fontcolor={accent}"
        f":borderw=9:bordercolor=black:x=(w-text_w)/2:y=48:shadowx=6:shadowy=6:shadowcolor=black@0.8",
        f"drawtext=fontfile={font}:textfile={vs_txt}:fontsize={mid}:fontcolor=white"
        f":borderw=6:bordercolor=black:x=(w-text_w)/2:y=h-120",
    ])
    out_jpg.parent.mkdir(parents=True, exist_ok=True)
    for q in (3, 6, 10, 15):  # tăng nén dần cho tới khi dưới 2MB
        _run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", f"{t:.2f}", "-i", str(mp4),
              "-frames:v", "1", "-vf", vf, "-q:v", str(q), str(out_jpg)])
        if out_jpg.stat().st_size <= MAX_BYTES:
            break
    return out_jpg
