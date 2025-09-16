/*
  Warnings:

  - You are about to drop the column `adminId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `senderAdminId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderType` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderUserId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderRole` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderUserId_fkey";

-- DropIndex
DROP INDEX "public"."Conversation_userId_adminId_key";

-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "adminId",
ADD COLUMN     "assignedAdminId" INTEGER,
ADD COLUMN     "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "senderAdminId",
DROP COLUMN "senderType",
DROP COLUMN "senderUserId",
ADD COLUMN     "seenAt" TIMESTAMP(3),
ADD COLUMN     "senderId" INTEGER NOT NULL,
ADD COLUMN     "senderRole" "public"."Role" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."Admin";

-- DropEnum
DROP TYPE "public"."SenderType";

-- CreateIndex
CREATE INDEX "Conversation_lastMessageAt_idx" ON "public"."Conversation"("lastMessageAt");

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
