-- AlterEnum: replace USER with BUYER and add SELLER.
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('BUYER', 'SELLER', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING (
  CASE
    WHEN "role"::text = 'ADMIN' THEN 'ADMIN'::"Role_new"
    ELSE 'BUYER'::"Role_new"
  END
);
DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'BUYER';
COMMIT;

-- Existing accounts already finished sign-up; new Google users set this to false on create.
ALTER TABLE "users" ADD COLUMN "onboardingComplete" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "shops_userId_key" ON "shops"("userId");

ALTER TABLE "shops" ADD CONSTRAINT "shops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
