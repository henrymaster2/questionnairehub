/*
  Warnings:

  - You are about to drop the column `receiverEmail` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderEmail` on the `Message` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderEmail_fkey";

-- DropIndex
DROP INDEX "public"."Message_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Message_senderEmail_receiverEmail_idx";

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "receiverEmail",
DROP COLUMN "senderEmail",
ADD COLUMN     "receiverId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
