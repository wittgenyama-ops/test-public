# エビデンス・マトリクス

> `scripts/build.py` が `data/papers.yaml` から自動生成。直接編集しないこと。

収録文献数: **20**　（査読済み 18、本文確認済み 0）

## 認知領域 × 効果の方向

| 領域 | 負 | 条件依存 | 正 | 効果なし | 理論 | 計 |
|---|---|---|---|---|---|---|
| critical_thinking | 1 | 1 | 1 |  | 1 | 4 |
| metacognition |  | 2 |  |  | 1 | 3 |
| learning | 1 | 2 |  |  |  | 3 |
| deskilling | 1 |  |  |  | 1 | 2 |
| reasoning |  | 2 |  |  |  | 2 |
| skill_acquisition |  | 2 |  |  |  | 2 |
| cognitive_offloading | 1 |  |  |  | 1 | 2 |
| memory | 1 | 1 |  |  |  | 2 |
| cognitive_decline |  | 1 |  |  |  | 1 |
| dependence |  | 1 |  |  |  | 1 |
| conceptual_understanding |  | 1 |  |  |  | 1 |
| cognitive_aging |  |  | 1 |  |  | 1 |
| dementia_risk |  |  | 1 |  |  | 1 |
| professional_skill | 1 |  |  |  |  | 1 |
| attention | 1 |  |  |  |  | 1 |
| self_regulated_learning |  | 1 |  |  |  | 1 |
| neural_engagement | 1 |  |  |  |  | 1 |
| ownership | 1 |  |  |  |  | 1 |
| trust |  | 1 |  |  |  | 1 |
| knowledge_depth | 1 |  |  |  |  | 1 |
| creativity |  | 1 |  |  |  | 1 |
| homogenization |  | 1 |  |  |  | 1 |
| cognitive_load |  | 1 |  |  |  | 1 |
| automation_bias | 1 |  |  |  |  | 1 |
| judgment | 1 |  |  |  |  | 1 |
| belief | 1 |  |  |  |  | 1 |
| opinion_formation | 1 |  |  |  |  | 1 |
| autonomy | 1 |  |  |  |  | 1 |
| spatial_memory | 1 |  |  |  |  | 1 |
| transactive_memory |  | 1 |  |  |  | 1 |

## 研究デザイン別件数

| デザイン | 件数 |
|---|---|
| 実験 | 7 |
| RCT | 4 |
| 調査 | 3 |
| レビュー/理論 | 2 |
| メタ分析 | 2 |
| 観察 | 1 |
| 縦断 | 1 |

## 文献一覧

