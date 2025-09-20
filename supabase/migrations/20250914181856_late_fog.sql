/*
  # Create users table for FARMAR application

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `mobile` (text, unique)
      - `password_hash` (text)
      - `role` (text, default 'farmer')
      - `last_login` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `users` table
    - Add policies for users to read/update their own data
    - Add unique constraint on mobile number
    - Add indexes for performance

  3. Additional Features
    - Automatic timestamp updates
    - Role-based access (farmer, admin)
    - Mobile number validation
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL CHECK (length(first_name) >= 2 AND length(first_name) <= 50),
  last_name text NOT NULL CHECK (length(last_name) >= 2 AND length(last_name) <= 50),
  mobile text UNIQUE NOT NULL CHECK (mobile ~ '^[6-9][0-9]{9}$'),
  password_hash text NOT NULL,
  role text DEFAULT 'farmer' CHECK (role IN ('farmer', 'admin')),
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Create policy for service role (backend operations)
CREATE POLICY "Service role can manage all users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate mobile number format
CREATE OR REPLACE FUNCTION validate_indian_mobile(mobile_number text)
RETURNS boolean AS $$
BEGIN
  RETURN mobile_number ~ '^[6-9][0-9]{9}$';
END;
$$ LANGUAGE plpgsql;

-- Add comment to table
COMMENT ON TABLE users IS 'User accounts for FARMAR application with secure authentication';
COMMENT ON COLUMN users.mobile IS 'Indian mobile number (10 digits starting with 6-9)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.role IS 'User role: farmer or admin';