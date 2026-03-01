/**
 * Resets and re-seeds demo invoices and clients for the test account.
 * Run: npm run prisma:seed:demo
 *
 * - Updates demo user profile to Japanese data
 * - Deletes all existing invoices and clients for the demo user
 * - Creates 10 Japanese clients
 * - Creates 20 invoices (5 JPY / 5 AUD / 5 USD / 5 EUR)
 * - Hours and rates are integers
 */

import { PrismaClient, Currency, InvoiceLanguage } from "@prisma/client";
import { faker, fakerJA } from "@faker-js/faker";

const prisma = new PrismaClient();

const DEMO_EMAIL = "test.carey@example.com";

const JA_TASK_NAMES = [
  "Webデザイン",
  "フロントエンド開発",
  "バックエンド開発",
  "UIコンサルティング",
  "プロジェクト管理",
  "システム設計",
  "コードレビュー",
  "テスト・QA",
  "データベース設計",
  "ドキュメント作成",
  "API設計",
  "インフラ構築",
];

const JA_INVOICE_NAMES = [
  "Webサイトリニューアル",
  "ECサイト開発",
  "管理画面開発",
  "モバイルアプリ開発",
  "APIサーバー構築",
];

const INVOICE_BATCHES: { currency: Currency; language: InvoiceLanguage; count: number }[] = [
  { currency: Currency.JPY, language: InvoiceLanguage.ja, count: 5 },
  { currency: Currency.AUD, language: InvoiceLanguage.en, count: 5 },
  { currency: Currency.USD, language: InvoiceLanguage.en, count: 5 },
  { currency: Currency.EUR, language: InvoiceLanguage.en, count: 5 },
];

async function main() {
  const demoUser = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
  });

  if (!demoUser) {
    throw new Error(`Demo user not found: ${DEMO_EMAIL}\nRun the seed first.`);
  }

  // --- Update demo user profile to Japanese ---
  console.log("Updating demo user profile...");
  await prisma.user.update({
    where: { id: demoUser.id },
    data: {
      countryCode: "+81",
      phone: "90-1234-5678",
      street: "渋谷1-1-1",
      city: "渋谷区",
      state: "東京都",
      country: "日本",
      postalCode: "150-0001",
    },
  });

  // --- Reset existing invoices and clients ---
  console.log("Cleaning up existing invoices and clients...");
  await prisma.invoice.deleteMany({ where: { userId: demoUser.id } });
  await prisma.client.deleteMany({ where: { userId: demoUser.id } });

  // --- Create 10 clients (5 Japanese, 5 international) ---
  console.log("Creating 10 clients...");
  const clients = [];

  for (let i = 0; i < 5; i++) {
    const client = await prisma.client.create({
      data: {
        name: fakerJA.company.name(),
        email: faker.internet.email(),
        phone: fakerJA.phone.number(),
        address: fakerJA.location.streetAddress(),
        country: "日本",
        userId: demoUser.id,
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: new Date(),
      },
    });
    clients.push(client);
  }

  for (let i = 0; i < 5; i++) {
    const client = await prisma.client.create({
      data: {
        name: faker.company.name(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        country: faker.location.country(),
        userId: demoUser.id,
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: new Date(),
      },
    });
    clients.push(client);
  }

  // --- Create 20 invoices ---
  let totalCreated = 0;

  for (const batch of INVOICE_BATCHES) {
    for (let i = 0; i < batch.count; i++) {
      const client = faker.helpers.arrayElement(clients);
      const isJa = batch.language === InvoiceLanguage.ja;

      const invoiceName = isJa
        ? JA_INVOICE_NAMES[i % JA_INVOICE_NAMES.length]
        : faker.commerce.productName();

      const invoice = await prisma.invoice.create({
        data: {
          name: invoiceName,
          currency: batch.currency,
          language: batch.language,
          userId: demoUser.id,
          clientId: client.id,
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: new Date(),
        },
      });

      const taskCount = faker.number.int({ min: 2, max: 4 });
      for (let t = 0; t < taskCount; t++) {
        const taskName = isJa
          ? faker.helpers.arrayElement(JA_TASK_NAMES)
          : faker.commerce.product();

        const rate =
          batch.currency === Currency.JPY
            ? faker.number.int({ min: 5000, max: 15000 })
            : faker.number.int({ min: 50, max: 200 });

        const hours = faker.number.int({ min: 1, max: 20 });

        await prisma.task.create({
          data: {
            name: taskName,
            rate,
            hours,
            invoiceId: invoice.id,
          },
        });
      }

      totalCreated++;
    }

    console.log(`  ${batch.count} x ${batch.currency} invoices created`);
  }

  console.log(`\n✅ Demo user updated, 10 clients and ${totalCreated} invoices added to ${DEMO_EMAIL}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
