# WeatherLayer Particle Display Map

WeatherLayers GLライブラリを使用した、インタラクティブな風のパーティクル可視化マップアプリケーションです。WeatherLayers GLのVector画像に準拠したPNG画像をドラッグ&ドロップで読み込み、リアルタイムでパーティクルアニメーションを表示できます。

## 🌟 主な機能

- **ドラッグ&ドロップ対応**: PNG画像を地図上に直接ドロップして読み込み
- **リアルタイムパラメータ調整**: スライダーを使ってパーティクルの表示を即座に調整
- **柔軟な表示範囲設定**: 緯度経度範囲を指定して特定地域にフォーカス
- **レスポンシブデザイン**: デスクトップ・モバイル両対応
- **ダークモード対応**: ユーザーのシステム設定に自動対応

## 🚀 デモ

https://hirofumikanda.github.io/weatherlayer-particle-display-map/

## 📋 調整可能なパラメータ

- **パーティクル数**: 表示するパーティクルの総数 (1,000-20,000)
- **最大寿命**: パーティクルの寿命フレーム数 (1-50)
- **速度係数**: 風速に対するパーティクル移動速度の倍率 (1-1,000)
- **線の太さ**: パーティクルトレイルの描画幅 (0.5-10.0)
- **最小値・最大値**: 風速データの正規化範囲 (-128～128)
- **緯度経度範囲**: パーティクル表示の地理的範囲

## 🛠️ 技術スタック

- **React 19** - UIフレームワーク
- **TypeScript** - 型安全な開発
- **MapLibre GL** - 高性能マップレンダリング
- **DeckGL** - WebGLベースのデータ可視化
- **WeatherLayers GL** - 気象データ可視化ライブラリ
- **Vite** - 高速開発環境
- **GitHub Pages** - 自動デプロイ

## 📦 インストール

```bash
# リポジトリをクローン
git clone https://github.com/hirofumikanda/weatherlayer-particle-display-map.git
cd weatherlayer-particle-display-map

# 依存関係をインストール
npm install

# 開発サーバーを起動 (http://localhost:5173)
npm run dev
```

## 📖 使い方

1. **アプリケーションを開く**: ブラウザでデモサイトまたはローカル開発サーバーにアクセス
2. **PNGを読み込む**: WeatherLayers GLのVector画像形式のPNG画像を地図上にドラッグ&ドロップ
3. **パラメータを調整**: 左上のコントロールパネルでパーティクルの表示を調整

## 📁 プロジェクト構造

```
src/
├── components/
│   ├── MapView.tsx           # メインマップコンテナ
│   └── ParticleControls.tsx  # パラメータ調整UI
├── hooks/
│   └── useMap.ts            # マップとパーティクル管理
├── styles/
│   ├── map.css              # マップスタイル
│   └── particleControls.css # コントロールUIスタイル
└── main.tsx                 # アプリケーションエントリーポイント

public/
└── styles/
    └── style.json           # MapLibreスタイル定義
```

## 🎯 対応データ形式

- **ファイル形式**: PNG画像
- **データ形式**: WeatherLayers GL Vector画像形式
- **チャンネル**: R（東西ベクトル成分値）、G（南北ベクトル成分値）
- 詳細はWeatherLayers GLの[supported-data-formats](https://docs.weatherlayers.com/weatherlayers-gl/data-sources#supported-data-formats)を参照

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
