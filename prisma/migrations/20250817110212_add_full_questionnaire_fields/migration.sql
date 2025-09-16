/*
  Warnings:

  - You are about to drop the column `features` on the `Questionnaire` table. All the data in the column will be lost.
  - Added the required column `backendNeeded` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communication` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostingDeployment` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Questionnaire" DROP COLUMN "features",
ADD COLUMN     "backendNeeded" BOOLEAN NOT NULL,
ADD COLUMN     "communication" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "hostingDeployment" BOOLEAN NOT NULL,
ADD COLUMN     "preferredTech" TEXT;
