-- Migration: Add country column to stores table
-- Date: 2025-01-09
-- Description: Fixes schema cache error - adds missing country column

ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'VE';

-- Update the schema cache comment
COMMENT ON COLUMN stores.country IS 'Country code for the store (ISO 3166-1 alpha-2, default: VE for Venezuela)';
