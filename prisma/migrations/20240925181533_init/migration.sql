/*
  Warnings:

  - Added the required column `status` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Job` ADD COLUMN `status` VARCHAR(10) NOT NULL;
