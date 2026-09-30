# 🔍 Debug Completo - Ver TODAS as Colunas

## Cole Este Código no Apps Script

```javascript
function debugFullSheets() {
  const SHEET_ID = '15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc';
  const sheetName = 'FAT OUT26'; // Vamos começar por esta
  
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    Logger.log(`❌ Aba não encontrada: ${sheetName}`);
    return;
  }
  
  const values = sheet.getDataRange().getValues();
  
  Logger.log("============================================");
  Logger.log(`📊 TODAS AS COLUNAS - ABA: ${sheetName}`);
  Logger.log("============================================");
  Logger.log(`Total de linhas: ${values.length}`);
  Logger.log(`Total de colunas: ${values[0].length}`);
  Logger.log("");
  
  // Mostra linha por linha com TODAS as colunas
  for (let row = 0; row < Math.min(10, values.length); row++) {
    Logger.log(`\n📍 LINHA ${row}:`);
    for (let col = 0; col < values[row].length; col++) {
      const letter = String.fromCharCode(65 + col); // A, B, C, ...
      const value = values[row][col];
      if (value) { // Só mostra se tiver valor
        Logger.log(`  ${letter}${row + 1}: ${value}`);
      }
    }
  }
}
```

---

## Depois me manda o output completo!

Assim vou ver onde estão os dados reais e ajustar o script de sincronização! 👀
