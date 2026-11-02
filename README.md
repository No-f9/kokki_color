# 国旗から（デモ版）

国旗を覚えるiPad向けWebアプリ。覚えた国で3D地球儀が色づいていく。

- 公開URL: https://no-f9.github.io/kokki_color/
- iPadの **Safari** で開いて使う（ホーム画面に追加すると声で答える機能が使えない）
- 声で答えるには、iPadの設定で Siri または音声入力をオンにし、初回にマイクを許可する

## デモの内容

- 回せる3D地球儀（ピンチで拡大、タップで国カード）
- 10か国の国カード（日本・フランス・アメリカ・ブラジル・エジプト・オーストラリア・インド・イタリア・ケニア・モナコ）
- れんしゅう：国旗→国名を声で答える／国名→国旗の4択／首都の4択／地球儀で場所あて
- おぼえ度0〜5。マスターした国は金色で塗られる
- せってい：答え方の切り替え、音声認識テスト、デモ用のおぼえ度変更

国カードの数字はデモ用の概数。本番では外務省「国・地域」のデータに差し替える。

## 構成

ビルド不要の単一HTML（`index.html`）。以下を内蔵している。

- [d3-geo](https://github.com/d3/d3-geo) / [d3-array](https://github.com/d3/d3-array)（ISC）
- [topojson-client](https://github.com/topojson/topojson-client)（ISC）
- [world-atlas](https://github.com/topojson/world-atlas)（Natural Earth 由来、パブリックドメイン）
- [flag-icons](https://github.com/lipis/flag-icons)（MIT）
