# 文献収集プロトコル

## 研究課題（RQ）

- **RQ1**: 生成AI・AI支援ツールの使用は、記憶・批判的思考・メタ認知・創造性・専門技能などの人間の認知能力にどのような変化をもたらすか。
- **RQ2**: その効果は「使用中のパフォーマンス」と「AIを外した後の能力」で異なるか。
- **RQ3**: どのような使い方・設計（ガードレール、メタ認知的支援など）が負の影響を緩和するか。

## 対象（包含基準）

- AI（生成AI/LLM、診断支援AI、推薦・ナビゲーション等）の使用と、人間の認知的アウトカムの関係を実証的に扱う研究
- 理論的基盤として、先行技術（検索エンジン、GPS）による認知的オフローディング研究も含める
- 査読論文を優先。影響力の大きいプレプリントは `peer_reviewed: false` として登録
- 言語: 英語・日本語

## 除外基準

- AIの性能評価のみで人間側の認知アウトカムがないもの
- 意見論説で実証データも理論的貢献もないもの

## 検索

- 検索語は `docs/search_queries.yaml` で管理
- 主な情報源: OpenAlex、arXiv（`scripts/fetch_new.py` で自動化）、Google Scholar、PubMed、CiNii（日本語文献）
- 実施した検索は `docs/search_log.md` に日付・検索語・件数を記録する

## スクリーニングの流れ

1. `python scripts/fetch_new.py` で候補を `inbox/` に出力
2. タイトル・抄録で包含基準を確認し、採用するものを `data/papers.yaml` に追加（`verification: abstract`）
3. 本文を読んだら `notes/<id>.md` に読書ノートを作成し、`verification: fulltext` に更新
4. `python scripts/build.py` でエビデンス表と BibTeX を再生成
5. 新しい知見で `analysis/synthesis.md` と `paper/draft.md` を更新

## 更新頻度

月1回の定期検索を目安とする（この分野は月単位で新しい研究が出ているため）。
