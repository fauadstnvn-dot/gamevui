"""Tạo tiêu đề, mô tả, tag tiếng Anh chuẩn SEO bằng DeepSeek (kèm bản dự phòng)."""
from __future__ import annotations

import json
import os
import re

import requests

DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
DEEPSEEK_MODEL = "deepseek-flash"

TITLE_MAX = 90
DESC_MAX = 4500
TAGS_MAX_CHARS = 450


def pretty(zip_name: str) -> str:
    """'fire-mole.zip' -> 'Fire Mole'."""
    base = re.sub(r"\.zip$", "", zip_name, flags=re.I)
    return " ".join(w.capitalize() for w in re.split(r"[-_\s]+", base) if w)


def build_facts(meta: dict) -> dict:
    """Chỉ gửi dữ kiện ngắn có giá trị SEO; không gửi ảnh/đường dẫn/seed/thông tin kỹ thuật nội bộ."""
    minutes, seconds = divmod(int(meta["duration"]), 60)
    return {
        "setting": pretty(meta["scenery"]),
        "mount": pretty(meta["mount"]),
        "boss": pretty(meta["boss"]),
        "monsters": [pretty(m) for m in meta["monsters"]],
        "length": f"{minutes}:{seconds:02d}",
        "format": "2K (1440p) 2D side-scrolling fantasy battle animation, no dialogue, no narration",
    }


SYSTEM_PROMPT = (
    "You are a YouTube SEO copywriter for a fantasy game-style animation channel. "
    "Write in natural, fluent English. Never use clickbait that the video cannot deliver, "
    "never invent story, characters or features that are not in the facts, never mention that you are an AI, "
    "and never mention 'seed' or file names. Reply with ONE JSON object only."
)


def build_prompt(facts: dict) -> str:
    return (
        "Create YouTube metadata for this video.\n"
        f"FACTS: {json.dumps(facts, ensure_ascii=False)}\n\n"
        "Return JSON with exactly these keys:\n"
        f'- "title": string, 55-{TITLE_MAX - 20} characters, primary keyword near the start, '
        "mention the setting, the mount and the boss, no emoji spam (max 1), no ALL CAPS words.\n"
        '- "description": string, 900-2500 characters. First 2 sentences must contain the main keywords '
        "(they show in search results). Then: what happens (mount rides through the setting, fights monsters, "
        "boss battle), a bullet list of featured creatures, who it is for (fantasy, monster battle and "
        "creature-animation fans), a short note that it is a 2K animation with no dialogue, "
        "and end with 3-5 hashtags. Do not ask for likes/subscribes more than once, no links.\n"
        '- "tags": array of 15-25 strings, each under 30 characters, lowercase, mix of broad '
        "(fantasy animation, monster battle) and specific (the setting, mount, boss and monster names), "
        "no hashtags, no duplicates.\n"
    )


def _clean_tags(tags, extra=()) -> list[str]:
    out, seen, total = [], set(), 0
    for t in list(tags or []) + list(extra):
        t = re.sub(r"[#<>\"]", "", str(t)).strip().lower()
        if not t or len(t) > 30 or t in seen:
            continue
        if total + len(t) + 1 > TAGS_MAX_CHARS:
            break
        seen.add(t)
        out.append(t)
        total += len(t) + 1
    return out


def _clean_title(title: str) -> str:
    title = re.sub(r"[<>]", "", str(title)).strip().strip('"')
    if len(title) > TITLE_MAX:
        title = title[:TITLE_MAX].rsplit(" ", 1)[0]
    return title


def fallback(facts: dict) -> dict:
    monsters = facts["monsters"]
    title = _clean_title(f"{facts['boss']} Boss Battle: {facts['mount']} Ride Through {facts['setting']}")
    lines = "\n".join(f"- {m}" for m in monsters)
    desc = (
        f"Watch a {facts['mount']} race through {facts['setting']} and take on {facts['boss']} "
        f"in an epic 2K fantasy animation ({facts['length']}).\n\n"
        f"Along the way the rider fights off {len(monsters)} monsters:\n{lines}\n\n"
        "Made for fans of fantasy worlds, monster battles and creature animation. "
        "No dialogue or narration, just pure action.\n\n"
        "#fantasyanimation #bossbattle #monsterfight"
    )
    return {"title": title, "description": desc, "tags": []}


def generate(meta: dict, api_key: str | None = None) -> dict:
    facts = build_facts(meta)
    api_key = api_key or os.environ.get("DEEPSEEK_API_KEY", "")
    result = None
    if api_key:
        try:
            r = requests.post(
                DEEPSEEK_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": DEEPSEEK_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": build_prompt(facts)},
                    ],
                    "response_format": {"type": "json_object"},
                    "thinking": {"type": "disabled"},
                    "max_tokens": 2000,
                },
                timeout=120,
            )
            r.raise_for_status()
            result = json.loads(r.json()["choices"][0]["message"]["content"])
        except Exception as exc:  # noqa: BLE001
            print(f"  ! DeepSeek lỗi, dùng nội dung dự phòng: {exc}")
    else:
        print("  ! Thiếu DEEPSEEK_API_KEY, dùng nội dung dự phòng")

    base = fallback(facts)
    result = result if isinstance(result, dict) else {}
    title = _clean_title(result.get("title") or base["title"])
    description = str(result.get("description") or base["description"]).replace("<", "").replace(">", "")
    description = description[:DESC_MAX].strip()
    names = [facts["setting"], facts["mount"], facts["boss"], *facts["monsters"]]
    tags = _clean_tags(result.get("tags"), extra=["fantasy animation", "boss battle", "monster battle", *names])
    return {"title": title, "description": description, "tags": tags}
