"""Tạo tiêu đề, mô tả, tag tiếng Anh chuẩn SEO bằng DeepSeek (kèm bản dự phòng)."""
from __future__ import annotations

import json
import os
import re
import time

import requests

DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
DEEPSEEK_MODEL = "deepseek-flash"
DEEPSEEK_RETRIES = 3
# Latin chữ có dấu (Việt, Pháp...), CJK, Cyrillic, Thái... => coi là không phải tiếng Anh
NON_ENGLISH_RE = re.compile(r"[\u00C0-\u024F\u1E00-\u1EFF\u0370-\u04FF\u0E00-\u0E7F\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]")
REQUIRED_KEYS = ("title", "description", "tags", "short_title", "short_description", "hooks")

TITLE_MAX = 90
SHORT_TITLE_MAX = 60
SHORT_DESC_MAX = 1500
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
    "Write ALL output strictly in English only (international audience); never use Vietnamese or any other language. Write in natural, fluent English. Never use clickbait that the video cannot deliver, "
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
        "ALSO create the companion YouTube Short (a 20-30 second highlight montage of the same video). "
        "It must reuse the SAME main keywords as the long video so both are consistent for search and suggestions. "
        "Add these keys:\n"
        f'- "short_title": string, 35-{SHORT_TITLE_MAX} characters, a curiosity hook with the boss or mount name, '
        'no hashtags, no emoji spam (max 1). Do not add "#Shorts" yourself.\n'
        '- "short_description": string, 250-700 characters. Line 1 is the hook with the main keywords. '
        'Then 1-2 sentences on what the clip shows, then the exact placeholder line "WATCH_FULL: {MAIN_URL}" '
        "(keep the placeholder text exactly), then 3-5 hashtags including #shorts. No other links.\n"
        '- "short_tags": array of 8-14 strings, each under 30 characters, lowercase, no hashtags, no duplicates.\n'
        '- "hooks": array of 6 punchy on-screen banners for the Short, each 2-4 words, max 20 characters, '
        "UPPERCASE ASCII letters/digits/!/? only, no emoji, ordered: attention hook, tension, monster action, "
        "boss reveal, climax, payoff. They must be truthful to the facts.\n"
        '- "end_cta": string, max 24 characters, UPPERCASE ASCII, tells viewers to watch the full video (e.g. FULL BATTLE ON MY CHANNEL).\n'
        '- "comment": string, 80-220 characters, a friendly first comment under the Short inviting viewers to watch '
        'the full battle, containing the exact placeholder "{MAIN_URL}", plus one question to spark replies.\n'
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


def _clean_title(title: str, limit: int = TITLE_MAX) -> str:
    title = re.sub(r"[<>]", "", str(title)).strip().strip('"')
    if len(title) > limit:
        title = title[:limit].rsplit(" ", 1)[0]
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
    boss, mount = facts["boss"], facts["mount"]
    return {
        "title": title,
        "description": desc,
        "tags": [],
        "short_title": _clean_title(f"{boss} vs {mount}: Epic Monster Battle Highlights", SHORT_TITLE_MAX),
        "short_description": (
            f"{boss} vs {mount} in a fantasy monster battle - watch the highlights!\n"
            f"Quick montage from a full 2K animation set in {facts['setting']}.\n\n"
            "WATCH_FULL: {MAIN_URL}\n\n#shorts #bossbattle #fantasyanimation"
        ),
        "short_tags": [],
        "hooks": ["WAIT FOR IT!", "THEY ARE COMING", "MONSTERS ATTACK!", f"{boss}".upper()[:20], "FINAL CLASH!", "WHO WINS?"],
        "end_cta": "FULL BATTLE ON MY CHANNEL",
        "comment": "Want to see who wins? Watch the full battle here: {MAIN_URL} - which side are you on?",
    }


