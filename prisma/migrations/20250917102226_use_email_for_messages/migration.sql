/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `receiverEmail` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderEmail` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropIndex
DROP INDEX "public"."Message_senderId_receiverId_idx";

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receiverEmail" TEXT NOT NULL,
ADD COLUMN     "senderEmail" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Message_senderEmail_receiverEmail_idx" ON "public"."Message"("senderEmail", "receiverEmail");

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderEmail_fkey" FOREIGN KEY ("senderEmail") REFERENCES "public"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_receiverEmail_fkey" FOREIGN KEY ("receiverEmail") REFERENCES "public"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
