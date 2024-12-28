-- AlterTable
ALTER TABLE `messages` MODIFY `isRead` BOOLEAN NULL DEFAULT false,
    MODIFY `isDeleted` BOOLEAN NULL DEFAULT false;
