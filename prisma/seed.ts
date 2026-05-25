import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Buat Role Super Admin terlebih dahulu
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      permissions: {
        roles: ['create', 'read', 'update', 'delete'],
        users: ['create', 'read', 'update', 'delete'],
        web_menus: ['create', 'read', 'update', 'delete'],
      },
    },
  });

  // 2. Buat User menggunakan Role yang baru dibuat
  const hashedPassword = await bcrypt.hash('AdminKepri123', 10);

  const user = await prisma.user.upsert({
    where: { username: 'admin_kepri' },
    update: {},
    create: {
      name: 'Admin Utama',
      username: 'admin_kepri',
      email: 'admin@kepri.kpu.go.id',
      password: hashedPassword,
      status: true,
      roleId: superAdminRole.id, // Sambungkan ke Role di atas
    },
  });

  console.log('Database berhasil di-reset!');
  console.log(`Role: ${superAdminRole.name} | User: ${user.username}`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });