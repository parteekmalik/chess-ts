/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MatchResult` table. All the data in the column will be lost.
  - The `timestamps` column on the `Move` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Puzzle` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "MatchResult" DROP COLUMN "createdAt",
ALTER COLUMN "winner" SET DEFAULT 'PLAYING';

-- AlterTable
ALTER TABLE "Move" DROP COLUMN "timestamps",
ADD COLUMN     "timestamps" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Puzzle";
