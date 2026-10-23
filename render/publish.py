"""Lấy tài khoản YouTube từ MySQL trên host -> tạo metadata bằng DeepSeek -> upload -> cộng num."""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
import time
from pathlib import Path

import pymysql
import requests

from .metadata import SHORT_TITLE_MAX, _clean_title, generate, pretty
from .shorts import KINDS, build_short
from .thumbnail import build_thumbnail

TABLE = "tb_bao_secret"
MAX_NUM = 9
TOKEN_URL = "https://oauth2.googleapis.com/token"
THUMB_URL = "https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={video_id}"
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


def _sanitize_snippet(info: dict, with_tags: bool = True) -> dict:
    """Làm sạch tiêu đề/mô tả/tag theo luật YouTube (không < >, tiêu đề <=100 ký tự, tag <=500 ký tự)."""
    def strip(text: str) -> str:
        return re.sub(r"[<>\x00-\x08\x0b\x0c\x0e-\x1f]", "", str(text or "")).replace("\r", "")

    title = " ".join(strip(info.get("title")).split())
    if len(title) > 100:
        title = title[:100].rsplit(" ", 1)[0]
    desc = strip(info.get("description"))
    while len(desc.encode("utf-8")) > 4900:
        desc = desc[:-100]
    tags, seen, total = [], set(), 0
    if with_tags:
        for t in info.get("tags") or []:
            t = re.sub(r"[<>\",#]", "", str(t)).strip()
            if not t or len(t) > 30 or t.lower() in seen:
                continue
            if total + len(t) + 3 > 450:
                break
            seen.add(t.lower())
            tags.append(t)
            total += len(t) + 3
    return {"title": title or "Boss Battle", "description": desc.strip(), "tags": tags}


def upload(access_token: str, mp4: Path, info: dict, privacy: str, category: str, kids: bool) -> str:
    try:
        return _upload(access_token, mp4, _sanitize_snippet(info), privacy, category, kids)
    except requests.HTTPError as exc:
        if exc.response is None or exc.response.status_code != 400:
            raise
        print(f"  ! YouTube trả 400 ({exc.response.text[:300]}), thử lại không tag/ngôn ngữ…")
        return _upload(access_token, mp4, _sanitize_snippet(info, with_tags=False), privacy, category, kids,
                       minimal=True)


def _upload(access_token: str, mp4: Path, info: dict, privacy: str, category: str, kids: bool,
            minimal: bool = False) -> str:
    body = {
        "snippet": {
            "title": info["title"],
            "description": info["description"],
            "categoryId": str(category),
        },
        "status": {"privacyStatus": privacy, "selfDeclaredMadeForKids": kids},
    }
    if info["tags"]:
        body["snippet"]["tags"] = info["tags"]
    if not minimal:
        body["snippet"]["defaultLanguage"] = "en"
        body["snippet"]["defaultAudioLanguage"] = "en"
    size = mp4.stat().st_size
    init = requests.post(UPLOAD_URL, json=body, timeout=60, headers={
        "Authorization": f"Bearer {access_token}",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": str(size),
    })
    if init.status_code in (401, 403):
        raise AccountError(f"YouTube từ chối ({init.status_code}): {init.text[:300]}")
    if not init.ok:
        raise requests.HTTPError(f"{init.status_code}: {init.text[:500]}", response=init)
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


def set_thumbnail(access_token: str, video_id: str, jpg: Path) -> bool:
    """Đặt thumbnail tuỳ chỉnh (kênh phải được xác minh số điện thoại; thiếu quyền thì chỉ cảnh báo)."""
    r = requests.post(THUMB_URL.format(video_id=video_id), timeout=120, data=jpg.read_bytes(), headers={
        "Authorization": f"Bearer {access_token}", "Content-Type": "image/jpeg"})
    if r.status_code == 200:
        return True
    print(f"  ! Chưa đặt được thumbnail ({r.status_code}): {r.text[:200]}")
    return False


