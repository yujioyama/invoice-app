# Invoice App - フルスタック請求書管理アプリ

Next.js (フロントエンド) + Nest.js + PostgreSQL (バックエンド) で構築した請求書管理アプリケーション

## 機能

- タスクごとの詳細管理（タスク名、Rate、Hours）
- 合計金額自動計算
- 作成日自動表示
- インボイス名自動生成
- PDF 出力（A4 サイズ対応）
- PostgreSQL によるデータ永続化

## セットアップ

### 1. PostgreSQL の起動

Docker を使用（推奨）:

```bash
docker run --name invoice-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=invoice_db \
  -p 5432:5432 -d postgres:15
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 依存パッケージのインストール
npm install

# Prisma Clientの生成とマイグレーション
npm run prisma:generate
npm run prisma:push

# サーバー起動
npm run start:dev
```

バックエンドは `http://localhost:3001` で起動します。

### 3. フロントエンドのセットアップ

```bash
# ルートディレクトリで実行
npm install

# 開発サーバー起動
npm run dev
```

フロントエンドは `http://localhost:3000` で起動します。

## 使い方

1. `/invoices/new` でインボイス作成画面にアクセス
2. タスクを追加して情報を入力
3. "Preview Invoice" でプレビュー画面へ
4. "Save & Continue" で保存して Detail 画面へ遷移
5. Detail 画面で "Download PDF" をクリックして PDF 出力

## データベース管理

### Prisma Studio でデータを確認

データベースの内容を GUI で確認・編集できます：

```bash
cd backend
npx prisma studio
```

ブラウザで `http://localhost:5555` が開き、Invoice と Task テーブルのデータを確認できます。

## API エンドポイント

- `POST /invoices` - インボイス作成
- `GET /invoices` - インボイス一覧取得
- `GET /invoices/:id` - インボイス詳細取得
- `PATCH /invoices/:id` - インボイス更新
- `DELETE /invoices/:id` - インボイス削除

詳細は [backend/README.md](backend/README.md) を参照してください。

## 技術スタック

### フロントエンド

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- html2pdf.js

### バックエンド

- Nest.js
- Prisma ORM
- PostgreSQL 15
- TypeScript
