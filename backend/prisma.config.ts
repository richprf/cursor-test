import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Read by the Prisma CLI (migrate / generate / studio).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // `prisma generate` needs no connection (it runs on postinstall, before .env
    // exists on a fresh clone), so an unset URL must not blow up here.
    url: process.env.DATABASE_URL ?? '',
  },
});
