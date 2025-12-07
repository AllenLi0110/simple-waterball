-- Migration script to update avatar_url column to TEXT type
-- This script fixes the "value too long for type character varying(255)" error

-- For PostgreSQL: Alter the avatar_url column to TEXT type
-- This allows storing longer strings (like base64 encoded images)

-- Check if column exists and alter it
DO $$
BEGIN
    -- Check if the column exists and is not already TEXT
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'avatar_url'
        AND data_type != 'text'
    ) THEN
        ALTER TABLE users ALTER COLUMN avatar_url TYPE TEXT;
        RAISE NOTICE 'Column avatar_url has been altered to TEXT type';
    ELSE
        RAISE NOTICE 'Column avatar_url is already TEXT type or does not exist';
    END IF;
END $$;
