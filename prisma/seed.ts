import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = '$2b$10$wJLCgT4fdAoNr/eqqosi3uI4pnwVdHxTDIVw7ejFEpMf3bRbaRE/.';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
      },
    });
  } 
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });