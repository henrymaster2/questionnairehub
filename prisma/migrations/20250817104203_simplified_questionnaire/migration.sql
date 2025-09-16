/*
  Warnings:

  - You are about to drop the column `accessibility` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `ageGroups` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `designStyle` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `designType` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedUsers` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `goals` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `onlineOffline` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `organization` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `performance` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `platforms` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `problem` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `regions` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `scalability` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `security` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `specialTech` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `storage` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `targetUsers` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Questionnaire` table. All the data in the column will be lost.
  - Added the required column `budget` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectType` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeline` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Made the column `features` on table `Questionnaire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Questionnaire` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Questionnaire" DROP COLUMN "accessibility",
DROP COLUMN "ageGroups",
DROP COLUMN "brand",
DROP COLUMN "contact",
DROP COLUMN "date",
DROP COLUMN "designStyle",
DROP COLUMN "designType",
DROP COLUMN "estimatedUsers",
DROP COLUMN "goals",
DROP COLUMN "onlineOffline",
DROP COLUMN "organization",
DROP COLUMN "performance",
DROP COLUMN "platforms",
DROP COLUMN "problem",
DROP COLUMN "purpose",
DROP COLUMN "regions",
DROP COLUMN "scalability",
DROP COLUMN "security",
DROP COLUMN "specialTech",
DROP COLUMN "storage",
DROP COLUMN "targetUsers",
DROP COLUMN "updatedAt",
DROP COLUMN "value",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "budget" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "projectType" TEXT NOT NULL,
ADD COLUMN     "timeline" TEXT NOT NULL,
ALTER COLUMN "features" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
