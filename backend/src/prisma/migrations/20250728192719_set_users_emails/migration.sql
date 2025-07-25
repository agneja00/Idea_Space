-- Check for NULLs
SELECT * FROM "User" WHERE email IS NULL;

-- Check for duplicates
SELECT email, COUNT(*) FROM "User"
GROUP BY email
HAVING COUNT(*) > 1;