"""Xóa kịch bản ưu tiên và cảnh chon-canh-vat đã dùng trên host (chạy sau khi upload YouTube thành công)."""
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
    client = HostClient(args.host, args.token, Path(args.cache))

    if plan.get("scenarioId"):
        client.delete_scenario(plan["scenarioId"])
        print(f"Đã xóa kịch bản ưu tiên {plan['scenarioId']}")
    else:
        print("Không dùng kịch bản ưu tiên.")

    if plan.get("sceneryFromPriority"):
        client.delete("priority_scenery", plan["scenery"])
        print(f"Đã xóa {plan['scenery']} khỏi chon-canh-vat")


if __name__ == "__main__":
    main()
