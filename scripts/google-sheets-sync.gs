// Google Sheets App Script for syncing data to Supabase
// Deploy as web app to get a webhook URL

// Configuration
const SUPABASE_URL = 'https://zuwnaejrihlhdmbwoirw.supabase.co';
const SUPABASE_KEY = 'your_supabase_service_role_key'; // Use service role key, not anon key
const SHEET_ID = '15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc';

// Sheet names to sync (modify as needed)
const SHEETS_TO_SYNC = ['FAT SET 26', 'FAT OUT26', 'FAT NOV26', 'FAT DEZ27'];

// Column mapping for Salão (Hall)
const SALAO_COLUMNS = {
  dateCol: 'C',      // Column C: date
  targetCol: 'E',    // Column E: target revenue
  actualCol: 'F'     // Column F: actual revenue
};

// Column mapping for Delivery
const DELIVERY_COLUMNS = {
  dateCol: 'N',      // Column N: date
  targetCol: 'P',    // Column P: target revenue
  actualCol: 'Q'     // Column Q: actual revenue
};

function doPost(e) {
  try {
    const result = syncSheetsToSupabase();
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function syncSheetsToSupabase() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const results = [];

  for (const sheetName of SHEETS_TO_SYNC) {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        Logger.log(`Sheet ${sheetName} not found`);
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
      }
    } catch (error) {
      Logger.log(`Error processing ${sheetName}: ${error.toString()}`);
      results.push({
        sheet: sheetName,
        error: error.toString()
      });
    }
  }

  return {
    timestamp: new Date().toISOString(),
    sheetsProcessed: results.length,
    results: results
  };
}

function extractSalesData(sheet) {
  const data = [];
  const values = sheet.getDataRange().getValues();

  // Extract Salão data
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const dateValue = row[2]; // Column C (index 2)
    const target = parseFloat(row[4]) || 0; // Column E (index 4)
    const actual = parseFloat(row[5]) || 0; // Column F (index 5)

    if (dateValue && !isNaN(dateValue.getTime())) {
      const date = formatDate(dateValue);
      data.push({
        date,
        channel: 'salao',
        target_revenue: target,
        actual_revenue: actual,
        order_count: 0 // Will be filled from Colibri data
      });
    }
  }

  // Extract Delivery data
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const dateValue = row[13]; // Column N (index 13)
    const target = parseFloat(row[15]) || 0; // Column P (index 15)
    const actual = parseFloat(row[16]) || 0; // Column Q (index 16)

    if (dateValue && !isNaN(dateValue.getTime())) {
      const date = formatDate(dateValue);
      data.push({
        date,
        channel: 'delivery',
        target_revenue: target,
        actual_revenue: actual,
        order_count: 0
      });
    }
  }

  return data;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function uploadToSupabase(salesData) {
  const url = `${SUPABASE_URL}/rest/v1/daily_sales_metrics`;

  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    payload: JSON.stringify(salesData),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  return {
    status: response.getResponseCode(),
    response: result
  };
}

// Manual trigger function (for testing)
function testSync() {
  const result = syncSheetsToSupabase();
  Logger.log(JSON.stringify(result, null, 2));
}
