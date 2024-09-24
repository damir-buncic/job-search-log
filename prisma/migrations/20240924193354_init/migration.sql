/*
  Warnings:

  - Changed the type of `appliedAt` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Job` DROP COLUMN `appliedAt`,
    ADD COLUMN `appliedAt` INTEGER NOT NULL;
