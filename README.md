# PANZERFRAME（静的版）

機甲兵団Jフェニックス のデータサイト（GitHub Pages対応）

## 構成

```
panzerframe-static/
├── index.html
├── customize/
│   ├── SLPM65199.html   … コバルト小隊篇
│   └── SLPM65343.html   … 2本篇
├── parts/
│   └── SLPM65343.html   … 2本篇
├── salvage/
│   ├── SLPS20075.html   … 序章篇
│   ├── SLPM65033.html   … 本篇
│   ├── SLPM65123.html   … BT
│   ├── SLPM65199.html   … コバルト小隊篇
│   ├── SLPM62339.html   … 2序章篇
│   └── SLPM65343.html   … 2本篇
└── static/
    ├── stylesheet/style.css
    ├── customize/       ← 元リポジトリのJSをコピー
    ├── salvage/         ← 元リポジトリのJSをコピー
    └── image/           ← favicon.ico などをコピー
```

## セットアップ手順

1. 元のリポジトリから以下をコピーする

```bash
# カスタマイズ用JS
cp -r ../panzerframe/static/customize/* static/customize/

# サルベージ用JS
cp -r ../panzerframe/static/salvage/* static/salvage/

# 画像
cp -r ../panzerframe/static/image/* static/image/
```

2. GitHub Pages を有効にする
   - Settings → Pages → Source を `main` ブランチの `/ (root)` または `docs` に設定
   - もしくはこのフォルダを `docs` に置いて公開

## 注意

- 既存のJS（特にカスタマイズ用）はパスが `/pf/` を前提にしている可能性があります。
  動かない場合はJS内のパスを相対パスに修正してください。
- 未実装のディスク（序章篇・本篇・BTなどのカスタマイズ）はナビでグレー表示しています。
