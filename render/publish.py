"""Lấy tài khoản YouTube từ MySQL trên host -> tạo metadata bằng DeepSeek -> upload -> cộng num."""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import time
from pathlib import Path

import pymysql
import requests

from .metadata import generate
from .shorts import build_short

TABLE = "tb_bao_secret"
MAX_NUM = 9
TOKEN_URL = "https://oauth2.googleapis.com/token"
COMMENT_URL = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status"


class AccountError(Exception):
    """Lỗi riêng của tài khoản này (token hỏng, hết quota): thử tài khoản khác."""


def connect():
    return pymysql.connect(
        host=os.environ["DB_HOST"],
        port=int(os.environ.get("DB_PORT") or 3306),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASS"],
        database=os.environ["DB_NAME"],
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=30,
        read_timeout=60,
        write_timeout=60,
        autocommit=True,
    )


def run_db(work, attempts: int = 5):
    """Mở kết nối mới cho mỗi thao tác rồi đóng ngay, thử lại nếu host ngắt kết nối.

    Upload video mất nhiều phút nên không giữ kết nối nhàn rỗi (host báo 'MySQL server has gone away').
    """
    last: Exception | None = None
    for attempt in range(1, attempts + 1):
        db = None
        try:
            db = connect()
            return work(db)
        except pymysql.err.Error as exc:
            last = exc
            print(f"  ! MySQL lỗi ({exc}), thử lại lần {attempt}/{attempts}…")
            time.sleep(min(5 * attempt, 20))
        finally:
            if db is not None:
                try:
                    db.close()
                except Exception:
                    pass
    raise RuntimeError(f"MySQL không kết nối được sau {attempts} lần thử: {last}")


HAS_TOKEN = "token_gamevui IS NOT NULL AND TRIM(token_gamevui) <> ''"


def candidates() -> list[dict]:
    """Các hàng có token và num < 9, xáo ngẫu nhiên. Hết hàng thì reset num=0 cho hàng có token rồi lấy lại."""
    sql = (
        f"SELECT client_id, client_secret, token_gamevui, COALESCE(num, 0) AS num "
        f"FROM {TABLE} WHERE {HAS_TOKEN} AND COALESCE(num, 0) < %s ORDER BY RAND()"
    )

    def work(db):
        with db.cursor() as cur:
            cur.execute(sql, (MAX_NUM,))
            rows = cur.fetchall()
            if rows:
                return rows
            cur.execute(f"UPDATE {TABLE} SET num = 0 WHERE {HAS_TOKEN}")
            print(f"  Hết lượt (num >= {MAX_NUM}) -> reset num=0 cho {cur.rowcount} hàng có token")
            cur.execute(sql, (MAX_NUM,))
            return cur.fetchall()

    return run_db(work)


def valid_access_token(row: dict) -> str:
    try:
        tokens = json.loads(row["token_gamevui"])
    except (TypeError, ValueError) as exc:
        raise AccountError("token_gamevui không phải JSON hợp lệ") from exc
    expires_at = tokens.get("saved_at", 0) + tokens.get("expires_in", 3600) - 300
    if tokens.get("access_token") and time.time() < expires_at:
        return tokens["access_token"]
    if not tokens.get("refresh_token"):
        raise AccountError("thiếu refresh_token")
    r = requests.post(TOKEN_URL, data={
        "client_id": row["client_id"],
        "client_secret": row["client_secret"],
        "refresh_token": tokens["refresh_token"],
        "grant_type": "refresh_token",
    }, timeout=60)
    if r.status_code != 200:
        raise AccountError(f"làm mới token thất bại ({r.status_code}): {r.text[:200]}")
    new = r.json()
    new.setdefault("refresh_token", tokens["refresh_token"])
    new.setdefault("scope", tokens.get("scope"))
    new["saved_at"] = int(time.time())
    def save(db):
        with db.cursor() as cur:
            cur.execute(f"UPDATE {TABLE} SET token_gamevui = %s WHERE client_id = %s",
                        (json.dumps(new), row["client_id"]))

    run_db(save)
    return new["access_token"]


def increment_num(client_id: str) -> None:
    def work(db):
        with db.cursor() as cur:
            cur.execute(f"UPDATE {TABLE} SET num = COALESCE(num, 0) + 1 WHERE client_id = %s", (client_id,))

    run_db(work)


def cleanup(meta_path: Path, mp4: Path) -> None:
    """Xóa video, metadata và mọi file tạm sau khi đã upload thành công."""
    for p in (mp4, meta_path, meta_path.with_name(meta_path.stem + ".youtube.json")):
        p.unlink(missing_ok=True)
    out = meta_path.parent
    for p in out.glob("video-*"):
        p.unlink(missing_ok=True)
    for d in (".work", ".cache", "app/game/scenery", "app/game/rig", "app/game/bosses", "app/game/monsters"):
        shutil.rmtree(d, ignore_errors=True)
    try:
        out.rmdir()
    except OSError:
        pass
    print("Đã xóa video và các file tạm sau khi upload thành công")


