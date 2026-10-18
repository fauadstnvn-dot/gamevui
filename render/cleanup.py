"""Xóa cảnh vật đã dùng trong chon-canh-vat trên host sau khi video dựng thành công."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from .assets import HostClient


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default=os.environ.get("ASSET_HOST_URL", ""))
    ap.add_argument("--token", default=os.environ.get("ASSET_HOST_TOKEN", ""))
    ap.add_argument("--plan", default="plan.json")
    ap.add_argument("--cache", default=".cache")
    args = ap.parse_args()
    plan = json.loads(Path(args.plan).read_text(encoding="utf-8"))
    if not plan.get("sceneryFromPriority"):
        print("Cảnh lấy từ canh-vat, không xóa.")
        return
    client = HostClient(args.host, args.token, Path(args.cache))
    client.delete("priority_scenery", plan["scenery"])
    print(f"Đã xóa {plan['scenery']} khỏi chon-canh-vat")


if __name__ == "__main__":
    main()
