# Google Sheets Sync - Setup Completo

## 🎯 Objetivo
Sincronizar dados de faturamento da Google Sheets para o Supabase **automaticamente** todos os dias.

---

## 📋 Passo 1: Acessar o Google Apps Script

1. Abra a planilha:
   - https://docs.google.com/spreadsheets/d/15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc

2. Menu superior: **Extensions > Apps Script**

3. Vai abrir uma nova aba com o editor de scripts

---

## 📝 Passo 2: Colar o Script

1. **Delete TODO código existente** (se houver)

2. **Cole o código abaixo:**

```javascript
// Google Sheets App Script for syncing data to Supabase

// Configuration
const SUPABASE_URL = 'https://zuwnaejrihlhdmbwoirw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d25hZWpyaWhsaGRtYndvaXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDcxMzQsImV4cCI6MjA5MjEyMzEzNH0.Jr2YWcIxYr8naMdhwziEIWgGVWKTeLwqFnFglB8s5LA';
const SHEET_ID = '15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc';

// Sheet names to sync
const SHEETS_TO_SYNC = ['FAT SET 26', 'FAT OUT26', 'FAT NOV26', 'FAT DEZ27'];

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

  // Extract Salão data (columns C, E, F = indices 2, 4, 5)
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const dateValue = row[2]; // Column C
    const target = parseFloat(row[4]) || 0; // Column E
    const actual = parseFloat(row[5]) || 0; // Column F

    if (dateValue && !isNaN(dateValue.getTime ? dateValue.getTime() : 0)) {
      const date = formatDate(dateValue);
      if (date && target > 0 || actual > 0) {
        data.push({
          date,
          channel: 'salao',
          target_revenue: target,
          actual_revenue: actual,
          order_count: 0
        });
      }
    }
  }

  // Extract Delivery data (columns N, P, Q = indices 13, 15, 16)
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const dateValue = row[13]; // Column N
    const target = parseFloat(row[15]) || 0; // Column P
    const actual = parseFloat(row[16]) || 0; // Column Q

    if (dateValue && !isNaN(dateValue.getTime ? dateValue.getTime() : 0)) {
      const date = formatDate(dateValue);
      if (date && (target > 0 || actual > 0)) {
        data.push({
          date,
          channel: 'delivery',
          target_revenue: target,
          actual_revenue: actual,
          order_count: 0
        });
      }
    }
  }

  return data;
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
  return {
    status: response.getResponseCode(),
    response: response.getContentText()
  };
}

// Test function
function testSync() {
  const result = syncSheetsToSupabase();
  Logger.log(JSON.stringify(result, null, 2));
}
```

3. **Clique em "Save"** (Ctrl+S)

---

## 🧪 Passo 3: Testar o Script

1. No editor, selecione a função **`testSync`** na dropdown
2. Clique no botão **▶️ Run**
3. Na primeira execução, vai pedir permissões - **clique "Allow"**
4. Verifique o **Execution log** (abaixo) para ver o resultado

**Esperado:**
```
{
  "timestamp": "2026-09-29T...",
  "sheetsProcessed": 4,
  "results": [...]
}
```

---

## 🔑 Passo 4: Deploy como Webhook (Opcional)

Se quiser testar via HTTP POST:

1. **Deploy > New Deployment**
2. Tipo: **Web app**
3. Execute como: Sua conta
4. Acesso: **Anyone**
5. Copie a URL gerada
6. Teste com:

```bash
curl -X POST "https://script.google.com/macros/d/..." \
  -H "Content-Type: application/json"
```

---

## ⏰ Passo 5: Agendar Sincronização Automática

1. No Apps Script, clique no ícone de **Triggers** (relógio ⏰)
2. Clique em **"Create new trigger"** (botão azul)
3. Configure assim:

| Campo | Valor |
|-------|-------|
| **Function** | `syncSheetsToSupabase` |
| **Which event type calls the function** | `Time-driven` |
| **Type of time interval** | `Day timer` |
| **Time of day** | `6:00 AM` *(escolha o melhor horário)* |
| **Failure notification settings** | `Notify me immediately` |

4. Clique **Save**

**Pronto!** Agora o script vai executar **todos os dias** no horário escolhido.

---

## ✅ Verificar se Sincronizou

### No Supabase:

```sql
SELECT * FROM daily_sales_metrics 
ORDER BY date DESC 
LIMIT 10;
```

Você deve ver os dados vindo da Google Sheets! 🎉

### No Dashboard:

Recarregue http://localhost:5173/ e veja os dados atualizados em tempo real.

---

## 🆘 Troubleshooting

### Erro: "Permission denied"
- Precisa executar `testSync()` manualmente uma vez
- Vai pedir autorização - clique "Allow"

### Erro: "Sheets not found"
- Verifique se os nomes das abas estão exatos
- Use: `Logger.log(spreadsheet.getSheets());` para listar

### Erro de conexão Supabase
- Verifique a URL e chave
- Tente fazer POST manual na URL com curl

### Dados não aparecem no dashboard
- Verifique no Supabase se foram inseridos
- Recarregue o navegador (Ctrl+Shift+R)

---

## 🚀 Próximos Passos

1. **Monitore os logs** nos primeiros dias
2. **Ajuste o horário** se necessário
3. **Verifique dados** no Supabase regularmente
4. **Implemente Colibri sync** quando Google Sheets estiver 100%

---

**Status**: ✅ Sincronização automática configurada!