def upload(access_token: str, mp4: Path, info: dict, privacy: str, category: str, kids: bool) -> str:
    body = {
        "snippet": {
            "title": info["title"],
            "description": info["description"],
            "tags": info["tags"],
            "categoryId": category,
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en",
        },
        "status": {"privacyStatus": privacy, "selfDeclaredMadeForKids": kids},
    }
    size = mp4.stat().st_size
    init = requests.post(UPLOAD_URL, json=body, timeout=60, headers={
        "Authorization": f"Bearer {access_token}",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": str(size),
    })
    if init.status_code in (401, 403):
        raise AccountError(f"YouTube từ chối ({init.status_code}): {init.text[:300]}")
    init.raise_for_status()
    location = init.headers["Location"]
    for attempt in range(3):
        with mp4.open("rb") as fh:
            r = requests.put(location, data=fh, timeout=3600, headers={
                "Content-Type": "video/mp4", "Content-Length": str(size)})
        if r.status_code in (200, 201):
            return r.json()["id"]
        if r.status_code in (401, 403):
            raise AccountError(f"upload bị từ chối ({r.status_code}): {r.text[:300]}")
        print(f"  ! upload lần {attempt + 1} lỗi {r.status_code}, thử lại…")
        time.sleep(10 * (attempt + 1))
    raise RuntimeError("Upload thất bại sau 3 lần thử")


def fill_main_url(text: str, main_url: str) -> str:
    return text.replace("{MAIN_URL}", main_url)


def post_comment(access_token: str, video_id: str, text: str) -> bool:
    """Bình luận đầu tiên dưới Short mời xem video chính (cần scope youtube.force-ssl; thiếu thì bỏ qua)."""
    r = requests.post(COMMENT_URL, timeout=60, headers={"Authorization": f"Bearer {access_token}"}, json={
        "snippet": {"videoId": video_id, "topLevelComment": {"snippet": {"textOriginal": text}}}})
    if r.status_code in (200, 201):
        return True
    print(f"  ! Chưa đăng được bình luận kêu gọi ({r.status_code}): {r.text[:200]}")
    return False


def publish_short(row: dict, mp4: Path, meta: dict, info: dict, main_id: str, args) -> None:
    """Dựng và đăng Short với cùng tài khoản; mọi lỗi chỉ cảnh báo, không làm hỏng video chính."""
    main_url = f"https://youtu.be/{main_id}"
    short_mp4 = mp4.with_name(mp4.stem + "-short.mp4")
    try:
        build_short(mp4, meta, info, short_mp4, Path(".work") / "short")
        short_info = {
            "title": f"{info['short_title']} #Shorts",
            "description": fill_main_url(info["short_description"], main_url),
            "tags": info["short_tags"],
        }
        token = valid_access_token(row)
        short_id = upload(token, short_mp4, short_info, args.privacy, args.category, args.made_for_kids)
        print(f"Đã upload Short: https://youtube.com/shorts/{short_id}")
        post_comment(token, short_id, fill_main_url(info["comment"], main_url))
    except Exception as exc:  # noqa: BLE001
        print(f"  ! Không đăng được Short (video chính đã lên): {exc}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="output")
    ap.add_argument("--privacy", default=os.environ.get("YT_PRIVACY", "public"),
                    choices=["public", "unlisted", "private"])
    ap.add_argument("--category", default="20", help="20 = Gaming")
    ap.add_argument("--made-for-kids", action="store_true")
    ap.add_argument("--no-short", action="store_true", help="Không dựng/đăng YouTube Short kèm theo")
    ap.add_argument("--dry-run", action="store_true", help="Chỉ tạo metadata, không upload / không đổi DB")
    args = ap.parse_args()

    metas = sorted(Path(args.dir).glob("video-*.json"))
    if not metas:
        sys.exit(f"Không thấy file metadata trong {args.dir}")
    meta_path = metas[-1]
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    mp4 = meta_path.with_suffix(".mp4")

    info = generate(meta)
    print(f"Tiêu đề: {info['title']}\nTag: {', '.join(info['tags'])}\nShort: {info['short_title']}")
    meta_path.with_name(meta_path.stem + ".youtube.json").write_text(
        json.dumps(info, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.dry_run:
        return

    for row in candidates():
        print(f"Thử tài khoản client_id={row['client_id'][:12]}… (num={row['num']})")
        try:
            token = valid_access_token(row)
            video_id = upload(token, mp4, info, args.privacy, args.category, args.made_for_kids)
        except AccountError as exc:
            print(f"  ! bỏ qua tài khoản này: {exc}")
            continue
        print(f"Đã upload: https://youtu.be/{video_id}")
        if not args.no_short:
            publish_short(row, mp4, meta, info, video_id, args)
        try:
            increment_num(row["client_id"])
            print("  num +1")
        except RuntimeError as exc:
            print(f"  ! Video đã lên YouTube nhưng chưa cộng được num: {exc}")
        cleanup(meta_path, mp4)
        return
    sys.exit("Không có tài khoản nào upload được")


if __name__ == "__main__":
    main()
