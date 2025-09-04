-- AlterTable
ALTER TABLE "public"."tokens" ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."otps" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otps_email_code_idx" ON "public"."otps"("email", "code");

-- CreateIndex
CREATE INDEX "otps_userId_idx" ON "public"."otps"("userId");

-- AddForeignKey
ALTER TABLE "public"."otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
