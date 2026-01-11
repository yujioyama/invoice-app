# Invoice App Backend

Nest.js + PostgreSQL + Prisma で構築したインボイス管理 API バックエンド

## 環境構築

### 1. PostgreSQL のセットアップ

#### Docker を使う場合（推奨）:

```bash
docker run --name invoice-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=invoice_db -p 5432:5432 -d postgres:15
```

#### Homebrew でインストール済みの場合:

```bash
# PostgreSQLの起動
brew services start postgresql@14

# データベース作成
createdb invoice_db
```

### 2. 依存パッケージのインストール

```bash
cd backend
npm install
```

### 3. Prisma のセットアップ

`.env`ファイルの DATABASE_URL を環境に合わせて編集:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/invoice_db?schema=public"
```

Prisma Client を生成してマイグレーション:

```bash
npm run prisma:generate
npm run prisma:push
```

### 4. サーバー起動

```bash
# 開発モード
npm run start:dev

# プロダクションビルド
npm run build
npm start
```

サーバーは `http://localhost:3001` で起動します。

## API エンドポイント

### インボイス作成

```
POST /invoices
Content-Type: application/json

{
  "name": "Invoice #1",
  "tasks": [
    { "name": "Task 1", "rate": 27, "hours": 10 },
    { "name": "Task 2", "rate": 27, "hours": 5 }
  ]
}
```

### インボイス一覧取得

```
GET /invoices
```

### インボイス詳細取得

```
GET /invoices/:id
```

### インボイス更新

```
PATCH /invoices/:id
Content-Type: application/json

{
  "name": "Updated Invoice",
  "tasks": [...]
}
```

### インボイス削除

```
DELETE /invoices/:id
```

## データベーススキーマ

### Invoice

- id: String (CUID)
- name: String
- createdAt: DateTime
- updatedAt: DateTime
- tasks: Task[]

### Task

- id: String (CUID)
- name: String
- rate: Float (default: 27)
- hours: Float
- invoiceId: String
- invoice: Invoice

## トラブルシューティング

### PostgreSQL 接続エラー

- Docker コンテナが起動しているか確認: `docker ps`
- `.env`の DATABASE_URL が正しいか確認

### Prisma エラー

```bash
# Prisma Clientを再生成
npm run prisma:generate

# データベースをリセット
npx prisma migrate reset
npm run prisma:push
```
