/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageUrl",
ADD COLUMN     "imageId" INTEGER;

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "modelName" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Asset_modelName_recordId_idx" ON "Asset"("modelName", "recordId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
