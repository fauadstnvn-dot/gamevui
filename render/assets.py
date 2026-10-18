"""Tải các gói ZIP chất liệu từ host (hoặc thư mục cục bộ để test) và giải nén vào thư mục game/."""
from __future__ import annotations

import json
import re
import shutil
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path, PurePosixPath

CATEGORIES = {
    "scenery": "canh-vat",
    "mount": "thu-cuoi",
    "boss": "boss",
    "monster": "quai-vat",
}
ALLOWED_PREFIXES = ("scenery/", "rig/mounts/", "bosses/", "monsters/", "sun/")
ALLOWED_EXTS = {".webp", ".png"}
MAX_ZIP_BYTES = 120 * 1024 * 1024
MAX_FILES = 300
USER_AGENT = "Mozilla/5.0 (compatible; GameVideoRenderer/2.0)"


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

    def fetch_into(self, kind: str, file: str, game_dir: Path) -> list[str]:
        """Tải zip và giải nén vào game_dir giữ nguyên đường dẫn gốc. Trả về danh sách file đã ghi."""
        folder = CATEGORIES[kind]
        zip_path = self.cache / folder / file
        zip_path.parent.mkdir(parents=True, exist_ok=True)
        if self.is_local:
            shutil.copy(Path(self.host) / folder / file, zip_path)
        else:
            q = urllib.parse.urlencode({"action": "get", "cat": folder, "file": file})
            zip_path.write_bytes(self._request(f"{self.host}/api.php?{q}"))
        try:
            return safe_extract(zip_path, game_dir)
        finally:
            zip_path.unlink(missing_ok=True)


def safe_extract(zip_path: Path, game_dir: Path) -> list[str]:
    """Chỉ giải nén ảnh nằm trong các thư mục game hợp lệ (chống zip-slip)."""
    written: list[str] = []
    root = game_dir.resolve()
    with zipfile.ZipFile(zip_path) as zf:
        members = [m for m in zf.infolist() if not m.is_dir()]
        if len(members) > MAX_FILES:
            raise RuntimeError(f"{zip_path.name}: quá nhiều file")
        for m in members:
            rel = PurePosixPath(m.filename.replace("\\", "/"))
            if rel.is_absolute() or ".." in rel.parts:
                continue
            text = rel.as_posix()
            if not text.startswith(ALLOWED_PREFIXES) or rel.suffix.lower() not in ALLOWED_EXTS:
                continue
            dest = (game_dir / text).resolve()
            if root not in dest.parents:
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            with zf.open(m) as src, open(dest, "wb") as dst:
                shutil.copyfileobj(src, dst)
            written.append(text)
    return written
