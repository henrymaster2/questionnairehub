/*
  Warnings:

  - You are about to drop the column `brandInfo` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `contactInfo` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `dataStorage` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `mainPurpose` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `securityNeeds` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `specialFeatures` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `targetRegions` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `valueToUsers` on the `Questionnaire` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Questionnaire" DROP COLUMN "brandInfo",
DROP COLUMN "contactInfo",
DROP COLUMN "dataStorage",
DROP COLUMN "mainPurpose",
DROP COLUMN "securityNeeds",
DROP COLUMN "specialFeatures",
DROP COLUMN "targetRegions",
DROP COLUMN "valueToUsers",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "purpose" TEXT,
ADD COLUMN     "regions" TEXT,
ADD COLUMN     "security" TEXT,
ADD COLUMN     "specialTech" TEXT,
ADD COLUMN     "storage" TEXT,
ADD COLUMN     "value" TEXT;
