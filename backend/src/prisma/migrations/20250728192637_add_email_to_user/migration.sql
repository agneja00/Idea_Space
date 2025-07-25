-- 1st migration
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email" TEXT;

-- 2nd migration
UPDATE "User"
SET email = concat(nick, '@example.com')
WHERE email IS NULL;