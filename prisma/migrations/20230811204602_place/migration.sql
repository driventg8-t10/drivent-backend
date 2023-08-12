/*
  Warnings:

  - You are about to drop the column `place` on the `Activities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activities" DROP COLUMN "place",
ADD COLUMN     "placeId" INTEGER;

-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
