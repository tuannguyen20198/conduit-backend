/*
  Warnings:

  - You are about to drop the column `is_active` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "is_active";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_active";
