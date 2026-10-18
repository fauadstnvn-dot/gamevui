"""Chọn ngẫu nhiên chất liệu từ host -> dựng video MP4 2K bằng FFmpeg."""
from __future__ import annotations

import argparse
import json
import os
import random
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from .assets import (HostClient, load_boss, load_monster, load_mount, load_scenery)
from .scene import Scene


def find_ffmpeg() -> str:
    path = shutil.which("ffmpeg")
    if path:
        return path
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("Không tìm thấy FFmpeg. Cài bằng: sudo apt-get install -y ffmpeg")


def pick_monsters(client: HostClient, files: list[str], want: int, rng: random.Random):
    """Thử lần lượt cho tới khi đủ số quái hợp lệ (bỏ qua zip lỗi)."""
    chosen, names = [], []
    for f in rng.sample(files, len(files)):
        if len(chosen) >= want:
            break
        try:
            chosen.append(load_monster(client.fetch("monster", f)))
            names.append(f)
        except Exception as exc:  # noqa: BLE001
            print(f"  ! bỏ qua quái {f}: {exc}")
    return chosen, names


def pick_one(client: HostClient, kind: str, files: list[str], loader, rng: random.Random):
    for f in rng.sample(files, len(files)):
        try:
            return loader(client.fetch(kind, f)), f
        except Exception as exc:  # noqa: BLE001
            print(f"  ! bỏ qua {kind} {f}: {exc}")
    sys.exit(f"Không có file zip hợp lệ nào cho loại '{kind}'")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default=os.environ.get("ASSET_HOST_URL", ""),
                    help="URL host (https://…) hoặc thư mục cục bộ")
    ap.add_argument("--token", default=os.environ.get("ASSET_HOST_TOKEN", ""))
    ap.add_argument("--out", default="output")
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--width", type=int, default=2560)
    ap.add_argument("--height", type=int, default=1440)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--min-sec", type=int, default=180)
    ap.add_argument("--max-sec", type=int, default=360)
    ap.add_argument("--duration", type=float, default=None, help="Ép thời lượng (giây) để test")
    ap.add_argument("--crf", type=int, default=20)
    ap.add_argument("--preset", default="veryfast")
    ap.add_argument("--cache", default=".cache")
    args = ap.parse_args()
    if not args.host:
        sys.exit("Thiếu --host hoặc biến môi trường ASSET_HOST_URL")

    seed = args.seed if args.seed is not None else random.SystemRandom().randrange(2**31)
    rng = random.Random(seed)
    duration = args.duration or rng.randint(args.min_sec, args.max_sec)
    print(f"Seed {seed} | thời lượng {duration:.0f}s | {args.width}x{args.height}@{args.fps}")

    client = HostClient(args.host, args.token, Path(args.cache))
    listing = client.list_all()
    for kind, files in listing.items():
        print(f"  {kind}: {len(files)} gói")
        if not files:
            sys.exit(f"Thư mục '{kind}' trên host đang trống")

    scenery, f_scenery = pick_one(client, "scenery", listing["scenery"], load_scenery, rng)
    mount, f_mount = pick_one(client, "mount", listing["mount"], load_mount, rng)
    boss, f_boss = pick_one(client, "boss", listing["boss"], load_boss, rng)
    want = rng.randint(3, 5)
    monsters, f_monsters = pick_monsters(client, listing["monster"], want, rng)
    if not monsters:
        sys.exit("Không tải được quái vật nào")
    print(f"Cảnh: {f_scenery} | Thú cưỡi: {f_mount} | Boss: {f_boss} | Quái: {f_monsters}")

    scene = Scene(args.width, args.height, args.fps, duration, scenery, mount, boss, monsters, rng)

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    mp4 = out_dir / f"video-{stamp}-{seed}.mp4"

    cmd = [
        find_ffmpeg(), "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{args.width}x{args.height}",
        "-r", str(args.fps), "-i", "-",
        "-c:v", "libx264", "-preset", args.preset, "-crf", str(args.crf),
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(mp4),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    total = int(duration * args.fps)
    started = time.time()
    try:
        for i in range(total):
            proc.stdin.write(scene.render(i / args.fps).tobytes())
            if i % (args.fps * 10) == 0:
                done = i / total
                eta = (time.time() - started) / done - (time.time() - started) if done else 0
                print(f"  {done * 100:5.1f}%  còn khoảng {eta / 60:.1f} phút", flush=True)
    finally:
        proc.stdin.close()
        code = proc.wait()
    if code != 0:
        sys.exit(f"FFmpeg lỗi (mã {code})")

    meta = {
        "seed": seed, "duration": duration, "resolution": f"{args.width}x{args.height}",
        "fps": args.fps, "scenery": f_scenery, "mount": f_mount, "boss": f_boss,
        "monsters": f_monsters, "file": mp4.name,
    }
    mp4.with_suffix(".json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Xong: {mp4} ({mp4.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
