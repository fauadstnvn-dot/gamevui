"""Chọn ngẫu nhiên chất liệu từ host, giải nén vào app/game và ghi plan.json cho game gốc render."""
from __future__ import annotations

import argparse
import json
import os
import random
import sys
from pathlib import Path

from .assets import HostClient

MAX_SCENES = 2
ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"


def manifest_paths(kind: str, entry: dict) -> list[str]:
    if kind in ("scenery", "priority_scenery"):
        return [layer["src"] for layer in entry["layers"].values()]
    if kind == "mount":
        return [*entry["run"], entry["idle"], entry["up"], entry["down"]]
    ranged = entry.get("ranged") or {}
    return [*entry["frames"], *entry.get("attack", []),
            *ranged.get("frames", []), *ranged.get("projectile", []), *ranged.get("impact", [])]


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
    fly = False
    if len(run) < 2:
        run = numbered(folder, "fly")
        fly = len(run) >= 2
    poses = {k: folder / f"pose-{n}.webp" for k, n in (("idle", "idle"), ("up", "jump-up"), ("down", "jump-down"))}
    missing = [f.name for f in poses.values() if not f.is_file()]
    if missing or len(run) < 2:
        raise RuntimeError(f"thú cưỡi mới thiếu ảnh: {', '.join(missing) or 'cần tối thiểu 2 khung run-N (hoặc fly-N cho thú bay)'}")
    rel = lambda f: f"rig/mounts/{ident}/{f.name}"
    entry = {"id": ident, "run": [rel(f) for f in run], "idle": rel(poses["idle"]),
             "up": rel(poses["up"]), "down": rel(poses["down"]), "size": webp_size(run[0])}
    if fly:
        entry["fly"] = True
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
    ranged = register_ranged(folder, ident, rel)
    if ranged:
        entry["ranged"] = ranged
    manifest.setdefault("monsters", []).append(entry)
    print(f"  + đăng ký quái vật mới vào manifest: {ident} ({kind}{', tấn công từ xa' if ranged else ''})")
    return entry


def pair(value, fallback: list[float]) -> list[float]:
    ok = isinstance(value, (list, tuple)) and len(value) == 2 and all(isinstance(v, (int, float)) for v in value)
    return [float(value[0]), float(value[1])] if ok else fallback


def register_ranged(folder: Path, ident: str, rel) -> dict | None:
    """Quái từ xa: ranged-N (tung chiêu) + projectile-N (đạn) + impact-N (nổ), kèm ranged_info từ meta.json."""
    frames, shots, hits = (numbered(folder, p) for p in ("ranged", "projectile", "impact"))
    if not (frames and shots):
        return None
    meta_file = folder / "meta.json"
    info = json.loads(meta_file.read_text(encoding="utf-8")).get("ranged_info", {}) if meta_file.is_file() else {}
    frame_size = webp_size(frames[0])
    shot_size = webp_size(shots[0])
    hit_size = webp_size(hits[0]) if hits else [0, 0]
    shot_wh = pair(info.get("projectile_size"), [float(v) for v in shot_size])
    hit_wh = pair(info.get("impact_size"), [float(v) for v in hit_size])
    return {
        "frames": [rel(f) for f in frames],
        "projectile": [rel(f) for f in shots],
        "impact": [rel(f) for f in hits],
        "size": frame_size,
        "direction": "left" if info.get("direction") == "left" else "right",
        "emitter": pair(info.get("emitter"), [frame_size[0] * 0.5, frame_size[1] * 0.5]),
        "projectileSize": shot_wh,
        "projectileAnchor": pair(info.get("projectile_anchor"), [shot_wh[0] / 2, shot_wh[1] / 2]),
        "impactSize": hit_wh,
        "impactAnchor": pair(info.get("impact_anchor"), [hit_wh[0] / 2, hit_wh[1] / 2]),
        "element": str(info.get("element", "")),
    }


BOSS_MOODS = ["happy", "calm", "annoyed", "irritated", "enraged", "furious", "evil"]


def register_boss(ident: str, game: Path, manifest: dict) -> dict:
    """Boss mới: bosses/<id>-<mood>.webp (7 mood) + bosses/<id>-spit.webp. Thiếu mood thì dùng mood gần nhất."""
    folder = game / "bosses"
    have = {m: folder / f"{ident}-{m}.webp" for m in BOSS_MOODS if (folder / f"{ident}-{m}.webp").is_file()}
    spit = folder / f"{ident}-spit.webp"
    if len(have) < 3 or not spit.is_file():
        raise RuntimeError("boss mới cần tối thiểu 3 mood và ảnh spit")
    moods, last = [], None
    for m in BOSS_MOODS:
        last = m if m in have else last
        moods.append(m if m in have else last)
    first = next(m for m in BOSS_MOODS if m in have)
    moods = [m if m else first for m in moods]
    entry = {"id": ident, "label": ident.replace("-", " ").title(),
             "moods": [f"bosses/{ident}-{m}.webp" for m in moods], "spit": f"bosses/{ident}-spit.webp"}
    manifest["bosses"] = [b for b in manifest.get("bosses", []) if b.get("id") != ident] + [entry]
    print(f"  + đăng ký boss mới vào manifest: {ident}")
    return entry


REGISTER = {"sceneries": register_scenery, "mounts": register_mount, "monsters": register_monster}


