# AI使用と人間の認知能力の変化：文献収集・分析・論文執筆

生成AI・AI支援ツールの使用が、人間の記憶・批判的思考・メタ認知・創造性・専門技能などに
どのような変化をもたらすかを扱った研究を継続的に収集・分析し、レビュー論文を執筆するためのリポジトリです。

## 構成

```
data/papers.yaml          文献データベース（唯一の正本）
docs/protocol.md          研究課題・包含基準・スクリーニング手順
docs/schema.md            papers.yaml のフィールド定義とエビデンスの重み付け
docs/search_queries.yaml  定期検索の検索語
docs/search_log.md        検索の記録
inbox/                    自動検索で見つかった候補（スクリーニング前）
notes/                    本文を読んだ文献の読書ノート（_template.md を複製）
analysis/synthesis.md     文献横断の統合分析（手書き）
analysis/evidence_matrix.md  文献一覧と集計表（自動生成）
paper/draft.md            論文草稿
paper/references.bib      参考文献（自動生成）
scripts/                  検証・生成・検索スクリプト
```

## 使い方

```sh
pip install pyyaml

# 1. 新しい候補文献を検索（OpenAlex + arXiv、既定は過去30日）
python scripts/fetch_new.py --since 2026-10-01

# 2. inbox/ の候補を確認し、採用するものを data/papers.yaml に追記

# 3. 検証して、エビデンス表と BibTeX を再生成
python scripts/build.py

# 4. 論文を Word に変換（pandoc が必要）
pandoc paper/draft.md --citeproc --bibliography paper/references.bib -o paper/draft.docx
```

## 現状（2026-10-27）

- 収録文献 **27件**（`analysis/evidence_matrix.md`）
- 主要7文献と Lee (2025)、Rismanchian (2026)、Stanković (2026) の計10件は**本文確認済み**（`verification: fulltext`）。読書ノートは `notes/`
- テーマ別の分析: 批判的思考（`analysis/critical_thinking.md`）、電卓とAIの比較（`analysis/calculator_vs_ai.md`）
- 暫定的な主張と研究ギャップは `analysis/synthesis.md` を参照

### 本文を取得できていない文献

arXiv、PMC（Europe PMC 経由）、一部の大学リポジトリには接続できる。次は未取得:
- 電卓のメタ分析（Hembree & Dessart 1986, Ellington 2003）: JSTOR がボット確認画面を返し、テネシー大学のリポジトリは接続不可
- Shaw & Nave (2026, SSRN)、Gerlich (2025)、Sun et al. (2026) など: 未試行または出版社サイトがブロック

PDF を `pdfs/`（git 管理外）に置けば本文確認を進められる。
