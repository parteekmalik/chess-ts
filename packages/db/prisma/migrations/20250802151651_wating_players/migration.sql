-- CreateTable
CREATE TABLE "WatingPlayer" (
    "id" TEXT NOT NULL,
    "baseTime" INTEGER NOT NULL,
    "incrementTime" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WatingPlayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WatingPlayer" ADD CONSTRAINT "WatingPlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
