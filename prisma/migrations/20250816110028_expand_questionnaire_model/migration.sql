/*
  Warnings:

  - You are about to drop the column `purpose` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `Questionnaire` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Questionnaire" DROP COLUMN "purpose",
DROP COLUMN "target",
ADD COLUMN     "accessibility" TEXT,
ADD COLUMN     "ageGroups" TEXT,
ADD COLUMN     "brandInfo" TEXT,
ADD COLUMN     "contactInfo" TEXT,
ADD COLUMN     "dataStorage" TEXT,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "designStyle" TEXT,
ADD COLUMN     "designType" TEXT,
ADD COLUMN     "estimatedUsers" TEXT,
ADD COLUMN     "goals" TEXT,
ADD COLUMN     "mainPurpose" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "onlineOffline" TEXT,
ADD COLUMN     "organization" TEXT,
ADD COLUMN     "performance" TEXT,
ADD COLUMN     "platforms" TEXT,
ADD COLUMN     "problem" TEXT,
ADD COLUMN     "scalability" TEXT,
ADD COLUMN     "securityNeeds" TEXT,
ADD COLUMN     "specialFeatures" TEXT,
ADD COLUMN     "targetRegions" TEXT,
ADD COLUMN     "targetUsers" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "valueToUsers" TEXT,
ALTER COLUMN "features" DROP NOT NULL;
