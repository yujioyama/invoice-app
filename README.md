# Invoice App

[日本語](#日本語) | [English](#english)

---

## 日本語

ワーキングホリデーで勤務していたオーストラリアの企業と、帰国後に業務委託契約を締結。その請求書発行を自動化するために開発したフルスタックWebアプリです。現在も実際の業務で使用しています。クライアント管理・タスクベースの請求書作成・PDF出力・日英UI切替に対応しています。

**デモ:** https://invoice-app-phi-lime.vercel.app

> デモアカウント — メール: `test.carey@example.com` / パスワード: `test`

---

### 機能

- **ランディングページ** — ワンクリックでデモログイン
- **認証** — ユーザー登録 / メール認証 / ログイン / ログアウト
- **クライアント管理** — 連絡先付きでクライアントを登録・削除
- **請求書管理** — タスク行の追加・編集・削除、請求書のCRUD
- **合計金額の自動計算** — 単価 × 時間をタスクごとに計算し合算
- **請求書プレビュー** — 保存前に内容を確認
- **PDF出力** — 支払い情報・署名欄付きのA4フォーマット
- **多通貨対応** — JPY / USD / EUR / GBP / AUD
- **i18n** — UI言語（日/英）と請求書言語を独立して切替可能

---

### 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16（App Router） |
| UIライブラリ | React 19 |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS v4 |
| 国際化 | i18next 25 + react-i18next |
| バックエンド | NestJS 11 |
| ORM | Prisma 5 |
| データベース（本番） | PostgreSQL（Supabase） |
| デプロイ | Vercel（フロントエンド） |

---

### アーキテクチャ

```
invoice-app/
├── app/              # Next.js App Router ページ・レイアウト
├── components/       # 共通Reactコンポーネント
├── hooks/            # カスタムフック
├── lib/              # APIクライアント関数
├── shared/types/     # フロント・バックエンド共通の型定義
└── backend/          # NestJS APIサーバー
    ├── src/
    │   ├── auth/     # JWT認証・メール認証
    │   ├── invoices/ # 請求書CRUD・PDF生成
    │   ├── clients/  # クライアントCRUD
    │   └── users/    # ユーザープロフィール
    └── prisma/       # スキーマ・シードデータ
```

---

### ローカル環境のセットアップ

#### 事前準備

- Node.js 20 以上
- Docker（ローカルの PostgreSQL 用）

#### 初回セットアップ

```bash
# 依存関係のインストール
npm install
npm install --prefix backend

# 環境変数（backend/.env と .env.local を設定）
# backend/.env — DATABASE_URL, JWT_SECRET など（下記「環境変数」参照）
# .env.local — NEXT_PUBLIC_API_URL=http://localhost:3001

cd backend
npm run prisma:generate
npm run prisma:push
npx prisma db seed   # 任意: デモデータの投入
cd ..
```

#### 開発サーバーの起動（一括）

DB・バックエンド・フロントエンドをまとめて起動します。

```bash
npm run dev:all
```

| サービス | URL |
|---|---|
| フロントエンド | http://localhost:3000 |
| バックエンド | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

`Ctrl+C` でバックエンド・フロントエンドを停止します。PostgreSQL コンテナはバックグラウンドで動き続けるため、停止する場合は `docker compose down` を実行してください。

DB のみ起動する場合: `npm run dev:db`

#### 個別に起動する場合

```bash
# 1. PostgreSQL
docker compose up postgres -d --wait

# 2. バックエンド
cd backend && npm run start:dev

# 3. フロントエンド（別ターミナル、リポジトリルート）
npm run dev
```

---

### 環境変数

**backend/.env**

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/invoice_db?schema=public
JWT_SECRET=your_jwt_secret
MAIL_HOST=...
MAIL_USER=...
MAIL_PASS=...
FRONTEND_URL=http://localhost:3000
```

**フロントエンド (.env.local)**

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### API

エンドポイントの詳細は [backend/README.md](backend/README.md) を参照してください。

---

## English

A full-stack invoice management web app built to automate invoicing for a freelance contract with an Australian company where I previously worked during my working holiday. After returning to Japan, I continued working with them remotely and built this app to handle the billing workflow. Still actively used in production. Supports client management, task-based invoicing, PDF export, and full Japanese / English UI switching.

**Live Demo:** https://invoice-app-phi-lime.vercel.app

> Demo account — Email: `test.carey@example.com` / Password: `test`

---

### Features

- **Landing page** with one-click demo login
- **Authentication** — register, email verification, login / logout
- **Client management** — create and delete clients with contact details
- **Invoice management** — create, edit, delete invoices with itemized task rows
- **Auto-calculated totals** — rate × hours per task, summed automatically
- **Invoice preview** — review before saving
- **PDF export** — A4-format PDF with payment info and signature area
- **Multi-currency** — JPY, USD, EUR, GBP, AUD
- **i18n** — full UI switching between Japanese and English; invoice language is set independently per invoice

---

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 (App Router) |
| UI library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Internationalisation | i18next 25 + react-i18next |
| Backend framework | NestJS 11 |
| ORM | Prisma 5 |
| Database (production) | PostgreSQL (Supabase) |
| Deployment | Vercel (frontend) |

---

### Architecture

```
invoice-app/
├── app/              # Next.js App Router pages and layouts
├── components/       # Shared React components
├── hooks/            # Custom React hooks
├── lib/              # API client functions
├── shared/types/     # TypeScript types shared between frontend and backend
└── backend/          # NestJS API server
    ├── src/
    │   ├── auth/     # JWT auth, email verification
    │   ├── invoices/ # Invoice CRUD + PDF generation
    │   ├── clients/  # Client CRUD
    │   └── users/    # User profile
    └── prisma/       # Schema and seed data
```

---

### Local Setup

#### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)

#### First-time setup

```bash
# Install dependencies
npm install
npm install --prefix backend

# Environment variables (configure backend/.env and .env.local)
# backend/.env — DATABASE_URL, JWT_SECRET, etc. (see Environment Variables below)
# .env.local — NEXT_PUBLIC_API_URL=http://localhost:3001

cd backend
npm run prisma:generate
npm run prisma:push
npx prisma db seed   # optional: seed demo data
cd ..
```

#### Start all dev servers

Starts the database, backend, and frontend together.

```bash
npm run dev:all
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

Press `Ctrl+C` to stop the backend and frontend. The PostgreSQL container keeps running in the background; run `docker compose down` to stop it.

Start the database only: `npm run dev:db`

#### Start services individually

```bash
# 1. PostgreSQL
docker compose up postgres -d --wait

# 2. Backend
cd backend && npm run start:dev

# 3. Frontend (separate terminal, repo root)
npm run dev
```

---

### Environment Variables

**backend/.env**

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/invoice_db?schema=public
JWT_SECRET=your_jwt_secret
MAIL_HOST=...
MAIL_USER=...
MAIL_PASS=...
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### API Reference

See [backend/README.md](backend/README.md) for full endpoint documentation.
