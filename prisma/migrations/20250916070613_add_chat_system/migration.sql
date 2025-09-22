-- CreateIndex
CREATE INDEX "Message_senderId_receiverId_idx" ON "public"."Message"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "public"."Message"("createdAt");
