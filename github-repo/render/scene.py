"""Dựng từng khung hình: cảnh nhiều lớp cuộn, thú cưỡi (không nhân vật), quái vật, boss."""
from __future__ import annotations

import math
import random
from dataclasses import dataclass

from PIL import Image

from .assets import Boss, Monster, Mount, Scenery

WORLD_SPEED = 0.20  # chiều rộng khung hình / giây
LAYER_SPEED = {"far": 0.08, "mid": 0.25, "near": 0.55, "road": 1.0}
# (chiều cao theo H, mép dưới so với đỉnh đường theo H)
LAYER_GEOM = {"far": (0.32, 0.03), "mid": (0.38, 0.04), "near": (0.26, 0.07)}
ROAD_H = 0.20
FADE_IN = 1.0
FADE_OUT = 1.5


def _union_crop(frames: list[Image.Image]) -> list[Image.Image]:
    boxes = [f.getchannel("A").getbbox() for f in frames]
    boxes = [b for b in boxes if b]
    if not boxes:
        return frames
    box = (min(b[0] for b in boxes), min(b[1] for b in boxes),
           max(b[2] for b in boxes), max(b[3] for b in boxes))
    return [f.crop(box) for f in frames]


def _fit_h(im: Image.Image, h: int) -> Image.Image:
    h = max(1, int(h))
    return im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)


class ScrollLayer:
    def __init__(self, img: Image.Image, width: int, height: int, y: int, speed: float, opaque: bool):
        img = _fit_h(img, height)
        mode = "RGB" if opaque else "RGBA"
        src = img.convert(mode)
        if not opaque:
            # Lật gương mỗi ô liền kề để che đường nối của lớp nền không lặp liền mạch.
            mirrored = src.transpose(Image.FLIP_LEFT_RIGHT)
            src = Image.new(mode, (img.width * 2, img.height))
            src.paste(img, (0, 0))
            src.paste(mirrored, (img.width, 0))
        self.w, self.h, self.y, self.speed, self.W = src.width, src.height, y, speed, width
        n = math.ceil((width + src.width) / src.width) + 1
        self.strip = Image.new(mode, (src.width * n, src.height))
        for i in range(n):
            self.strip.paste(src, (i * src.width, 0))
        self.opaque = opaque

    def draw(self, frame: Image.Image, scroll_px: float) -> None:
        off = int(scroll_px * self.speed) % self.w
        crop = self.strip.crop((off, 0, off + self.W, self.h))
        if self.opaque:
            frame.paste(crop, (0, self.y))
        else:
            frame.paste(crop, (0, self.y), crop)


@dataclass
class MonsterInstance:
    frames: list[Image.Image]
    kind: str
    t0: float
    speed: float
    x0: float
    ground: float
    fly_y: float
    fate: str  # "hit" | "jump"
    t_hit: float = 0.0
    hit_x: float = 0.0


