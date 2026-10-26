#!/usr/bin/env python3
"""OpenAlex と arXiv から新しい候補文献を取得し、inbox/ に書き出す。

使い方:
  python scripts/fetch_new.py                    # 過去30日分
  python scripts/fetch_new.py --since 2026-09-01
  python scripts/fetch_new.py --per-query 10

docs/search_queries.yaml の検索語ごとに検索し、data/papers.yaml に
既に登録済みの文献（DOI またはタイトル一致）を除いて
inbox/candidates-YYYY-MM-DD.md に一覧を出力する。
"""
import argparse
import datetime as dt
import json
import pathlib
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
QUERIES = ROOT / "docs" / "search_queries.yaml"
PAPERS = ROOT / "data" / "papers.yaml"
INBOX = ROOT / "inbox"
USER_AGENT = "ai-cognition-literature/0.1 (research literature tracker)"
ATOM = "{http://www.w3.org/2005/Atom}"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def norm_title(title):
    return re.sub(r"[^a-z0-9]", "", title.lower())


def norm_doi(doi):
    return (doi or "").lower().removeprefix("https://doi.org/") or None


def openalex_url(query, since, n):
    params = {
        "search": query,
        "filter": f"from_publication_date:{since}",
        "sort": "publication_date:desc",
        "per-page": n,
    }
    return "https://api.openalex.org/works?" + urllib.parse.urlencode(params)


def parse_openalex(data):
    out = []
    for w in json.loads(data).get("results", []):
        out.append({
            "title": w.get("title") or "",
            "date": w.get("publication_date") or "",
            "doi": norm_doi(w.get("doi")),
            "url": w.get("doi") or w.get("id"),
            "venue": ((w.get("primary_location") or {}).get("source") or {}).get("display_name") or "",
            "source": "OpenAlex",
        })
    return out


def arxiv_url(query, n):
    params = {
        "search_query": f'all:"{query}"',
        "sortBy": "submittedDate",
        "sortOrder": "descending",
        "max_results": n,
    }
    return "https://export.arxiv.org/api/query?" + urllib.parse.urlencode(params)


def parse_arxiv(data, since):
    out = []
    for e in ET.fromstring(data).iter(f"{ATOM}entry"):
        date = e.findtext(f"{ATOM}published", "")[:10]
        if date < since:
            continue
        out.append({
            "title": " ".join(e.findtext(f"{ATOM}title", "").split()),
            "date": date,
            "doi": None,
            "url": e.findtext(f"{ATOM}id", ""),
            "venue": "arXiv",
            "source": "arXiv",
        })
    return out


def known_keys():
    papers = yaml.safe_load(PAPERS.read_text(encoding="utf-8")) or []
    dois = {norm_doi(p.get("doi")) for p in papers if p.get("doi")}
    titles = {norm_title(p["title"]) for p in papers}
    return dois, titles


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", default=(dt.date.today() - dt.timedelta(days=30)).isoformat())
    ap.add_argument("--per-query", type=int, default=15)
    args = ap.parse_args()

    queries = yaml.safe_load(QUERIES.read_text(encoding="utf-8"))["queries"]
    dois, titles = known_keys()
    found = {}
    for q in queries:
        for name, fetch in (
            ("OpenAlex", lambda: parse_openalex(get(openalex_url(q, args.since, args.per_query)))),
            ("arXiv", lambda: parse_arxiv(get(arxiv_url(q, args.per_query)), args.since)),
        ):
            try:
                results = fetch()
            except Exception as exc:  # ネットワーク障害は他の検索を止めない
                print(f"[warn] {name} '{q}': {exc}", file=sys.stderr)
                continue
            for r in results:
                key = norm_title(r["title"])
                if not key or key in titles or (r["doi"] and r["doi"] in dois):
                    continue
                found.setdefault(key, {**r, "queries": set()})["queries"].add(q)

    INBOX.mkdir(exist_ok=True)
    out = INBOX / f"candidates-{dt.date.today().isoformat()}.md"
    lines = [f"# 候補文献（{args.since} 以降, {len(found)} 件）", "",
             "包含基準（docs/protocol.md）を満たすものを data/papers.yaml に追加する。", ""]
    for r in sorted(found.values(), key=lambda r: r["date"], reverse=True):
        lines.append(f"- [ ] **{r['title']}** ({r['date']}, {r['venue']}) "
                     f"[{r['source']}]({r['url']}) — 検索語: {', '.join(sorted(r['queries']))}")
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{len(found)} 件の候補 -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
