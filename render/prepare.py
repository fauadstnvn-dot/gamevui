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
    if kind in ("scenery", "priority_scenery"):
        return [layer["src"] for layer in entry["layers"].values()]
    if kind == "mount":
        return [*entry["run"], entry["idle"], entry["up"], entry["down"]]
    return [*entry["frames"], *entry.get("attack", [])]


def webp_size(path: Path) -> list[int]:
    """Đọc kích thước ảnh webp (không phụ thuộc thư viện ngoài)."""
    d = path.read_bytes()[:64]
    if d[:4] != b"RIFF" or d[8:12] != b"WEBP":
        raise RuntimeError(f"{path.name}: không phải webp")
    t = d[12:16]
    if t == b"VP8X":
        return [int.from_bytes(d[24:27], "little") + 1, int.from_bytes(d[27:30], "little") + 1]
    if t == b"VP8L":
        b = int.from_bytes(d[21:25], "little")
        return [(b & 0x3FFF) + 1, ((b >> 14) & 0x3FFF) + 1]
    if t == b"VP8 ":
        return [int.from_bytes(d[26:28], "little") & 0x3FFF, int.from_bytes(d[28:30], "little") & 0x3FFF]
    raise RuntimeError(f"{path.name}: webp không nhận dạng được")


def register_scenery(ident: str, game: Path, manifest: dict) -> dict:
    """Cảnh mới chưa có trong manifest: tạo entry từ 5 lớp ảnh đã giải nén (scenery/<id>/<lớp>.webp)."""
    layers = {}
    for name in ("sky", "far", "mid", "near", "road"):
        f = game / "scenery" / ident / f"{name}.webp"
        if not f.is_file():
            raise RuntimeError(f"cảnh mới thiếu lớp {name}.webp")
        layers[name] = {"src": f"scenery/{ident}/{name}.webp", "size": webp_size(f)}
    entry = {"id": ident, "layers": layers}
    manifest.setdefault("sceneries", []).append(entry)
    print(f"  + đăng ký cảnh mới vào manifest: {ident}")
    return entry


def numbered(folder: Path, prefix: str) -> list[Path]:
    """Các file <prefix>-<số>.webp trong folder, sắp theo số."""
    found = []
    for f in folder.glob(f"{prefix}-*.webp"):
        tail = f.stem[len(prefix) + 1:]
        if tail.isdigit():
            found.append((int(tail), f))
    return [f for _, f in sorted(found)]


def register_mount(ident: str, game: Path, manifest: dict) -> dict:
    """Thú cưỡi mới: rig/mounts/<id>/ gồm pose-idle, pose-jump-up, pose-jump-down và run-N."""
    folder = game / "rig" / "mounts" / ident
    run = numbered(folder, "run")
    poses = {k: folder / f"pose-{n}.webp" for k, n in (("idle", "idle"), ("up", "jump-up"), ("down", "jump-down"))}
    missing = [f.name for f in poses.values() if not f.is_file()]
    if missing or len(run) < 2:
        raise RuntimeError(f"thú cưỡi mới thiếu ảnh: {', '.join(missing) or 'cần tối thiểu 2 khung run-N'}")
    rel = lambda f: f"rig/mounts/{ident}/{f.name}"
    entry = {"id": ident, "run": [rel(f) for f in run], "idle": rel(poses["idle"]),
             "up": rel(poses["up"]), "down": rel(poses["down"]), "size": webp_size(run[0])}
    manifest.setdefault("mounts", []).append(entry)
    print(f"  + đăng ký thú cưỡi mới vào manifest: {ident}")
    return entry


def register_monster(ident: str, game: Path, manifest: dict) -> dict:
    """Quái vật mới: monsters/<id>/ với frame-N | walk-N (+attack-N) | fly-N (+attack-N)."""
    folder = game / "monsters" / ident
    kind, frames = "walk", []
    for prefix, k in (("fly", "fly"), ("walk", "walk"), ("frame", "walk")):
        frames = numbered(folder, prefix)
        if frames:
            kind = k
            break
    if len(frames) < 2:
        raise RuntimeError("quái vật mới cần tối thiểu 2 khung (frame-N / walk-N / fly-N)")
    attack = numbered(folder, "attack")
    rel = lambda f: f"monsters/{ident}/{f.name}"
    entry = {"id": ident, "kind": kind, "frames": [rel(f) for f in frames],
             "attack": [rel(f) for f in attack], "size": webp_size(frames[0])}
    manifest.setdefault("monsters", []).append(entry)
    print(f"  + đăng ký quái vật mới vào manifest: {ident} ({kind})")
    return entry


