-- 3rd migration
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");