def main_comment(meta: dict) -> str:
    """Bình luận đầu tiên dưới video chính để mở màn thảo luận bằng một lựa chọn 1 / 2."""
    mount = pretty(str(meta.get("mount", ""))) or "Hero"
    boss = pretty(str(meta.get("boss", ""))) or "Boss"
    return (f"Who did you pick before the fight? Type 1 for {mount} or 2 for {boss}. "
            f"Did the ending surprise you? Tell me below, and subscribe for the next battle!")


def short_package(kind: str, meta: dict, info: dict, main_url: str) -> dict:
    """Tiêu đề / mô tả / tag / bình luận riêng cho từng loại Short."""
    mount, boss = pretty(str(meta.get("mount", ""))) or "Hero", pretty(str(meta.get("boss", ""))) or "Boss"
    if kind == "predict":
        title = _clean_title(f"Who wins? {mount} vs {boss} - Guess Before The End", SHORT_TITLE_MAX)
        desc = (
            f"Who do you think wins: {mount} or {boss}? Comment 1 for {mount} or 2 for {boss}!\n"
            f"The answer is in the full battle: {main_url}\n\n"
            "#shorts #whowins #bossbattle #fantasyanimation"
        )
        comment = f"1 = {mount}, 2 = {boss}. Vote now, then watch the full battle to see who really wins: {main_url}"
        return {"title": f"{title} #Shorts", "description": desc, "tags": info["short_tags"], "comment": comment}
    return {
        "title": f"{info['short_title']} #Shorts",
        "description": fill_main_url(info["short_description"], main_url),
        "tags": info["short_tags"],
        "comment": fill_main_url(info["comment"], main_url),
    }


def publish_short(row: dict, mp4: Path, meta: dict, info: dict, main_id: str, args) -> None:
    """Dựng và đăng các loại Short với cùng tài khoản; mọi lỗi chỉ cảnh báo, không làm hỏng video chính."""
    main_url = f"https://youtu.be/{main_id}"
    kinds = [k for k in (args.short_types or "").split(",") if k in KINDS] or list(KINDS)
    for kind in kinds:
        short_mp4 = mp4.with_name(f"{mp4.stem}-short-{kind}.mp4")
        try:
            build_short(mp4, meta, info, short_mp4, Path(".work") / f"short-{kind}", kind=kind)
            pkg = short_package(kind, meta, info, main_url)
            token = valid_access_token(row)
            short_id = upload(token, short_mp4, pkg, args.privacy, args.category, args.made_for_kids)
            print(f"Đã upload Short {kind}: https://youtube.com/shorts/{short_id}")
            post_comment(token, short_id, pkg["comment"])
        except Exception as exc:  # noqa: BLE001
            print(f"  ! Không đăng được Short {kind} (video chính đã lên): {exc}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="output")
    ap.add_argument("--privacy", default=os.environ.get("YT_PRIVACY", "public"),
                    choices=["public", "unlisted", "private"])
    ap.add_argument("--category", default="20", help="20 = Gaming")
    ap.add_argument("--made-for-kids", action="store_true")
    ap.add_argument("--short-types", default=os.environ.get("SHORT_TYPES", "predict,highlight"),
                    help="Các loại Short, cách nhau dấu phẩy: predict (không lộ kết quả), highlight (cú quyết định)")
    ap.add_argument("--no-thumbnail", action="store_true", help="Không tạo/đặt thumbnail tự động")
    ap.add_argument("--no-comment", action="store_true", help="Không đăng bình luận đầu tiên dưới video chính")
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
        if not args.no_thumbnail:
            try:
                jpg = build_thumbnail(mp4, meta, mp4.with_suffix(".thumb.jpg"), Path(".work") / "thumb")
                print(f"Thumbnail: {jpg.name} ({jpg.stat().st_size // 1024} KB)")
                set_thumbnail(valid_access_token(row), video_id, jpg)
            except Exception as exc:  # noqa: BLE001
                print(f"  ! Không tạo/đặt được thumbnail (video đã lên): {exc}")
        if not args.no_comment:
            post_comment(valid_access_token(row), video_id, main_comment(meta))
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
