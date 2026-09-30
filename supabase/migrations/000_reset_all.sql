-- ⚠️ LIMPAR TUDO - Execute isto PRIMEIRO para remover dados e tabelas antigas

-- Drop all tables if they exist (cascade para remover dependências)
DROP TABLE IF EXISTS colibri_sync_log CASCADE;
DROP TABLE IF EXISTS sheets_sync_log CASCADE;
DROP TABLE IF EXISTS attendant_metrics CASCADE;
DROP TABLE IF EXISTS product_sales CASCADE;
DROP TABLE IF EXISTS hourly_sales_metrics CASCADE;
DROP TABLE IF EXISTS daily_sales_metrics CASCADE;

-- Confirm deletion
SELECT 'All tables dropped successfully' AS status;
