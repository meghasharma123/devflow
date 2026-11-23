-- DropIndex
DROP INDEX "User_name_idx";

-- CreateIndex
CREATE INDEX "User_name_createdAt_idx" ON "User"("name", "createdAt");
