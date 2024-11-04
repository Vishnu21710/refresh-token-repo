-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
