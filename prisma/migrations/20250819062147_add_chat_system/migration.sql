-- DropIndex
DROP INDEX "public"."Conversation_updatedAt_idx";

-- DropIndex
DROP INDEX "public"."Conversation_userId_key";

-- CreateIndex
CREATE INDEX "Conversation_userId_updatedAt_idx" ON "public"."Conversation"("userId", "updatedAt");