| 年 | 文献 | デザイン | N | 場面 | 方向 | 主要知見 | 確認 |
|---|---|---|---|---|---|---|---|
| 2026 | [Fenici](https://doi.org/10.1515/humaff-2026-0011) `fenici2026humaff` | レビュー/理論 |  | theory | 理論 | 信頼→委任→「補完的」から「代替的」委任への漂流、という過程で独立した批判的思考が 侵食されうるとする理論モデル。足場かけ（scaffolding）と代替（substitution）を区別。 | abstract |
| 2026 | [Fernandes et al.](https://arxiv.org/abs/2409.16708) `fernandes2026chb` | 実験 | 698 | problem_solving | 条件依存 | LSAT論理推論課題でAI使用により成績は約3点向上するが、自己評価は約4点過大。 通常見られるダニング＝クルーガー効果は消失し、全員が一様に過大評価。 AIリテラシーが高いほどメタ認知精度が低い。初回出力をそのまま受容する傾向。 | abstract |
| 2026 | [Hoque et al.](https://doi.org/10.1002/acp.70269) `hoque2026acp` | 調査 |  | everyday | 条件依存 | AI依存と認知機能低下の関連を示す一方、利用者特性が媒介し、認知機能の低下は AI使用の不可避な帰結ではないと結論。 | abstract |
| 2026 | [Shen et al.](https://arxiv.org/abs/2601.20245) `shen2026coding`（未査読） | RCT | 52 | programming | 条件依存 | 未知の非同期ライブラリ（Trio）の習得課題。AI群は概念理解・コード読解・デバッグの理解度テストで 低得点（報告では約17%低い）、作業時間の短縮は平均では有意でなかった。 AI群内でも使い方で差が大きく、理解を求める使い方は高得点（65–86%）、全面委任は低得点（24–39%）。 | abstract |
| 2026 | [Sun et al.](https://doi.org/10.1007/s10648-026-10180-1) `sun2026edpsychrev` | メタ分析 | 26 | education | 正 | 生成AI支援学習は批判的思考パフォーマンスの向上と関連（g = 0.544, 95%CI [0.314, 0.775]）。 異質性が大きく、AIのチュータリング機能や「規定された使用方法」が調整変数。 | abstract |
| 2025 | [Bastani et al.](https://doi.org/10.1073/pnas.2422633122) `bastani2025pnas` | RCT | 1000 | education | 条件依存 | 練習中のAI利用で成績は向上（GPT Base +48%、GPT Tutor +127%）。しかしAIを外した試験では GPT Base群が非利用群より17%低下。答えの丸写し（crutch）が原因。学習保護型プロンプト （GPT Tutor）で悪影響はほぼ緩和。 | abstract |
| 2025 | [Benge et al.](https://doi.org/10.1038/s41562-025-02159-9) `benge2025nhb` | メタ分析 | 411430 | everyday | 正 | デジタル技術使用は認知障害のオッズ低下（OR 0.42）および認知機能低下の遅延（HR 0.74）と関連。 「デジタル認知症」仮説より「技術的予備力（technological reserve）」仮説を支持。 | abstract |
| 2025 | [Budzyń et al.](https://doi.org/10.1016/S2468-1253(25)00133-5) `budzyn2025lancetgh` | 観察 | 1443 | medicine | 負 | AI導入後、AIを使わない検査での腺腫発見率が28.4%→22.4%に低下（調整OR 0.69, 95%CI 0.53–0.89）。 継続的なAI曝露が内視鏡医の行動に負の影響を与える可能性。 | abstract |
| 2025 | [Fan et al.](https://arxiv.org/abs/2412.09315) `fan2025bjet` | RCT | 117 | writing | 条件依存 | ChatGPT・人間専門家・チェックリスト・支援なしの4条件。ChatGPT群はエッセイ得点が最も向上したが、 知識獲得・転移は他群と差なし。自己調整学習のプロセスが変化し、自省の代わりにAIへ戻る 「メタ認知的怠惰」を指摘。内発的動機づけに差なし。 | abstract |
| 2025 | [Gerlich](https://doi.org/10.3390/soc15010006) `gerlich2025societies` | 調査 | 666 | everyday | 負 | AI使用頻度と批判的思考の間に強い負の相関（報告値 r≈-0.68）。認知的オフローディングが媒介。 若年層ほどAI依存が高く批判的思考スコアが低い。高学歴はAI使用にかかわらず批判的思考が高い。 | abstract |
| 2025 | [Kosmyna et al.](https://arxiv.org/abs/2506.08872) `kosmyna2025brain`（未査読） | 実験 | 54 | writing | 負 | LLM群・検索エンジン群・ツールなし群でエッセイ執筆を比較。EEG上の脳内結合は 外部支援の量に応じて低下（ツールなし>検索>LLM）。LLM群は自分の書いた文の引用が困難で、 作品の所有感も低い。第4セッションでLLM→ツールなしに切り替えた群は結合が弱いまま。 | abstract |
| 2025 | [Lee et al.](https://doi.org/10.1145/3706598.3713778) `lee2025chi` | 調査 | 319 | work | 条件依存 | AIへの信頼が高いほど批判的思考の自己報告が少なく、自分の能力への自信が高いほど多い。 批判的思考の中身が「情報収集・問題解決」から「検証・統合・タスクの監督（stewardship）」へ移行。 | abstract |
| 2025 | [Melumad et al.](https://doi.org/10.1093/pnasnexus/pgaf316) `melumad2025pnasnexus` | 実験 | 10000 | information_seeking | 負 | LLM要約で学んだ人はウェブ検索で学んだ人より知識が浅く、作成した助言は短く独創性が低く、 受け手に採用されにくい。事実内容とプラットフォームを統制しても、合成済み要約という形式自体が 能動的な探索・統合を阻害する。 | abstract |
| 2024 | [Doshi et al.](https://doi.org/10.1126/sciadv.adn5290) `doshi2024sciadv` | 実験 |  | writing | 条件依存 | AIのアイデアを使うと物語の創造性・質の評価が向上（特に元々創造性の低い書き手）。 一方、AI支援の物語同士はより類似し、集団レベルの多様性が低下する社会的ジレンマ。 | abstract |
| 2024 | [Stadler et al.](https://doi.org/10.1016/j.chb.2024.108386) `stadler2024chb` | RCT | 91 | information_seeking | 条件依存 | LLM群は認知負荷が有意に低いが、最終的な推奨の推論・論証の質が低い。 推奨内容の均質性には群間差なし。 | abstract |
| 2023 | [Dratsch et al.](https://doi.org/10.1148/radiol.222176) `dratsch2023radiology` | 実験 | 27 | medicine | 負 | AIの誤った提案で正答率が大きく低下（未熟練19.8%、中等度24.8%、熟練45.5%）。 経験は影響を軽減するが消去しない。 | abstract |
| 2023 | [Jakesch et al.](https://doi.org/10.1145/3544548.3581196) `jakesch2023chi` | 実験 | 1506 | writing | 負 | 特定の意見に偏った執筆支援AIを使うと、書いた文章だけでなく事後調査での本人の意見も AIの立場に近づく（潜在的説得）。 | abstract |
| 2020 | [Dahmani et al.](https://doi.org/10.1038/s41598-020-62877-0) `dahmani2020scirep` | 縦断 | 50 | everyday | 負 | 生涯GPS使用量が多いほど自力ナビゲーション時の空間記憶が低い。3年追跡でGPS使用の増加は 海馬依存の空間記憶の低下と関連。方向感覚の悪さがGPS使用の原因ではないことを示唆。 | abstract |
| 2016 | [Risko et al.](https://doi.org/10.1016/j.tics.2016.07.002) `risko2016tics` | レビュー/理論 |  | theory | 理論 | 認知的オフローディングを「課題の認知的要求を減らすための身体的行為」と定義し、 オフローディングの判断にメタ認知（自己能力評価）が関わる枠組みを提示。本研究の理論的基盤。 | abstract |
| 2011 | [Sparrow et al.](https://doi.org/10.1126/science.1207745) `sparrow2011science` | 実験 |  | information_seeking | 条件依存 | 後でアクセスできると期待する情報は内容自体の想起が低く、「どこにあるか」の想起が高い （交換記憶の外部化）。 | abstract |
