-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Buy" DROP CONSTRAINT "Buy_userId_fkey";

-- DropForeignKey
ALTER TABLE "BuyDetail" DROP CONSTRAINT "BuyDetail_buyId_fkey";

-- DropForeignKey
ALTER TABLE "BuyDetail" DROP CONSTRAINT "BuyDetail_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Sell" DROP CONSTRAINT "Sell_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Sell" DROP CONSTRAINT "Sell_userId_fkey";

-- DropForeignKey
ALTER TABLE "SellDetail" DROP CONSTRAINT "SellDetail_productId_fkey";

-- DropForeignKey
ALTER TABLE "SellDetail" DROP CONSTRAINT "SellDetail_sellId_fkey";

-- AlterTable
ALTER TABLE "SellDetail" ADD COLUMN     "inStock" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buy" ADD CONSTRAINT "Buy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyDetail" ADD CONSTRAINT "BuyDetail_buyId_fkey" FOREIGN KEY ("buyId") REFERENCES "Buy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyDetail" ADD CONSTRAINT "BuyDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sell" ADD CONSTRAINT "Sell_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sell" ADD CONSTRAINT "Sell_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellDetail" ADD CONSTRAINT "SellDetail_sellId_fkey" FOREIGN KEY ("sellId") REFERENCES "Sell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellDetail" ADD CONSTRAINT "SellDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Client.dni_unique" RENAME TO "Client_dni_key";

-- RenameIndex
ALTER INDEX "Product.sku_unique" RENAME TO "Product_sku_key";

-- RenameIndex
ALTER INDEX "ProductCategory.name_unique" RENAME TO "ProductCategory_name_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "User.username_unique" RENAME TO "User_username_key";
