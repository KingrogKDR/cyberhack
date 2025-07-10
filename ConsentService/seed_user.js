import { prisma } from '../src/prisma/client';
import bcrypt from 'bcrypt';

async function main() {
  const hashedPassword = await bcrypt.hash('dummy-password', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Dummy User',
      email: 'dummy@example.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Dummy user created:', user);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding dummy user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