def generate(meta: dict, api_key: str | None = None) -> dict:
    facts = build_facts(meta)
    api_key = api_key or os.environ.get("DEEPSEEK_API_KEY", "")
    result = None
    if api_key:
        prompt = build_prompt(facts)
        for attempt in range(1, DEEPSEEK_RETRIES + 1):
            try:
                r = requests.post(
                    DEEPSEEK_URL,
                    headers={"Authorization": f"Bearer {api_key}"},
                    json={
                        "model": DEEPSEEK_MODEL,
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": prompt},
                        ],
                        "response_format": {"type": "json_object"},
                        "thinking": {"type": "disabled"},
                        "max_tokens": 3500,
                    },
                    timeout=120,
                )
                r.raise_for_status()
                data = json.loads(r.json()["choices"][0]["message"]["content"])
                if not isinstance(data, dict):
                    raise ValueError("kết quả không phải JSON object")
                missing = [k for k in REQUIRED_KEYS if not data.get(k)]
                if missing:
                    raise ValueError(f"thiếu trường: {', '.join(missing)}")
                text = json.dumps(data, ensure_ascii=False)
                if NON_ENGLISH_RE.search(text):
                    raise ValueError("nội dung chứa ký tự không phải tiếng Anh")
                result = data
                break
            except Exception as exc:  # noqa: BLE001
                print(f"  ! DeepSeek lỗi (lần {attempt}/{DEEPSEEK_RETRIES}): {exc}")
                if attempt < DEEPSEEK_RETRIES:
                    time.sleep(2 * attempt)
        if result is None:
            print("  ! DeepSeek thất bại sau nhiều lần thử, dùng nội dung dự phòng")
    else:
        print("  ! Thiếu DEEPSEEK_API_KEY, dùng nội dung dự phòng")

    base = fallback(facts)
    result = result if isinstance(result, dict) else {}
    title = _clean_title(result.get("title") or base["title"])
    description = str(result.get("description") or base["description"]).replace("<", "").replace(">", "")
    description = description[:DESC_MAX].strip()
    names = [facts["setting"], facts["mount"], facts["boss"], *facts["monsters"]]
    tags = _clean_tags(result.get("tags"), extra=["fantasy animation", "boss battle", "monster battle", *names])
    short = _short_fields(result, base, facts, tags)
    return {"title": title, "description": description, "tags": tags, **short}


def _ascii_banner(text: str, limit: int) -> str:
    text = re.sub(r"[^A-Z0-9!?\- ]", "", str(text).upper()).strip()
    text = re.sub(r"\s+", " ", text)
    if len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0]
    return text


def _short_fields(result: dict, base: dict, facts: dict, main_tags: list[str]) -> dict:
    """Làm sạch phần dành cho Short; thiếu trường nào dùng bản dự phòng để không bao giờ hỏng."""
    short_title = _clean_title(result.get("short_title") or base["short_title"], SHORT_TITLE_MAX)
    desc = str(result.get("short_description") or base["short_description"]).replace("<", "").replace(">", "")
    if "{MAIN_URL}" not in desc:
        desc = f"{desc.strip()}\n\nWATCH_FULL: {{MAIN_URL}}"
    if "#shorts" not in desc.lower():
        desc = f"{desc.strip()}\n\n#shorts"
    names = [facts["setting"], facts["mount"], facts["boss"]]
    stags = _clean_tags(result.get("short_tags"), extra=["shorts", "fantasy animation", "boss battle", *names])
    hooks = [h for h in (_ascii_banner(h, 20) for h in (result.get("hooks") or [])) if h][:6]
    for fb in base["hooks"]:
        if len(hooks) >= 6:
            break
        hooks.append(_ascii_banner(fb, 20))
    end_cta = _ascii_banner(result.get("end_cta") or base["end_cta"], 26) or base["end_cta"]
    comment = str(result.get("comment") or base["comment"]).replace("<", "").replace(">", "")
    if "{MAIN_URL}" not in comment:
        comment = f"{comment.strip()} {{MAIN_URL}}"
    return {
        "short_title": short_title,
        "short_description": desc[:SHORT_DESC_MAX].strip(),
        "short_tags": stags,
        "hooks": hooks,
        "end_cta": end_cta,
        "comment": comment[:500],
    }
