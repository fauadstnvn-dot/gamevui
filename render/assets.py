"""Tải và đọc các gói ZIP chất liệu từ host (hoặc từ thư mục cục bộ để test)."""
from __future__ import annotations

import json
import re
import shutil
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image

CATEGORIES = {
    "scenery": "canh-vat",
    "mount": "thu-cuoi",
    "boss": "boss",
    "monster": "quai-vat",
}
IMG_EXTS = {".png", ".webp", ".jpg", ".jpeg"}
MAX_ZIP_BYTES = 120 * 1024 * 1024
MAX_FILES = 200
USER_AGENT = "Mozilla/5.0 (compatible; GameVideoRenderer/1.0)"


class HostClient:
    """host có thể là URL (https://host/…) hoặc đường dẫn thư mục cục bộ."""

    def __init__(self, host: str, token: str = "", cache: Path = Path(".cache")):
        self.host = host.rstrip("/")
        self.token = token
        self.cache = cache
        self.is_local = not re.match(r"^https?://", host)
        cache.mkdir(parents=True, exist_ok=True)

    def _request(self, url: str, retries: int = 4) -> bytes:
        headers = {"User-Agent": USER_AGENT}
        if self.token:
            headers["X-Token"] = self.token
        last: Exception | None = None
        for attempt in range(retries):
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=120) as res:
                    data = res.read(MAX_ZIP_BYTES + 1)
                if len(data) > MAX_ZIP_BYTES:
                    raise RuntimeError("ZIP vượt quá giới hạn kích thước")
                return data
            except (urllib.error.URLError, TimeoutError, ConnectionError) as exc:
                last = exc
                time.sleep(2 * (attempt + 1))
        raise RuntimeError(f"Không tải được {url}: {last}")

    def list_all(self) -> dict[str, list[str]]:
        """Trả về {loại: [tên file zip, ...]} cho cả 4 thư mục."""
        result: dict[str, list[str]] = {}
        if self.is_local:
            for kind, folder in CATEGORIES.items():
                d = Path(self.host) / folder
                result[kind] = sorted(p.name for p in d.glob("*.zip")) if d.is_dir() else []
            return result
        data = json.loads(self._request(f"{self.host}/api.php?action=list"))
        for kind, folder in CATEGORIES.items():
            items = data.get(folder, [])
            result[kind] = sorted(i["file"] if isinstance(i, dict) else i for i in items)
        return result

    def fetch(self, kind: str, file: str) -> Path:
        """Tải zip, giải nén vào cache, trả về thư mục chứa ảnh."""
        folder = CATEGORIES[kind]
        name = Path(file).stem
        out = self.cache / folder / name
        if out.exists():
            shutil.rmtree(out)
        out.mkdir(parents=True)
        zip_path = self.cache / folder / file
        if self.is_local:
            shutil.copy(Path(self.host) / folder / file, zip_path)
        else:
            q = urllib.parse.urlencode({"action": "get", "cat": folder, "file": file})
            zip_path.write_bytes(self._request(f"{self.host}/api.php?{q}"))
        safe_extract(zip_path, out)
        zip_path.unlink(missing_ok=True)
        return out


def safe_extract(zip_path: Path, out: Path) -> None:
    """Chỉ giải nén ảnh + info.json, làm phẳng đường dẫn (chống zip-slip)."""
    with zipfile.ZipFile(zip_path) as zf:
        members = [m for m in zf.infolist() if not m.is_dir()]
        if len(members) > MAX_FILES:
            raise RuntimeError(f"{zip_path.name}: quá nhiều file")
        for m in members:
            base = Path(m.filename).name
            ext = Path(base).suffix.lower()
            if base.startswith(".") or (ext not in IMG_EXTS and base != "info.json"):
                continue
            with zf.open(m) as src, open(out / base, "wb") as dst:
                shutil.copyfileobj(src, dst)


def _natural_key(p: Path):
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", p.stem)]


def _images(folder: Path) -> list[Path]:
    return sorted((p for p in folder.iterdir() if p.suffix.lower() in IMG_EXTS), key=_natural_key)


def _open(p: Path) -> Image.Image:
    return Image.open(p).convert("RGBA")


def _info(folder: Path) -> dict:
    f = folder / "info.json"
    try:
        return json.loads(f.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


@dataclass
class Scenery:
    name: str
    layers: dict[str, Image.Image]


@dataclass
class Mount:
    name: str
    run: list[Image.Image]
    idle: Image.Image
    up: Image.Image
    down: Image.Image


@dataclass
class Boss:
    name: str
    states: dict[str, Image.Image]


@dataclass
class Monster:
    name: str
    frames: list[Image.Image]
    kind: str = "walk"
    extra: dict = field(default_factory=dict)


def load_scenery(folder: Path) -> Scenery:
    layers = {}
    for p in _images(folder):
        if p.stem.lower() in {"sky", "far", "mid", "near", "road"}:
            layers[p.stem.lower()] = _open(p)
    if not layers:
        raise RuntimeError(f"{folder.name}: không có lớp cảnh nào")
    return Scenery(_info(folder).get("nameEn") or folder.name, layers)


def load_mount(folder: Path) -> Mount:
    imgs = _images(folder)
    run = [p for p in imgs if re.match(r"^run-?\d+$", p.stem, re.I)]
    if not run:
        raise RuntimeError(f"{folder.name}: thiếu khung run-N")

    def pick(*keys: str) -> Path | None:
        for p in imgs:
            if p.stem.lower() in keys:
                return p
        return None

    run_imgs = [_open(p) for p in run]
    idle = pick("idle", "pose-idle")
    up = pick("jump-up", "pose-jump-up")
    down = pick("jump-down", "pose-jump-down")
    return Mount(
        _info(folder).get("nameEn") or folder.name,
        run_imgs,
        _open(idle) if idle else run_imgs[0],
        _open(up) if up else run_imgs[0],
        _open(down) if down else run_imgs[0],
    )


def load_boss(folder: Path) -> Boss:
    states = {p.stem.lower(): _open(p) for p in _images(folder)}
    if "calm" not in states:
        raise RuntimeError(f"{folder.name}: thiếu ảnh calm")
    return Boss(_info(folder).get("nameEn") or folder.name, states)


def load_monster(folder: Path) -> Monster:
    imgs = _images(folder)
    for prefix in ("frame", "fly", "walk", "run"):
        sel = [p for p in imgs if p.stem.lower().startswith(prefix)]
        if sel:
            break
    else:
        sel = [p for p in imgs if not p.stem.lower().startswith("attack")]
    if not sel:
        raise RuntimeError(f"{folder.name}: không có khung hình")
    info = _info(folder)
    kind = info.get("kind") or ("fly" if sel[0].stem.lower().startswith("fly") else "walk")
    return Monster(info.get("nameEn") or folder.name, [_open(p) for p in sel], kind)
