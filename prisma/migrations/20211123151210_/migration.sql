-- AlterTable
ALTER TABLE `BuyDetail` ADD COLUMN `inStock` INTEGER NOT NULL DEFAULT 0;

-- RenameIndex
ALTER TABLE `Account` RENAME INDEX `Account_userId_unique` TO `Account_userId_key`;
