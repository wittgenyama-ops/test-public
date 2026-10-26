#!/usr/bin/env python3
"""data/papers.yaml を検証し、エビデンス表と BibTeX を生成する。

使い方: python scripts/build.py
出力:
  analysis/evidence_matrix.md  文献一覧と集計表
  paper/references.bib         論文執筆用の参考文献
"""
import collections
import pathlib
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAPERS = ROOT / "data" / "papers.yaml"
MATRIX = ROOT / "analysis" / "evidence_matrix.md"
BIB = ROOT / "paper" / "references.bib"

REQUIRED = ["id", "title", "authors", "year", "venue", "peer_reviewed",
            "design", "domains", "context", "direction", "findings", "verification"]
DESIGNS = {"rct", "experiment", "longitudinal", "observational", "survey",
           "qualitative", "meta_analysis", "review"}
DIRECTIONS = {"negative", "positive", "mixed", "null", "theory"}
CONTEXTS = {"education", "writing", "programming", "medicine", "work",
            "information_seeking", "problem_solving", "everyday", "theory"}
VERIFICATION = {"abstract", "fulltext"}

DIRECTION_JA = {"negative": "負", "positive": "正", "mixed": "条件依存",
                "null": "効果なし", "theory": "理論"}
DESIGN_JA = {"rct": "RCT", "experiment": "実験", "longitudinal": "縦断",
             "observational": "観察", "survey": "調査", "qualitative": "質的",
             "meta_analysis": "メタ分析", "review": "レビュー/理論"}


def load():
    with PAPERS.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or []


def validate(papers):
    errors = []
    seen = set()
    for i, p in enumerate(papers):
        pid = p.get("id", f"#{i}")
        for key in REQUIRED:
            if p.get(key) in (None, "", []):
                errors.append(f"{pid}: 必須フィールド '{key}' がありません")
        if not (p.get("doi") or p.get("url")):
            errors.append(f"{pid}: doi か url のどちらかが必要です")
        if pid in seen:
            errors.append(f"{pid}: id が重複しています")
        seen.add(pid)
        for key, allowed in (("design", DESIGNS), ("direction", DIRECTIONS),
                             ("context", CONTEXTS), ("verification", VERIFICATION)):
            if p.get(key) is not None and p[key] not in allowed:
                errors.append(f"{pid}: {key}='{p[key]}' は許容値ではありません {sorted(allowed)}")
    return errors


def link(p):
    if p.get("doi"):
        return f"https://doi.org/{p['doi']}"
    return p["url"]


def cell(text):
    return " ".join(str(text).split()).replace("|", "\\|")


def build_matrix(papers):
    papers = sorted(papers, key=lambda p: (-p["year"], p["id"]))
    lines = [
        "# エビデンス・マトリクス",
        "",
        "> `scripts/build.py` が `data/papers.yaml` から自動生成。直接編集しないこと。",
        "",
        f"収録文献数: **{len(papers)}**　"
        f"（査読済み {sum(p['peer_reviewed'] for p in papers)}、"
        f"本文確認済み {sum(p['verification'] == 'fulltext' for p in papers)}）",
        "",
        "## 認知領域 × 効果の方向",
        "",
    ]
    by_domain = collections.defaultdict(collections.Counter)
    for p in papers:
        for d in p["domains"]:
            by_domain[d][p["direction"]] += 1
    dirs = ["negative", "mixed", "positive", "null", "theory"]
    lines.append("| 領域 | " + " | ".join(DIRECTION_JA[d] for d in dirs) + " | 計 |")
    lines.append("|---" * (len(dirs) + 2) + "|")
    for d, c in sorted(by_domain.items(), key=lambda kv: -sum(kv[1].values())):
        lines.append(f"| {d} | " + " | ".join(str(c[x] or "") for x in dirs)
                     + f" | {sum(c.values())} |")

    lines += ["", "## 研究デザイン別件数", "", "| デザイン | 件数 |", "|---|---|"]
    for d, n in collections.Counter(p["design"] for p in papers).most_common():
        lines.append(f"| {DESIGN_JA[d]} | {n} |")

    lines += ["", "## 文献一覧", "",
              "| 年 | 文献 | デザイン | N | 場面 | 方向 | 主要知見 | 確認 |",
              "|---|---|---|---|---|---|---|---|"]
    for p in papers:
        first = p["authors"][0].split(",")[0]
        etal = " et al." if len(p["authors"]) > 1 else ""
        pr = "" if p["peer_reviewed"] else "（未査読）"
        lines.append(
            f"| {p['year']} | [{first}{etal}]({link(p)}) `{p['id']}`{pr} | "
            f"{DESIGN_JA[p['design']]} | {p.get('n', '')} | {p['context']} | "
            f"{DIRECTION_JA[p['direction']]} | {cell(p['findings'])} | {p['verification']} |")
    return "\n".join(lines) + "\n"


def bib_escape(text):
    return str(text).replace("&", r"\&").replace("%", r"\%")


def build_bib(papers):
    entries = []
    for p in sorted(papers, key=lambda p: p["id"]):
        kind = "article" if p["peer_reviewed"] else "misc"
        fields = {
            "title": "{" + bib_escape(p["title"]) + "}",
            "author": " and ".join(p["authors"]),
            "year": p["year"],
            ("journal" if kind == "article" else "howpublished"): bib_escape(p["venue"]),
        }
        if p.get("doi"):
            fields["doi"] = p["doi"]
        if p.get("url"):
            fields["url"] = p["url"]
        body = ",\n".join(f"  {k} = {{{v}}}" for k, v in fields.items())
        entries.append(f"@{kind}{{{p['id']},\n{body}\n}}")
    return "\n\n".join(entries) + "\n"


def main():
    papers = load()
    errors = validate(papers)
    if errors:
        print("検証エラー:", *errors, sep="\n  ", file=sys.stderr)
        return 1
    MATRIX.parent.mkdir(exist_ok=True)
    BIB.parent.mkdir(exist_ok=True)
    MATRIX.write_text(build_matrix(papers), encoding="utf-8")
    BIB.write_text(build_bib(papers), encoding="utf-8")
    print(f"{len(papers)} 件を検証しました -> {MATRIX.relative_to(ROOT)}, {BIB.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
