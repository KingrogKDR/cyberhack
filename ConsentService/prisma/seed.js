import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const user = await prisma.user.upsert({
    where: { email: "partha@example.com" },
    update: {},
    create: {
      email: "partha@example.com",
      name: "Partha",
      password: "securepassword123",
      role: "user",
    },
  });

  await prisma.accountDetail.create({
    data: {
      userId: user.id,
      accountNo: "ACC123456",
      balance: 45000.75,
      transactions: [
        { id: 1, type: "credit", amount: 10000, date: "2024-05-01" },
        { id: 2, type: "debit", amount: 2000, date: "2024-05-02" },
        { id: 3, type: "credit", amount: 5000, date: "2024-06-15" }
      ],
    },
  });

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
