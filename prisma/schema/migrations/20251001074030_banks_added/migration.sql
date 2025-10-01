-- CreateEnum
CREATE TYPE "public"."BankType" AS ENUM ('CONFIRMING', 'CURRENT');

-- CreateTable
CREATE TABLE "public"."banks" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "swiftCode" TEXT NOT NULL,
    "type" "public"."BankType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banks_swiftCode_key" ON "public"."banks"("swiftCode");

-- AddForeignKey
ALTER TABLE "public"."contacts" ADD CONSTRAINT "contacts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "public"."banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
