"""Chọn ngẫu nhiên chất liệu từ host, giải nén vào app/game và ghi plan.json cho game gốc render."""
from __future__ import annotations

import argparse
import json
import os
import random
import sys
from pathlib import Path

from .assets import HostClient

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"


def manifest_paths(kind: str, entry: dict) -> list[str]:
    if kind == "scenery":
        return [layer["src"] for layer in entry["layers"].values()]
    if kind == "mount":
        return [*entry["run"], entry["idle"], entry["up"], entry["down"]]
    return [*entry["frames"], *entry.get("attack", [])]


def try_pick(client: HostClient, kind: str, files: list[str], rng: random.Random, manifest: dict,
             key: str, game: Path, count: int = 1) -> list[str]:
    """Thử lần lượt cho tới khi đủ `count` gói hợp lệ (có trong manifest và đủ ảnh sau khi giải nén)."""
    chosen: list[str] = []
    entries = {e["id"]: e for e in manifest[key]} if key in manifest else {}
    for f in rng.sample(files, len(files)):
        if len(chosen) >= count:
            break
        ident = Path(f).stem
        try:
            client.fetch_into(kind, f, game)
            if kind == "boss":
                ok = True
            else:
                if ident not in entries:
                    raise RuntimeError("id không có trong manifest game")
                missing = [p for p in manifest_paths(kind, entries[ident]) if not (game / p).is_file()]
                if missing:
                    raise RuntimeError(f"thiếu {len(missing)} ảnh, ví dụ {missing[0]}")
                ok = True
            if ok:
                chosen.append(f)
        except Exception as exc:  # noqa: BLE001
            print(f"  ! bỏ qua {kind} {f}: {exc}")
    return chosen


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default=os.environ.get("ASSET_HOST_URL", ""),
                    help="URL host (https://…) hoặc thư mục cục bộ")
    ap.add_argument("--token", default=os.environ.get("ASSET_HOST_TOKEN", ""))
    ap.add_argument("--plan", default="plan.json")
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--min-sec", type=int, default=180)
    ap.add_argument("--max-sec", type=int, default=360)
    ap.add_argument("--duration", type=float, default=None, help="Ép thời lượng (giây) để test")
    ap.add_argument("--cache", default=".cache")
    args = ap.parse_args()
    if not args.host:
        sys.exit("Thiếu --host hoặc biến môi trường ASSET_HOST_URL")

    seed = args.seed if args.seed is not None else random.SystemRandom().randrange(1, 2**31)
    rng = random.Random(seed)
    duration = int(args.duration or rng.randint(args.min_sec, args.max_sec))

    game = APP / "game"
    manifest = json.loads((game / "manifest.json").read_text(encoding="utf-8"))
    client = HostClient(args.host, args.token, Path(args.cache))
    listing = client.list_all()
    for kind, files in listing.items():
        print(f"  {kind}: {len(files)} gói")
        if not files:
            sys.exit(f"Thư mục '{kind}' trên host đang trống")

    scenery = try_pick(client, "scenery", listing["scenery"], rng, manifest, "sceneries", game)
    mount = try_pick(client, "mount", listing["mount"], rng, manifest, "mounts", game)
    boss = try_pick(client, "boss", listing["boss"], rng, manifest, "bosses", game)
    monsters = try_pick(client, "monster", listing["monster"], rng, manifest, "monsters", game, rng.randint(3, 5))
    if not (scenery and mount and boss and monsters):
        sys.exit("Không chọn đủ cảnh / thú cưỡi / boss / quái hợp lệ từ host")

    ids = lambda names: [Path(n).stem for n in names]  # noqa: E731
    manifest["sceneries"] = [e for e in manifest["sceneries"] if e["id"] in ids(scenery)]
    manifest["mounts"] = [e for e in manifest["mounts"] if e["id"] in ids(mount)]
    manifest["monsters"] = [e for e in manifest["monsters"] if e["id"] in ids(monsters)]
    (game / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False), encoding="utf-8")

    plan = {
        "seed": seed,
        "duration": duration,
        "scenery": scenery[0],
        "mount": mount[0],
        "boss": boss[0],
        "monsters": monsters,
        "musicSeed": rng.randrange(1_000_000),
    }
    Path(args.plan).write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Seed {seed} | {duration}s | cảnh {scenery[0]} | thú cưỡi {mount[0]} | boss {boss[0]} | quái {monsters}")


if __name__ == "__main__":
    main()
