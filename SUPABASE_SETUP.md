# Configuração Supabase - Passo a Passo

## 🔑 Passo 1: Obter Credenciais do Supabase

1. Acesse: **https://app.supabase.com**
2. Selecione o projeto `zuwnaejrihlhdmbwoirw`
3. No menu esquerdo, vá para **Settings > API**
4. Copie:
   - **Project URL** (exemplo: `https://zuwnaejrihlhdmbwoirw.supabase.co`)
   - **Anon Key** (a chave pública)

5. Copie essas chaves para o arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://zuwnaejrihlhdmbwoirw.supabase.co
VITE_SUPABASE_ANON_KEY=<colar_a_anon_key_aqui>
VITE_GOOGLE_SHEETS_ID=15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc
VITE_GOOGLE_API_KEY=<colar_google_api_key_aqui_opcional>
VITE_COLIBRI_LOGIN_URL=https://loppianopizza.colibricloud.com/login.html
```

## 🗄️ Passo 2: Criar as Tabelas no Supabase

1. Acesse: **https://zuwnaejrihlhdmbwoirw.supabase.co**
2. Vá para **SQL Editor** (menu esquerdo)
3. Clique em **New Query**
4. **Cole todo o código abaixo:**

```sql
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

-- Create indexes for better performance
CREATE INDEX idx_daily_sales_date ON daily_sales_metrics(date);
CREATE INDEX idx_daily_sales_channel ON daily_sales_metrics(channel);
CREATE INDEX idx_hourly_sales_date ON hourly_sales_metrics(date);
CREATE INDEX idx_hourly_sales_hour ON hourly_sales_metrics(hour);
CREATE INDEX idx_product_sales_date ON product_sales(date);
CREATE INDEX idx_product_sales_group ON product_sales(product_group);
CREATE INDEX idx_attendant_metrics_date ON attendant_metrics(date);
CREATE INDEX idx_attendant_metrics_name ON attendant_metrics(attendant_name);

-- Enable RLS (Row Level Security)
ALTER TABLE daily_sales_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE hourly_sales_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendant_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheets_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE colibri_sync_log ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read
CREATE POLICY "Allow authenticated users to read" ON daily_sales_metrics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to read" ON hourly_sales_metrics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to read" ON product_sales FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to read" ON attendant_metrics FOR SELECT USING (true);
```

5. Clique no botão **▶️ RUN** (canto superior direito)
6. Aguarde a mensagem de sucesso "Queries executed successfully"

## ✅ Passo 3: Verificar se Está Tudo Pronto

### Verificar se as tabelas foram criadas:

No **SQL Editor**, execute:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Você deve ver:
- ✅ `daily_sales_metrics`
- ✅ `hourly_sales_metrics`
- ✅ `product_sales`
- ✅ `attendant_metrics`
- ✅ `sheets_sync_log`
- ✅ `colibri_sync_log`

### Inserir dados de teste (opcional):

```sql
INSERT INTO daily_sales_metrics (date, channel, actual_revenue, target_revenue, order_count, average_ticket)
VALUES 
  ('2026-09-28', 'salao', 2500.00, 2000.00, 25, 100.00),
  ('2026-09-28', 'delivery', 1800.00, 1500.00, 18, 100.00),
  ('2026-09-29', 'salao', 2800.00, 2000.00, 28, 100.00),
  ('2026-09-29', 'delivery', 2000.00, 1500.00, 20, 100.00);
```

## 🎯 Próxima Etapa

Depois que confirmar que tudo está funcionando:

1. Verifique se o `.env.local` está preenchido
2. Abra http://localhost:5173/ no navegador
3. Você deve ver dados no dashboard!

---

## 🆘 Troubleshooting

### Erro: "Queries executed failed"

**Solução**: Copie a query linha por linha, não toda de uma vez. Ou limpe espaços em branco extras.

### Erro: "Table already exists"

**Solução**: As tabelas já existem. Execute apenas:
```sql
SELECT * FROM daily_sales_metrics LIMIT 1;
```
para verificar se há dados.

### Dashboard vazio depois de tudo configurado

**Solução**: 
1. Verifique o console do navegador (F12) para erros
2. Verifique se a Anon Key está correta
3. Tente inserir dados de teste (veja acima)

---

**Está tudo pronto! 🎉**
