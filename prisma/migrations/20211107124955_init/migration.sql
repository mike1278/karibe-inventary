/*
  Warnings:

  - You are about to drop the column `providerId` on the `Buy` table. All the data in the column will be lost.
  - You are about to alter the column `priceTotal` on the `Buy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `BuyDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `product` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `priceTotal` on the `Sell` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `SellDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the `Provider` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Buy" DROP CONSTRAINT "Buy_providerId_fkey";

-- AlterTable
ALTER TABLE "Buy" DROP COLUMN "providerId",
ALTER COLUMN "priceTotal" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "BuyDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "providerPrice" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "product" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Sell" ALTER COLUMN "priceTotal" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SellDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Provider";
