"""Lấy tài khoản YouTube từ MySQL trên host -> tạo metadata bằng DeepSeek -> upload -> cộng num."""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import pymysql
import requests

from .metadata import generate

TABLE = "tb_bao_secret"
MAX_NUM = 9
TOKEN_URL = "https://oauth2.googleapis.com/token"
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
        autocommit=True,
    )


HAS_TOKEN = "token_gamevui IS NOT NULL AND TRIM(token_gamevui) <> ''"


def candidates(db) -> list[dict]:
    """Các hàng có token và num < 9, xáo ngẫu nhiên. Hết hàng thì reset num=0 cho hàng có token rồi lấy lại."""
    sql = (
        f"SELECT client_id, client_secret, token_gamevui, COALESCE(num, 0) AS num "
        f"FROM {TABLE} WHERE {HAS_TOKEN} AND COALESCE(num, 0) < %s ORDER BY RAND()"
    )
    with db.cursor() as cur:
        cur.execute(sql, (MAX_NUM,))
        rows = cur.fetchall()
        if rows:
            return rows
        cur.execute(f"UPDATE {TABLE} SET num = 0 WHERE {HAS_TOKEN}")
        print(f"  Hết lượt (num >= {MAX_NUM}) -> reset num=0 cho {cur.rowcount} hàng có token")
        cur.execute(sql, (MAX_NUM,))
        return cur.fetchall()


def valid_access_token(db, row: dict) -> str:
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
    with db.cursor() as cur:
        cur.execute(f"UPDATE {TABLE} SET token_gamevui = %s WHERE client_id = %s",
                    (json.dumps(new), row["client_id"]))
    return new["access_token"]


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


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="output")
    ap.add_argument("--privacy", default=os.environ.get("YT_PRIVACY", "public"),
                    choices=["public", "unlisted", "private"])
    ap.add_argument("--category", default="20", help="20 = Gaming")
    ap.add_argument("--made-for-kids", action="store_true")
    ap.add_argument("--dry-run", action="store_true", help="Chỉ tạo metadata, không upload / không đổi DB")
    args = ap.parse_args()

    metas = sorted(Path(args.dir).glob("video-*.json"))
    if not metas:
        sys.exit(f"Không thấy file metadata trong {args.dir}")
    meta_path = metas[-1]
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    mp4 = meta_path.with_suffix(".mp4")

    info = generate(meta)
    print(f"Tiêu đề: {info['title']}\nTag: {', '.join(info['tags'])}")
    meta_path.with_name(meta_path.stem + ".youtube.json").write_text(
        json.dumps(info, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.dry_run:
        return

    db = connect()
    try:
        for row in candidates(db):
            print(f"Thử tài khoản client_id={row['client_id'][:12]}… (num={row['num']})")
            try:
                token = valid_access_token(db, row)
                video_id = upload(token, mp4, info, args.privacy, args.category, args.made_for_kids)
            except AccountError as exc:
                print(f"  ! bỏ qua tài khoản này: {exc}")
                continue
            with db.cursor() as cur:
                cur.execute(f"UPDATE {TABLE} SET num = COALESCE(num, 0) + 1 WHERE client_id = %s",
                            (row["client_id"],))
            print(f"Đã upload: https://youtu.be/{video_id} (num +1)")
            return
        sys.exit("Không có tài khoản nào upload được")
    finally:
        db.close()


if __name__ == "__main__":
    main()
