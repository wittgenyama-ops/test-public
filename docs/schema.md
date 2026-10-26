# 文献データのスキーマ（`data/papers.yaml`）

1件の文献につき1エントリ。`scripts/build.py` が以下の規則で検証します。

| フィールド | 必須 | 内容 |
|---|---|---|
| `id` | ○ | 一意なキー。`第一著者姓+年+略称`（例: `bastani2025pnas`）。BibTeXキーにもなる |
| `title` | ○ | 原題 |
| `authors` | ○ | 著者リスト（`姓, イニシャル`） |
| `year` | ○ | 出版年（プレプリントは公開年） |
| `venue` | ○ | 掲載誌・会議・プレプリントサーバ |
| `doi` / `url` | どちらか | DOI を優先 |
| `peer_reviewed` | ○ | `true` / `false` |
| `design` | ○ | 下記の研究デザイン |
| `n` | | 標本サイズ（メタ分析は研究数または総参加者数。`notes` に明記） |
| `population` | | 対象者 |
| `ai_type` | | 使われたAIの種類 |
| `domains` | ○ | 認知領域タグ（下記） |
| `context` | ○ | 使用場面 |
| `direction` | ○ | 認知能力への効果の方向 |
| `findings` | ○ | 主要な知見（日本語要約） |
| `limitations` | | 限界 |
| `verification` | ○ | `abstract`（抄録・二次情報で確認）/ `fulltext`（本文確認済み） |
| `notes` | | 補足 |

## 許容値

- **design**: `rct`, `experiment`（無作為化された実験室・オンライン実験で RCT と呼ばないもの）, `longitudinal`, `observational`, `survey`, `qualitative`, `meta_analysis`, `review`
- **direction**: `negative`（能力低下・依存）, `positive`（向上・保護）, `mixed`（条件依存・課題中は向上だが保持は低下など）, `null`, `theory`
- **context**: `education`, `writing`, `programming`, `medicine`, `work`, `information_seeking`, `problem_solving`, `everyday`, `theory`

`domains` は自由タグですが、分析での集計のため既存タグを優先して使ってください
（`critical_thinking`, `memory`, `metacognition`, `learning`, `skill_acquisition`, `creativity`,
`deskilling`, `automation_bias`, `cognitive_offloading`, `spatial_memory`, `belief` など）。

## エビデンスの重み付けの目安

本プロジェクトでは、次の順に重みを置いて統合します。

1. 事前登録された RCT／「AIを外した後の能力」を測った無作為化実験
2. 縦断研究・自然実験
3. 無作為化を伴う短期実験（課題中のパフォーマンスのみ）
4. 横断調査・観察研究
5. 質的研究・理論・プレプリント（未査読）は仮説生成として扱う

特に **「AIを使っている最中の成績（performance）」と「AIを外した後の能力（capability）」を区別**することが、
この領域の知見を読み解く鍵です（例: `bastani2025pnas`）。
