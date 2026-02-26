import { PrismaClient, Currency } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 1人目はデモ用ユーザー
  const demoPassword = "test";
  const demoHashed = await bcrypt.hash(demoPassword, 10);

  const demoUser = await prisma.user.create({
    data: {
      email: "test.carey@example.com",
      name: "test",
      firstName: "Test",
      lastName: "Carey",
      phone: faker.phone.number(),
      countryCode: faker.location.countryCode(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postalCode: faker.location.zipCode(),
      password: demoHashed,
      isVerified: true,
      verificationToken: null,
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });

  // 他のユーザーを追加
  for (let u = 0; u < 4; u++) {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        countryCode: faker.location.countryCode(),
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        password: hashedPassword,
        isVerified: faker.datatype.boolean(),
        verificationToken: faker.string.uuid(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });

    // Clients
    const createdClients = [];
    for (let c = 0; c < 2; c++) {
      const client = await prisma.client.create({
        data: {
          name: faker.company.name(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          country: faker.location.country(),
          userId: user.id,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      });
      createdClients.push(client);
    }

    // BankAccount
    await prisma.bankAccount.create({
      data: {
        userId: user.id,
        bank: faker.company.name(),
        accountName: faker.person.fullName(),
        branchCode: faker.string.numeric(4),
        accountNumber: faker.finance.accountNumber(),
        swiftBic: faker.finance.bic(),
        branchAddress: faker.location.streetAddress(),
        currency: faker.helpers.arrayElement(Object.values(Currency)),
        intermediaryBank: faker.company.name(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });

    // Invoices & Tasks
    for (let i = 0; i < 3; i++) {
      // 紐づけるClientをランダムに選択（なければnull）
      const client =
        createdClients.length > 0
          ? faker.helpers.arrayElement(createdClients)
          : null;

      const language = faker.helpers.arrayElement(["en", "ja"] as const);

      const invoice = await prisma.invoice.create({
        data: {
          name: faker.commerce.productName(),
          currency: faker.helpers.arrayElement(Object.values(Currency)),
          language: language as any,
          userId: user.id,
          clientId: client ? client.id : undefined,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      });

      for (let t = 0; t < 5; t++) {
        await prisma.task.create({
          data: {
            name: faker.commerce.product(),
            rate: faker.number.float({ min: 10, max: 100 }),
            hours: faker.number.float({ min: 1, max: 8 }),
            invoiceId: invoice.id,
          },
        });
      }
    }
  }

  // Demoユーザーにも最低限のデータを追加
  const demoClients = [];
  for (let c = 0; c < 2; c++) {
    const client = await prisma.client.create({
      data: {
        name: faker.company.name(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        country: faker.location.country(),
        userId: demoUser.id,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
    demoClients.push(client);
  }

  await prisma.bankAccount.create({
    data: {
      userId: demoUser.id,
      bank: faker.company.name(),
      accountName: "Test Carey",
      branchCode: faker.string.numeric(4),
      accountNumber: faker.finance.accountNumber(),
      swiftBic: faker.finance.bic(),
      branchAddress: faker.location.streetAddress(),
      currency: faker.helpers.arrayElement(Object.values(Currency)),
      intermediaryBank: faker.company.name(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });

  for (let i = 0; i < 3; i++) {
    // 紐づけるClientをランダムに選択（なければnull）
    const client =
      demoClients.length > 0 ? faker.helpers.arrayElement(demoClients) : null;

    const language = faker.helpers.arrayElement(["en", "ja"] as const);

    const invoice = await prisma.invoice.create({
      data: {
        name: faker.commerce.productName(),
        currency: faker.helpers.arrayElement(Object.values(Currency)),
        language: language as any,
        userId: demoUser.id,
        clientId: client ? client.id : undefined,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });

    for (let t = 0; t < 5; t++) {
      await prisma.task.create({
        data: {
          name: faker.commerce.product(),
          rate: faker.number.float({ min: 10, max: 100 }),
          hours: faker.number.float({ min: 1, max: 8 }),
          invoiceId: invoice.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("🌱 Dummy data seeded!");
    console.log("Demo user: test.carey@example.com / test");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