REGISTER = {"sceneries": register_scenery, "mounts": register_mount, "monsters": register_monster}


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
                    if key not in REGISTER:
                        raise RuntimeError("id không có trong manifest game")
                    entries[ident] = REGISTER[key](ident, game, manifest)
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
    optional = {"priority_scenery", "music"}
    for kind, files in listing.items():
        print(f"  {kind}: {len(files)} file")
        if not files and kind not in optional:
            sys.exit(f"Thư mục '{kind}' trên host đang trống")

    # Kịch bản ưu tiên đứng đầu danh sách (xóa sau khi upload YouTube thành công).
    scenarios = client.scenarios()
    scenario = scenarios[0] if scenarios else None
    if scenario:
        print(f"  kịch bản ưu tiên: {scenario['id']} ({scenario['name'] or 'không tên'})")
    sc = scenario or {}

    def pick_planned(kind: str, key: str, names: list[str], count: int) -> list[str]:
        """Chất liệu do kịch bản chỉ định (nếu có trên host); thiếu/lỗi thì trả rỗng để chọn ngẫu nhiên."""
        available = {Path(f).stem: f for f in listing[kind]}
        files = [available[n] for n in names if n in available]
        for n in names:
            if n not in available:
                print(f"  ! kịch bản: không có {kind} '{n}' trên host")
        return try_pick(client, kind, files, rng, manifest, key, game, count) if files else []

    scenery = pick_planned("scenery", "sceneries", [sc["scenery"]] if sc.get("scenery") else [], 1)
    from_priority = False
    if not scenery:
        # Ưu tiên cảnh trong chon-canh-vat (xóa sau khi dựng xong); nếu không có/không hợp lệ thì dùng canh-vat.
        scenery = try_pick(client, "priority_scenery", listing.get("priority_scenery", []), rng, manifest, "sceneries", game)
        from_priority = bool(scenery)
    if not scenery:
        scenery = try_pick(client, "scenery", listing["scenery"], rng, manifest, "sceneries", game)
    mount = pick_planned("mount", "mounts", [sc["mount"]] if sc.get("mount") else [], 1) \
        or try_pick(client, "mount", listing["mount"], rng, manifest, "mounts", game)
    boss = pick_planned("boss", "bosses", [sc["boss"]] if sc.get("boss") else [], 1) \
        or try_pick(client, "boss", listing["boss"], rng, manifest, "bosses", game)
    monsters = pick_planned("monster", "monsters", sc.get("monsters", []), len(sc.get("monsters", []))) \
        or try_pick(client, "monster", listing["monster"], rng, manifest, "monsters", game, rng.randint(3, 5))
    if not (scenery and mount and boss and monsters):
        sys.exit("Không chọn đủ cảnh / thú cưỡi / boss / quái hợp lệ từ host")

    ids = lambda names: [Path(n).stem for n in names]  # noqa: E731
    manifest["sceneries"] = [e for e in manifest["sceneries"] if e["id"] in ids(scenery)]
    manifest["mounts"] = [e for e in manifest["mounts"] if e["id"] in ids(mount)]
    manifest["monsters"] = [e for e in manifest["monsters"] if e["id"] in ids(monsters)]
    facings = client.facings()
    for entry in manifest["monsters"]:
        facing = facings.get(entry["id"])
        if facing:
            entry["facing"] = facing
        else:
            entry.pop("facing", None)
        print(f"  hướng quái {entry['id']}: {entry.get('facing', 'dự phòng trong game')}")
    (game / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False), encoding="utf-8")

    music_file = ""
    music_pool = listing.get("music", [])
    for f in rng.sample(music_pool, len(music_pool)):
        try:
            music_file = client.fetch_music(f, Path(args.cache) / "music").as_posix()
            break
        except Exception as exc:  # noqa: BLE001
            print(f"  ! bỏ qua nhạc {f}: {exc}")
    if not music_file:
        print("  (không có nhạc ngoài, dùng nhạc nền có sẵn của game)")

    plan = {
        "seed": seed,
        "duration": duration,
        "scenery": scenery[0],
        "mount": mount[0],
        "boss": boss[0],
        "monsters": monsters,
        "sceneryFromPriority": from_priority,
        "scenarioId": scenario["id"] if scenario else "",
        "musicFile": music_file,
        "musicSeed": rng.randrange(1_000_000),
    }
    Path(args.plan).write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Seed {seed} | {duration}s | cảnh {scenery[0]} | thú cưỡi {mount[0]} | boss {boss[0]} | quái {monsters}")


if __name__ == "__main__":
    main()
