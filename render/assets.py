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
    "priority_scenery": "chon-canh-vat",
    "music": "music",
}
SCENARIO_FOLDER = "kb-uu-tien"
MUSIC_EXTS = {".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".opus"}
MAX_MUSIC_BYTES = 120 * 1024 * 1024
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
            md = Path(self.host) / CATEGORIES["music"]
            result["music"] = sorted(p.name for p in md.iterdir() if p.suffix.lower() in MUSIC_EXTS) if md.is_dir() else []
            return result
        data = json.loads(self._request(f"{self.host}/api.php?action=list"))
        for kind, folder in CATEGORIES.items():
            items = data.get(folder, [])
            result[kind] = sorted(i["file"] if isinstance(i, dict) else i for i in items)
        result["music"] = [f for f in result.get("music", []) if Path(f).suffix.lower() in MUSIC_EXTS]
        result["priority_scenery"] = [f for f in result.get("priority_scenery", []) if f.lower().endswith(".zip")]
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
            written = safe_extract(zip_path, game_dir)
            if kind == "monster":
                save_monster_meta(zip_path, game_dir, Path(file).stem)
            return written
        finally:
            zip_path.unlink(missing_ok=True)


    def fetch_music(self, file: str, dest_dir: Path) -> Path:
        """Tải một bài nhạc (mp3/wav/ogg/...) về dest_dir và trả về đường dẫn file."""
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / Path(file).name
        if self.is_local:
            shutil.copy(Path(self.host) / CATEGORIES["music"] / file, dest)
        else:
            q = urllib.parse.urlencode({"action": "get", "cat": CATEGORIES["music"], "file": file})
            dest.write_bytes(self._request(f"{self.host}/api.php?{q}"))
        if dest.stat().st_size > MAX_MUSIC_BYTES or dest.stat().st_size < 1024:
            dest.unlink(missing_ok=True)
            raise RuntimeError(f"{file}: kích thước nhạc không hợp lệ")
        return dest

    def delete(self, kind: str, file: str) -> None:
        """Xóa file trên host (dùng cho cảnh vật ở chon-canh-vat sau khi đã sử dụng)."""
        folder = CATEGORIES[kind]
        if self.is_local:
            (Path(self.host) / folder / file).unlink(missing_ok=True)
            return
        headers = {"User-Agent": USER_AGENT}
        if self.token:
            headers["X-Token"] = self.token
        q = urllib.parse.urlencode({"action": "delete", "cat": folder, "file": file})
        req = urllib.request.Request(f"{self.host}/api.php?{q}", data=b"", headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=60) as res:
            body = json.loads(res.read() or b"{}")
        if isinstance(body, dict) and body.get("ok") is False:
            raise RuntimeError(body.get("error", "host từ chối xóa"))


def _scenario_clean(raw: dict) -> dict:
    str_or_empty = lambda v: v.strip() if isinstance(v, str) else ""  # noqa: E731
    monsters = [str_or_empty(m) for m in raw.get("monsters", []) if str_or_empty(m)] if isinstance(raw.get("monsters"), list) else []
    raw_scenes = raw.get("sceneries") if isinstance(raw.get("sceneries"), list) else [raw.get("scenery")]
    scenery_list = list(dict.fromkeys(str_or_empty(v) for v in raw_scenes if str_or_empty(v)))[:2]
    return {
        "id": str(raw.get("id", "")), "name": str_or_empty(raw.get("name")),
        "order": raw.get("order", 0) if isinstance(raw.get("order"), int) else 0,
        "created": raw.get("created", 0) if isinstance(raw.get("created"), int) else 0,
        "boss": str_or_empty(raw.get("boss")), "scenery": scenery_list[0] if scenery_list else "",
        "sceneries": scenery_list,
        "mount": str_or_empty(raw.get("mount")), "monsters": monsters,
    }


def _scenarios(self) -> list[dict]:
    """Kịch bản ưu tiên (assets/kb-uu-tien/*.json) theo thứ tự ưu tiên tăng dần."""
    raws: list[dict] = []
    if self.is_local:
        d = Path(self.host) / SCENARIO_FOLDER
        for p in sorted(d.glob("*.json")) if d.is_dir() else []:
            try:
                raw = json.loads(p.read_text(encoding="utf-8"))
                raw["id"] = p.stem
                raws.append(raw)
            except (OSError, ValueError):
                continue
    else:
        try:
            raws = json.loads(self._request(f"{self.host}/api.php?action=scenarios")).get("scenarios", [])
        except Exception as exc:  # noqa: BLE001
            print(f"  ! không đọc được kịch bản ưu tiên: {exc}")
    items = [_scenario_clean(r) for r in raws if isinstance(r, dict) and r.get("id")]
    return sorted(items, key=lambda s: (s["order"], s["created"]))


def _delete_scenario(self, scenario_id: str) -> None:
    if self.is_local:
        (Path(self.host) / SCENARIO_FOLDER / f"{scenario_id}.json").unlink(missing_ok=True)
        return
    headers = {"User-Agent": USER_AGENT}
    if self.token:
        headers["X-Token"] = self.token
    q = urllib.parse.urlencode({"action": "scenario_delete", "id": scenario_id})
    req = urllib.request.Request(f"{self.host}/api.php?{q}", data=b"", headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=60) as res:
        body = json.loads(res.read() or b"{}")
    if isinstance(body, dict) and body.get("ok") is False:
        raise RuntimeError(body.get("error", "host từ chối xóa kịch bản"))


FACING_FOLDER = "huong-quai"


def _facings(self) -> dict[str, str]:
    """Hướng nhìn sprite gốc của quái vật {id: 'left'|'right'} do tab "Hướng quái vật" trên host quyết định.

    Lỗi/không có dữ liệu thì trả về {} và game tự dùng danh sách dự phòng cũ.
    """
    raw: dict = {}
    try:
        if self.is_local:
            p = Path(self.host) / FACING_FOLDER / "facing.json"
            monsters = json.loads(p.read_text(encoding="utf-8")).get("monsters", {}) if p.is_file() else {}
            raw = {k: v.get("facing") for k, v in monsters.items() if isinstance(v, dict)}
        else:
            raw = json.loads(self._request(f"{self.host}/api.php?action=facings")).get("facings", {})
    except Exception as exc:  # noqa: BLE001
        print(f"  ! không đọc được hướng quái vật từ host (dùng dự phòng trong game): {exc}")
    return {k: v for k, v in raw.items() if isinstance(k, str) and v in ("left", "right")}


HostClient.scenarios = _scenarios
HostClient.delete_scenario = _delete_scenario
HostClient.facings = _facings


def save_monster_meta(zip_path: Path, game_dir: Path, ident: str) -> None:
    """Lưu ranged_info của quái tấn công từ xa thành monsters/<id>/meta.json (info.json không được giải nén)."""
    with zipfile.ZipFile(zip_path) as zf:
        try:
            info = json.loads(zf.read("info.json").decode("utf-8"))
        except (KeyError, ValueError):
            return
    ranged = info.get("ranged_info") if isinstance(info, dict) else None
    folder = game_dir / "monsters" / ident
    if isinstance(ranged, dict) and folder.is_dir():
        (folder / "meta.json").write_text(json.dumps({"ranged_info": ranged}, ensure_ascii=False), encoding="utf-8")


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
