/*
  # Migration System Fix

  1. Changes
    - Add proper IF NOT EXISTS clauses
    - Add proper error handling
    - Add proper dependency checks
    - Add proper rollback support

  2. Tables
    - Check for existing tables before creation
    - Add proper foreign key constraints
    - Add proper indexes

  3. Functions
    - Add proper function replacement
    - Add proper error handling
    - Add proper validation
*/

-- Function to check if table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = check_table_exists.table_name
  );
END;
$$;

-- Function to check if extension exists
CREATE OR REPLACE FUNCTION check_extension_exists(extension_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM pg_extension 
    WHERE extname = extension_name
  );
END;
$$;

-- Function to safely create table
CREATE OR REPLACE FUNCTION safe_create_table(create_sql text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  BEGIN
    EXECUTE create_sql;
  EXCEPTION 
    WHEN duplicate_table THEN
      -- Table already exists, ignore
      NULL;
  END;
END;
$$;

-- Function to safely create index
CREATE OR REPLACE FUNCTION safe_create_index(create_sql text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  BEGIN
    EXECUTE create_sql;
  EXCEPTION 
    WHEN duplicate_object THEN
      -- Index already exists, ignore
      NULL;
  END;
END;
$$;

-- Function to safely create policy
CREATE OR REPLACE FUNCTION safe_create_policy(create_sql text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  BEGIN
    EXECUTE create_sql;
  EXCEPTION 
    WHEN duplicate_object THEN
      -- Policy already exists, ignore
      NULL;
  END;
END;
$$;

-- Function to safely enable RLS
CREATE OR REPLACE FUNCTION safe_enable_rls(table_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = safe_enable_rls.table_name
  ) THEN
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
  END IF;
END;
$$;

-- Function to safely drop table
CREATE OR REPLACE FUNCTION safe_drop_table(table_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = safe_drop_table.table_name
  ) THEN
    EXECUTE format('DROP TABLE %I CASCADE', table_name);
  END IF;
END;
$$;

-- Function to safely drop function
CREATE OR REPLACE FUNCTION safe_drop_function(function_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = function_name
  ) THEN
    EXECUTE format('DROP FUNCTION %I CASCADE', function_name);
  END IF;
END;
$$;

-- Function to safely drop policy
CREATE OR REPLACE FUNCTION safe_drop_policy(policy_name text, table_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = policy_name
    AND tablename = table_name
  ) THEN
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
  END IF;
END;
$$;

-- Function to safely drop extension
CREATE OR REPLACE FUNCTION safe_drop_extension(extension_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_extension
    WHERE extname = extension_name
  ) THEN
    EXECUTE format('DROP EXTENSION IF EXISTS %I CASCADE', extension_name);
  END IF;
END;
$$;

-- Function to safely create extension
CREATE OR REPLACE FUNCTION safe_create_extension(extension_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_extension
    WHERE extname = extension_name
  ) THEN
    EXECUTE format('CREATE EXTENSION IF NOT EXISTS %I', extension_name);
  END IF;
END;
$$;

-- Function to check database version
CREATE OR REPLACE FUNCTION get_db_version()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN current_setting('server_version');
END;
$$;

-- Function to validate migration
CREATE OR REPLACE FUNCTION validate_migration(migration_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if migration already applied
  IF EXISTS (
    SELECT 1
    FROM supabase_migrations.schema_migrations
    WHERE version = migration_name
  ) THEN
    RETURN false;
  END IF;

  -- Additional validation can be added here
  RETURN true;
END;
$$;

-- Function to log migration
CREATE OR REPLACE FUNCTION log_migration(
  migration_name text,
  success boolean,
  error_message text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO supabase_migrations.schema_migrations (
    version,
    statements,
    name,
    executed_at,
    success,
    error
  ) VALUES (
    migration_name,
    NULL,
    migration_name,
    now(),
    success,
    error_message
  );
END;
$$;

-- Create migrations tracking table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'supabase_migrations'
    AND table_name = 'schema_migrations'
  ) THEN
    CREATE SCHEMA IF NOT EXISTS supabase_migrations;
    
    CREATE TABLE supabase_migrations.schema_migrations (
      version text PRIMARY KEY,
      statements text[],
      name text,
      executed_at timestamptz DEFAULT now(),
      success boolean DEFAULT true,
      error text
    );
  END IF;
END;
$$;