class Scene:
    def __init__(self, W: int, H: int, fps: int, duration: float, scenery: Scenery,
                 mount: Mount, boss: Boss, monsters: list[Monster], rng: random.Random):
        self.W, self.H, self.fps, self.T, self.rng = W, H, fps, duration, rng
        self.road_top = int(H * (1 - ROAD_H))
        self.ground = self.road_top + 0.40 * H * ROAD_H
        self.scroll_speed = WORLD_SPEED * W

        sky = scenery.layers.get("sky")
        if sky:
            s = max(W / sky.width, H / sky.height)
            sk = sky.resize((math.ceil(sky.width * s), math.ceil(sky.height * s)), Image.LANCZOS)
            self.base = sk.crop(((sk.width - W) // 2, 0, (sk.width - W) // 2 + W, H)).convert("RGB")
        else:
            self.base = Image.new("RGB", (W, H), (110, 170, 230))

        self.back_layers: list[ScrollLayer] = []
        for name in ("far", "mid", "near"):
            img = scenery.layers.get(name)
            if img:
                hf, below = LAYER_GEOM[name]
                h = int(H * hf)
                y = int(self.road_top + below * H - h)
                self.back_layers.append(ScrollLayer(img, W, h, y, LAYER_SPEED[name], False))
        road = scenery.layers.get("road")
        self.road = ScrollLayer(road, W, H - self.road_top, self.road_top, 1.0, True) if road else None

        mount_frames = _union_crop(mount.run + [mount.idle, mount.up, mount.down])
        mh = int(H * 0.30)
        scaled = [_fit_h(f, mh) for f in mount_frames]
        n = len(mount.run)
        self.mount_run, self.mount_up, self.mount_down = scaled[:n], scaled[n + 1], scaled[n + 2]
        self.mount_w = scaled[0].width
        self.mount_x = int(W * 0.10)
        self.jump_peak = H * 0.24

        boss_frames = _union_crop(list(boss.states.values()))
        bh = int(H * 0.52)
        self.boss = {k: _fit_h(v, bh) for k, v in zip(boss.states.keys(), boss_frames)}
        self.boss_x = int(W * 0.70)
        self.boss_in = duration * rng.uniform(0.18, 0.30)
        self.boss_in_dur = 4.0
        self.spit_period = rng.uniform(8.0, 11.0)

        self.monsters = self._plan_monsters(monsters)
        self.jumps = [(m.t_hit - 0.55, 1.1) for m in self.monsters if m.fate == "jump"]

    def _plan_monsters(self, pool: list[Monster]) -> list[MonsterInstance]:
        out: list[MonsterInstance] = []
        order: list[Monster] = []
        t = 2.5
        hit_x = self.mount_x + self.mount_w * 0.80
        while t < self.T - 6:
            if not order:
                order = pool[:]
                self.rng.shuffle(order)
            m = order.pop()
            frames = _union_crop(m.frames)
            if m.kind == "fly":
                h = int(self.H * self.rng.uniform(0.12, 0.20))
                extra = 0.10 * self.W
            else:
                h = int(self.H * self.rng.uniform(0.15, 0.24))
                extra = 0.05 * self.W
            frames = [_fit_h(f, h) for f in frames]
            speed = self.scroll_speed + extra
            x0 = self.W + 40
            inst = MonsterInstance(
                frames=frames, kind=m.kind, t0=t, speed=speed, x0=x0, ground=self.ground,
                fly_y=self.H * self.rng.uniform(0.18, 0.50),
                fate=self.rng.choice(["hit", "jump"]),
            )
            inst.hit_x = hit_x
            inst.t_hit = t + (x0 - hit_x) / speed
            out.append(inst)
            t += self.rng.uniform(4.5, 8.5)
        return out

    # ---- vẽ ----
    def _mount_pose(self, t: float):
        off = 0.0
        pose = None
        for start, dur in self.jumps:
            if start <= t < start + dur:
                p = (t - start) / dur
                off = self.jump_peak * 4 * p * (1 - p)
                pose = self.mount_up if p < 0.5 else self.mount_down
        if pose is None:
            pose = self.mount_run[int(t * 12) % len(self.mount_run)]
        return pose, off

    def _draw_mount(self, frame: Image.Image, t: float) -> None:
        pose, off = self._mount_pose(t)
        bob = 0 if off else math.sin(t * 12 * math.pi / len(self.mount_run) * 2) * self.H * 0.004
        y = int(self.ground - pose.height - off + bob)
        frame.paste(pose, (self.mount_x, y), pose)

    def _boss_state(self, t: float) -> str:
        p = (t - self.boss_in) / max(1.0, self.T - self.boss_in)
        if "spit" in self.boss and (t - self.boss_in) % self.spit_period > self.spit_period - 1.4 and t > self.boss_in + 5:
            return "spit"
        order = [["calm"], ["annoyed", "irritated"], ["enraged", "furious"], ["evil"]]
        idx = 0 if p < 0.2 else 1 if p < 0.4 else 2 if p < 0.7 else 3
        for i in range(idx, -1, -1):
            for name in order[i]:
                if name in self.boss:
                    return name
        return "calm"

    def _draw_boss(self, frame: Image.Image, t: float) -> None:
        if t < self.boss_in:
            return
        img = self.boss[self._boss_state(t)]
        k = min(1.0, (t - self.boss_in) / self.boss_in_dur)
        ease = 1 - (1 - k) ** 3
        x = int(self.W + 20 + (self.boss_x - self.W - 20) * ease)
        y = int(self.H * 0.08 + math.sin(t * 1.6) * self.H * 0.02)
        frame.paste(img, (x, y), img)

    def _draw_monster(self, frame: Image.Image, m: MonsterInstance, t: float) -> None:
        if t < m.t0:
            return
        frames = m.frames
        left = m.x0 - m.speed * (t - m.t0)
        knocked = m.fate == "hit" and m.kind != "fly" and t >= m.t_hit
        anim_t = (min(t, m.t_hit) if knocked else t) - m.t0
        img = frames[int(anim_t * 8) % len(frames)]
        if m.kind == "fly":
            y = m.fly_y + math.sin((t - m.t0) * 3) * self.H * 0.015
        else:
            y = m.ground - img.height
        if knocked:
            dt = t - m.t_hit
            if dt > 0.9:
                return
            left = m.hit_x + 0.30 * self.W * dt
            y = m.ground - img.height - (0.65 * self.H * dt - 1.3 * self.H * dt * dt)
            img = img.rotate(-540 * dt, expand=True, resample=Image.BICUBIC)
            alpha = img.getchannel("A").point(lambda v: int(v * max(0.0, 1 - dt / 0.9)))
            img.putalpha(alpha)
        if left > self.W or left + img.width < 0:
            return
        frame.paste(img, (int(left), int(y)), img)

    def render(self, t: float) -> Image.Image:
        frame = self.base.copy()
        scroll = self.scroll_speed * t
        for layer in self.back_layers:
            layer.draw(frame, scroll)
        if self.road:
            self.road.draw(frame, scroll)
        self._draw_mount(frame, t)
        self._draw_boss(frame, t)
        for m in self.monsters:
            self._draw_monster(frame, m, t)
        fade = min(1.0, t / FADE_IN, (self.T - t) / FADE_OUT)
        if fade < 1.0:
            frame = Image.blend(Image.new("RGB", frame.size), frame, max(0.0, fade))
        return frame
