# Invoice App

[English](#english) | [日本語](#日本語)

---

## English

Full-stack invoice management app built with Next.js (frontend) and NestJS + Prisma + PostgreSQL (backend).

### Highlights

- Authentication flow (register, email verification, login)
- Clients CRUD
- Invoices CRUD (tasks: name / rate / hours)
- Automatic totals and invoice preview
- PDF export (A4)
- i18n: Japanese / English UI switching

### Tech Stack

- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- i18n: i18next + react-i18next
- Backend: NestJS, Prisma, PostgreSQL

### Local Setup

#### 1) Start PostgreSQL

Using Docker (recommended):

```bash
docker run --name invoice-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=invoice_db \
  -p 5432:5432 -d postgres:15
```

#### 2) Backend

```bash
cd backend
npm install

npm run prisma:generate
npm run prisma:push

npm run start:dev
```

Backend runs on `http://localhost:3001`.

#### 3) Frontend

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### i18n

- Use the language toggle button in the header, or
- Append `?lang=ja` / `?lang=en` to the URL on first load.

### Database GUI

```bash
cd backend
npx prisma studio
```

Studio opens at `http://localhost:5555`.

### API

See [backend/README.md](backend/README.md).

---

## 日本語

Next.js（フロントエンド） + NestJS + Prisma + PostgreSQL（バックエンド）で構築したフルスタック請求書管理アプリです。

### 機能

- 認証（登録 / メール認証 / ログイン）
- クライアント管理（CRUD）
- 請求書管理（CRUD）
  - タスク（タスク名 / Rate / Hours）
  - 合計金額の自動計算
  - プレビュー
- PDF出力（A4）
- 日英切替（i18n）

### 技術スタック

- フロントエンド: Next.js（App Router）, React, TypeScript, Tailwind CSS
- i18n: i18next + react-i18next
- バックエンド: NestJS, Prisma, PostgreSQL

### セットアップ

#### 1) PostgreSQL の起動

Docker（推奨）:

```bash
docker run --name invoice-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=invoice_db \
  -p 5432:5432 -d postgres:15
```

#### 2) バックエンド

```bash
cd backend
npm install

npm run prisma:generate
npm run prisma:push

npm run start:dev
```

バックエンドは `http://localhost:3001` で起動します。

#### 3) フロントエンド

```bash
npm install
npm run dev
```

フロントエンドは `http://localhost:3000` で起動します。

### 使い方（例）

1. `/invoices/new` で請求書作成
2. タスクを入力 → プレビューへ
3. 保存後、詳細画面でPDFをダウンロード

### 言語切替（i18n）

- ヘッダーの切替ボタン、または
- 初回ロード時にURLへ `?lang=ja` / `?lang=en` を付与

### データベース管理（Prisma Studio）

```bash
cd backend
npx prisma studio
```

ブラウザで `http://localhost:5555` が開きます。

### API

詳細は [backend/README.md](backend/README.md) を参照してください。