def try_pick(client: HostClient, kind: str, files: list[str], rng: random.Random, manifest: dict,
             key: str, game: Path, count: int = 1, melee_only: bool = False) -> list[str]:
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
                register_boss(ident, game, manifest)
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
            if ok and melee_only and entries.get(ident, {}).get("ranged"):
                raise RuntimeError("quái tầm xa, không dùng cho mồm boss")
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

    stem = lambda f: Path(f).stem  # noqa: E731
    scenario_names = list(dict.fromkeys(sc.get("sceneries") or ([sc["scenery"]] if sc.get("scenery") else [])))[:MAX_SCENES]

    # Cảnh do kịch bản chỉ định, giữ nguyên thứ tự (cảnh đầu tiên = màn 1).
    scenery: list[str] = []
    for name in scenario_names:
        scenery += pick_planned("scenery", "sceneries", [name], 1)
    from_priority = False
    if not scenery:
        # Ưu tiên cảnh trong chon-canh-vat (xóa sau khi dựng xong); nếu không có/không hợp lệ thì dùng canh-vat.
        scenery = try_pick(client, "priority_scenery", listing.get("priority_scenery", []), rng, manifest, "sceneries", game)
        from_priority = bool(scenery)
    if not scenery:
        scenery = try_pick(client, "scenery", listing["scenery"], rng, manifest, "sceneries", game)
    # Kịch bản chọn đúng N cảnh thì giữ N cảnh (1 cảnh = không có cảnh boss hút người); còn lại luôn lấy đủ 2 cảnh.
    want_scenes = len(scenery) if scenario_names else MAX_SCENES
    if scenery and len(scenery) < want_scenes:
        rest = [f for f in listing["scenery"] if stem(f) not in {stem(x) for x in scenery}]
        scenery += try_pick(client, "scenery", rest, rng, manifest, "sceneries", game, want_scenes - len(scenery))
    if len(scenery) < 2:
        print("  (chỉ có 1 cảnh: không có cảnh boss hút nhân vật)")

    mount = pick_planned("mount", "mounts", [sc["mount"]] if sc.get("mount") else [], 1) \
        or try_pick(client, "mount", listing["mount"], rng, manifest, "mounts", game)
    boss = pick_planned("boss", "bosses", [sc["boss"]] if sc.get("boss") else [], 1) \
        or try_pick(client, "boss", listing["boss"], rng, manifest, "bosses", game)

    # Mỗi cảnh một bộ quái riêng, không trùng nhau. Quái kịch bản chỉ định được chia xen kẽ cho các cảnh.
    planned_monsters = sc.get("monsters", [])
    split = [planned_monsters] if len(scenery) == 1 else [planned_monsters[i::len(scenery)] for i in range(len(scenery))]
    scene_monsters: list[list[str]] = []
    used: set[str] = set()
    for names in split:
        group = pick_planned("monster", "monsters", [n for n in names if Path(n).stem not in used], len(names)) if names else []
        if not group:
            pool = [f for f in listing["monster"] if f not in used]
            group = try_pick(client, "monster", pool, rng, manifest, "monsters", game, rng.randint(5, 10))
        if not group:
            break
        scene_monsters.append(group)
        used.update(group)
    if len(scene_monsters) < len(scenery):
        print(f"  ! không đủ quái riêng cho {len(scenery)} cảnh, giữ {len(scene_monsters)} cảnh")
        scenery = scenery[:max(1, len(scene_monsters))]
    monsters = [f for group in scene_monsters for f in group]

    # Quái nhả ra từ mồm boss: đánh gần, tách riêng từng cảnh và không trùng quái thường.
    scene_mouth: list[list[str]] = []
    for _ in scenery:
        pool = [f for f in listing["monster"] if f not in used]
        group = try_pick(client, "monster", pool, rng, manifest, "monsters", game, rng.randint(3, 5), melee_only=True)
        scene_mouth.append(group)
        used.update(group)
    mouth = [f for group in scene_mouth for f in group]
    if not mouth:
        print("  ! không chọn được quái đánh gần độc quyền cho mồm boss")
    if not (scenery and mount and boss and monsters):
        sys.exit("Không chọn đủ cảnh / thú cưỡi / boss / quái hợp lệ từ host")

    ids = lambda names: [Path(n).stem for n in names]  # noqa: E731
    manifest["sceneries"] = [e for e in manifest["sceneries"] if e["id"] in ids(scenery)]
    manifest["sceneries"].sort(key=lambda e: ids(scenery).index(e["id"]))
    manifest["mounts"] = [e for e in manifest["mounts"] if e["id"] in ids(mount)]
    manifest["monsters"] = [e for e in manifest["monsters"] if e["id"] in ids(monsters) + ids(mouth)]
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
        "sceneries": scenery,
        "swallow": len(scenery) >= 2,
        "mount": mount[0],
        "boss": boss[0],
        "monsters": monsters,
        "mouthMonsters": mouth,
        "sceneMonsters": {stem(sn): ids(g) for sn, g in zip(scenery, scene_monsters)},
        "sceneMouth": {stem(sn): ids(g) for sn, g in zip(scenery, scene_mouth)},
        "sceneryFromPriority": from_priority,
        "scenarioId": scenario["id"] if scenario else "",
        "musicFile": music_file,
        "musicSeed": rng.randrange(1_000_000),
    }
    Path(args.plan).write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Seed {seed} | {duration}s | cảnh {scenery} | thú cưỡi {mount[0]} | boss {boss[0]} | quái {monsters} | quái mồm boss {mouth}")


if __name__ == "__main__":
    main()
