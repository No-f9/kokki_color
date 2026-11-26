# 開発用ファイル

公開しているのは一つ上の `index.html`（このフォルダの中身から作った1ファイル）。

## 作り直し方

```
cd dev
npm install
node tools/merge.js   # data/out_*.json → countries.gen.js（ふりがな自動付与・検証。警告は data/warnings.txt）
node tools/extra.js   # 英語名・現地語名（world-countries）としあわせ度（data/happiness_2026.txt）→ extra.json
node build.js         # src.html ＋ 地図・国旗・データ → dist/index.html
cp dist/index.html ../index.html
```

- `src.html`: アプリ本体（HTML・CSS・JS）
- `data/out_*.json`: 国・地域のデータ（地域ごとに8ファイル。出典は外務省「国・地域」各国基礎データ。項目は data/SPEC.md）
- `countries.js`: 最初の50か国の手書きデータ（国旗の意味・豆知識のふりがな、地図の中心はこちらを優先）
- `master.json`: 収録する202件（196か国＋6地域）の一覧
- `data/happiness_2026.txt`: 世界幸福度報告2026の国別スコア（2023〜2025年の平均、0〜10点）
