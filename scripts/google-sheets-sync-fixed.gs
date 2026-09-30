// Google Sheets App Script - FASE 1 (SET26+ apenas)
// Sincroniza dados de faturamento para Supabase

const SUPABASE_URL = 'https://zuwnaejrihlhdmbwoirw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d25hZWpyaWhsaGRtYndvaXJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU0NzEzNCwiZXhwIjoyMDkyMTIzMTM0fQ.l8lGf5LwPlrEC0rQNr7zI6-EDOd-nO8wW97HxLEPlMo';
const SHEET_ID = '15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc';

// Abas de SET26 em diante (estrutura padrão)
const SHEETS_TO_SYNC = ['FAT SET26', 'FAT OUT26', 'FAT NOV26', 'FAT DEZ26'];
const TRIGGER_SHEETS = ['FAT SET26', 'FAT OUT26', 'FAT NOV26', 'FAT DEZ26'];

// Intervalo de dados para trigger
const DATA_START_ROW = 9;
const DATA_START_COL = 3;
const DATA_END_COL = 17;

// Trigger ao editar
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();

  if (!TRIGGER_SHEETS.includes(sheetName)) return;

  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();

  if (row < DATA_START_ROW || col < DATA_START_COL || col > DATA_END_COL) return;

  Logger.log(`🔄 Sincronizando ${sheetName}...`);
  const result = syncSingleSheet(sheetName);
  Logger.log(JSON.stringify(result, null, 2));
}

// Sincroniza uma aba
function syncSingleSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) return { error: `Sheet ${sheetName} not found` };

    const salesData = extractSalesData(sheet);
    if (salesData.length > 0) {
      const response = uploadToSupabase(salesData);
      return {
        timestamp: new Date().toISOString(),
        sheet: sheetName,
        recordsUploaded: salesData.length,
        status: response.status
      };
    }
    return { sheet: sheetName, message: 'No data' };
  } catch (error) {
    return { error: error.toString() };
  }
}

// Sincroniza todas as abas
function syncSheetsToSupabase() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const results = [];

  for (const sheetName of SHEETS_TO_SYNC) {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        Logger.log(`❌ ${sheetName}: not found`);
        continue;
      }

      const salesData = extractSalesData(sheet);
      if (salesData.length > 0) {
        const response = uploadToSupabase(salesData);
        results.push({
          sheet: sheetName,
          recordsUploaded: salesData.length,
          status: response.status
        });
        Logger.log(`✅ ${sheetName}: ${salesData.length} records`);
      }
    } catch (error) {
      Logger.log(`❌ ${sheetName}: ${error.toString()}`);
    }
  }

  return {
    timestamp: new Date().toISOString(),
    sheetsProcessed: results.length,
    results: results
  };
}

// Extrai dados (estrutura padrão: C/E/F e N/P/Q)
function extractSalesData(sheet) {
  const data = [];
  const values = sheet.getDataRange().getValues();

  // Colunas padrão
  const salaoDateCol = 2;
  const salaoMetaCol = 4;
  const salaoRealCol = 5;
  const deliveryDateCol = 13;
  const deliveryMetaCol = 15;
  const deliveryRealCol = 16;

  for (let i = 8; i < values.length; i++) {
    const row = values[i];

    // SALÃO
    const salaoDateVal = row[salaoDateCol];
    const salaoTarget = parseFloat(row[salaoMetaCol]) || 0;
    const salaoActual = parseFloat(row[salaoRealCol]) || 0;

    if ((salaoTarget > 0 || salaoActual > 0) && isValidDate(salaoDateVal)) {
      const date = formatDate(salaoDateVal);
      if (date) {
        data.push({
          date,
          channel: 'salao',
          target_revenue: salaoTarget,
          actual_revenue: salaoActual,
          order_count: 0
        });
      }
    }

    // DELIVERY
    const deliveryDateVal = row[deliveryDateCol];
    const deliveryTarget = parseFloat(row[deliveryMetaCol]) || 0;
    const deliveryActual = parseFloat(row[deliveryRealCol]) || 0;

    if ((deliveryTarget > 0 || deliveryActual > 0) && isValidDate(deliveryDateVal)) {
      const date = formatDate(deliveryDateVal);
      if (date) {
        data.push({
          date,
          channel: 'delivery',
          target_revenue: deliveryTarget,
          actual_revenue: deliveryActual,
          order_count: 0
        });
      }
    }
  }

  return data;
}

function uploadToSupabase(salesData) {
  const url = `${SUPABASE_URL}/rest/v1/daily_sales_metrics`;
  const options = {
    method: 'post',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    payload: JSON.stringify(salesData),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  return {
    status: response.getResponseCode(),
    response: response.getContentText()
  };
}

function isValidDate(dateValue) {
  if (!dateValue) return false;
  if (typeof dateValue === 'string') return false;
  if (isNaN(dateValue.getTime ? dateValue.getTime() : 0)) return false;
  return true;
}

function formatDate(date) {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return null;
  }
}

// Test function
function testSyncFixed() {
  const result = syncSheetsToSupabase();
  Logger.log(JSON.stringify(result, null, 2));
}
