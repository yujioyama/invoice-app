# Invoice App — Backend

[日本語](#日本語) | [English](#english)

---

## 日本語

NestJS + Prisma + PostgreSQL で構築した請求書管理APIサーバーです。

### 技術スタック

| 技術 | 用途 |
|---|---|
| NestJS 11 | APIフレームワーク |
| Prisma 5 | ORM |
| PostgreSQL | データベース |
| JWT + Passport | 認証 |
| bcrypt | パスワードハッシュ |
| Resend | メール送信（メール認証） |

---

### データベーススキーマ

```
User
  id, email, name, phone, countryCode
  street, city, state, country, postalCode
  password (hashed), isVerified, verificationToken
  → Invoice[], Client[], BankAccount[]

Invoice
  id, name, currency (JPY/USD/EUR/GBP/AUD)
  language (en/ja), userId, clientId
  → Task[]

Task
  id, name, rate, hours, invoiceId

Client
  id, name, email, phone, address, country, userId

BankAccount
  id, bank, accountName, branchCode, accountNumber
  swiftBic, branchAddress, currency, intermediaryBank, userId
```

---

### APIエンドポイント

すべてのエンドポイントはCookieベースのセッション認証を使用します（`/auth/register`・`/auth/login`・`/auth/verifyEmail` を除く）。

#### 認証 `/auth`

| メソッド | パス | 説明 |
|---|---|---|
| POST | `/auth/register` | ユーザー登録（認証メール送信） |
| GET | `/auth/verifyEmail` | メールアドレス認証 |
| POST | `/auth/login` | ログイン |
| POST | `/auth/logout` | ログアウト |
| GET | `/auth/me` | 現在のユーザー情報取得 |
| GET | `/auth/me/details` | プロフィール詳細取得（銀行口座含む） |
| PATCH | `/auth/me/details` | プロフィール更新 |

#### 請求書 `/invoices`

| メソッド | パス | 説明 |
|---|---|---|
| POST | `/invoices` | 請求書作成 |
| GET | `/invoices` | 請求書一覧取得 |
| GET | `/invoices/:id` | 請求書詳細取得 |
| PATCH | `/invoices/:id` | 請求書更新 |
| DELETE | `/invoices/:id` | 請求書削除 |

#### クライアント `/clients`

| メソッド | パス | 説明 |
|---|---|---|
| POST | `/clients` | クライアント作成 |
| GET | `/clients` | クライアント一覧取得 |
| GET | `/clients/:id` | クライアント詳細取得 |
| PATCH | `/clients/:id` | クライアント更新 |
| DELETE | `/clients/:id` | クライアント削除 |

---

### ローカル環境のセットアップ

#### 1. PostgreSQL の起動

```bash
docker run --name invoice-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=invoice_db \
  -p 5432:5432 -d postgres:15
```

#### 2. 依存パッケージのインストール

```bash
cd backend
npm install
```

#### 3. 環境変数の設定

`.env` ファイルを作成して以下を設定します：

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/invoice_db?schema=public
JWT_SECRET=your_jwt_secret

# Resend APIキー
RESEND_API_KEY=re_xxxxxxxxxxxx

FRONTEND_URL=http://localhost:3000
```

#### 4. Prisma のセットアップ

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed   # 任意: デモデータの投入
```

#### 5. サーバー起動

```bash
# 開発モード
npm run start:dev

# プロダクションビルド
npm run build && npm start
```

サーバーは `http://localhost:3001` で起動します。

---

### Prisma Studio（データベースGUI）

```bash
npx prisma studio
```

`http://localhost:5555` でブラウザが開きます。

---

### トラブルシューティング

**PostgreSQL接続エラー**
- Dockerコンテナが起動しているか確認: `docker ps`
- `.env` の `DATABASE_URL` が正しいか確認

**Prismaエラー**

```bash
# Prisma Clientを再生成
npm run prisma:generate

# データベースをリセット
npx prisma migrate reset
npm run prisma:push
```

---

## English

REST API server for the Invoice App, built with NestJS, Prisma, and PostgreSQL.

### Tech Stack

| Technology | Purpose |
|---|---|
| NestJS 11 | API framework |
| Prisma 5 | ORM |
| PostgreSQL | Database |
| JWT + Passport | Authentication |
| bcrypt | Password hashing |
| Resend | Email delivery (email verification) |

---

### Database Schema

```
User
  id, email, name, phone, countryCode
  street, city, state, country, postalCode
  password (hashed), isVerified, verificationToken
  → Invoice[], Client[], BankAccount[]

Invoice
  id, name, currency (JPY/USD/EUR/GBP/AUD)
  language (en/ja), userId, clientId
  → Task[]

Task
  id, name, rate, hours, invoiceId

Client
  id, name, email, phone, address, country, userId

BankAccount
  id, bank, accountName, branchCode, accountNumber
  swiftBic, branchAddress, currency, intermediaryBank, userId
```

---

### API Endpoints

All endpoints require cookie-based session authentication except `/auth/register`, `/auth/login`, and `/auth/verifyEmail`.

#### Auth `/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register new user (sends verification email) |
| GET | `/auth/verifyEmail` | Verify email address |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |
| GET | `/auth/me/details` | Get profile with bank account |
| PATCH | `/auth/me/details` | Update profile |

#### Invoices `/invoices`

| Method | Path | Description |
|---|---|---|
| POST | `/invoices` | Create invoice |
| GET | `/invoices` | List invoices |
| GET | `/invoices/:id` | Get invoice by ID |
| PATCH | `/invoices/:id` | Update invoice |
| DELETE | `/invoices/:id` | Delete invoice |

#### Clients `/clients`

| Method | Path | Description |
|---|---|---|
| POST | `/clients` | Create client |
| GET | `/clients` | List clients |
| GET | `/clients/:id` | Get client by ID |
| PATCH | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |

---

### Local Setup

#### 1. Start PostgreSQL

```bash
docker run --name invoice-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=invoice_db \
  -p 5432:5432 -d postgres:15
```

#### 2. Install dependencies

```bash
cd backend
npm install
```

#### 3. Configure environment variables

Create a `.env` file:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/invoice_db?schema=public
JWT_SECRET=your_jwt_secret

# Resend API key
RESEND_API_KEY=re_xxxxxxxxxxxx

FRONTEND_URL=http://localhost:3000
```

#### 4. Prisma setup

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed   # optional: seed demo data
```

#### 5. Start server

```bash
# Development
npm run start:dev

# Production
npm run build && npm start
```

Server runs on `http://localhost:3001`.

---

### Prisma Studio

```bash
npx prisma studio
```

Opens at `http://localhost:5555`.

---

### Troubleshooting

**PostgreSQL connection error**
- Check Docker is running: `docker ps`
- Verify `DATABASE_URL` in `.env`

**Prisma errors**

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Reset database
npx prisma migrate reset
npm run prisma:push
```
