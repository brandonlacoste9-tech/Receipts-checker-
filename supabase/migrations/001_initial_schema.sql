-- Receipts Checker Database Schema
-- Run this in Supabase SQL Editor

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  vendor TEXT NOT NULL,
  date DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'CAD' CHECK (currency IN ('CAD', 'USD')),
  category TEXT,
  line_items JSONB DEFAULT '[]',
  image_hash TEXT,
  is_duplicate BOOLEAN DEFAULT FALSE,
  linked_receipt_id UUID REFERENCES receipts(id),
  quebec_eligible BOOLEAN DEFAULT FALSE,
  quebec_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  quebec_tax_credit TEXT,
  icon TEXT
);

-- Enable Row Level Security
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for receipts
CREATE POLICY "Users can view own receipts" ON receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own receipts" ON receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own receipts" ON receipts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own receipts" ON receipts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for categories (read-only for everyone)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date);
CREATE INDEX IF NOT EXISTS idx_receipts_category ON receipts(category);
CREATE INDEX IF NOT EXISTS idx_receipts_image_hash ON receipts(image_hash);
CREATE INDEX IF NOT EXISTS idx_receipts_vendor ON receipts(vendor);

-- Insert default categories
INSERT INTO categories (name_en, name_fr, icon) VALUES
  ('Food & Dining', 'Alimentation', '🍔'),
  ('Transportation', 'Transport', '🚗'),
  ('Office Supplies', 'Fournitures de bureau', '📎'),
  ('Entertainment', 'Divertissement', '🎬'),
  ('Utilities', 'Services publics', '💡'),
  ('Healthcare', 'Santé', '🏥'),
  ('Donations', 'Dons', '❤️'),
  ('Shopping', 'Achats', '🛍️'),
  ('Travel', 'Voyage', '✈️'),
  ('Education', 'Éducation', '📚'),
  ('Home & Garden', 'Maison et jardin', '🏠'),
  ('Other', 'Autre', '📦')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON receipts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
