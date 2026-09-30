-- Create daily_sales_metrics table
CREATE TABLE daily_sales_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('salao', 'delivery')),
  actual_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
  target_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  average_ticket DECIMAL(10, 2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, channel)
);

-- Create hourly_sales_metrics table
CREATE TABLE hourly_sales_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  channel TEXT NOT NULL CHECK (channel IN ('salao', 'delivery')),
  revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, hour, channel)
);

-- Create product_sales table
CREATE TABLE product_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  product_group TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create attendant_metrics table
CREATE TABLE attendant_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  attendant_name TEXT NOT NULL,
  total_sales DECIMAL(12, 2) NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  average_ticket DECIMAL(10, 2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_daily_sales_date ON daily_sales_metrics(date);
CREATE INDEX idx_daily_sales_channel ON daily_sales_metrics(channel);
CREATE INDEX idx_hourly_sales_date ON hourly_sales_metrics(date);
CREATE INDEX idx_hourly_sales_hour ON hourly_sales_metrics(hour);
CREATE INDEX idx_product_sales_date ON product_sales(date);
CREATE INDEX idx_product_sales_group ON product_sales(product_group);
CREATE INDEX idx_attendant_metrics_date ON attendant_metrics(date);
CREATE INDEX idx_attendant_metrics_name ON attendant_metrics(attendant_name);

-- Create sheets_sync_log table to track Google Sheets updates
CREATE TABLE sheets_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_name TEXT NOT NULL,
  last_synced_at TIMESTAMP,
  data_range TEXT,
  row_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sheet_name)
);

-- Create colibri_sync_log table to track Colibri data imports
CREATE TABLE colibri_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL,
  last_synced_at TIMESTAMP,
  data_point_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(report_type)
);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE daily_sales_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE hourly_sales_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendant_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheets_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE colibri_sync_log ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read
CREATE POLICY "Allow authenticated users to read" ON daily_sales_metrics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to read" ON hourly_sales_metrics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to read" ON product_sales FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to read" ON attendant_metrics FOR SELECT USING (true);
