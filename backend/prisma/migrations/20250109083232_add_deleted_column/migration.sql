/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `messages` DROP COLUMN `isDeleted`,
    ADD COLUMN `isDeletedByReceiver` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `isDeletedBySender` BOOLEAN NULL DEFAULT false;
