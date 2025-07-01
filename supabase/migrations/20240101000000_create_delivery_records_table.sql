
-- Create delivery_records table
CREATE TABLE delivery_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bike_number VARCHAR(50) NOT NULL,
  chassis_number VARCHAR(100),
  bike_model VARCHAR(100),
  bike_details TEXT,
  registration_date DATE,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_mobile VARCHAR(20) NOT NULL,
  buyer_address TEXT,
  sell_amount DECIMAL(10,2) NOT NULL,
  sale_date DATE NOT NULL,
  buyer_photo TEXT, -- Base64 encoded image
  documents JSONB DEFAULT '{}', -- Store document images as JSON
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX idx_delivery_records_user_id ON delivery_records(user_id);
CREATE INDEX idx_delivery_records_bike_number ON delivery_records(bike_number);
CREATE INDEX idx_delivery_records_sale_date ON delivery_records(sale_date);

-- Enable RLS (Row Level Security)
ALTER TABLE delivery_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own delivery records" ON delivery_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own delivery records" ON delivery_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own delivery records" ON delivery_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own delivery records" ON delivery_records
  FOR DELETE USING (auth.uid() = user_id);
