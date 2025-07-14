-- CreateTable
CREATE TABLE "AccountDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountNo" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "transactions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountDetail_userId_key" ON "AccountDetail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountDetail_accountNo_key" ON "AccountDetail"("accountNo");

-- AddForeignKey
ALTER TABLE "AccountDetail" ADD CONSTRAINT "AccountDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
