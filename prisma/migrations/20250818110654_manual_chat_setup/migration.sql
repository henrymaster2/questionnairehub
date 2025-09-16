/*
  Warnings:

  - Changed the type of `sender` on the `ChatMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Sender" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."ChatMessage" DROP COLUMN "sender",
ADD COLUMN     "sender" "public"."Sender" NOT NULL;

-- CreateIndex
CREATE INDEX "ChatMessage_userId_createdAt_idx" ON "public"."ChatMessage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_adminId_createdAt_idx" ON "public"."ChatMessage"("adminId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_sender_createdAt_idx" ON "public"."ChatMessage"("sender", "createdAt");

-- CreateIndex
CREATE INDEX "Questionnaire_userId_createdAt_idx" ON "public"."Questionnaire"("userId", "createdAt");
