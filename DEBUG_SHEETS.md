# 🔍 Debug - Verificar Dados da Google Sheets

## 1️⃣ Abra o Google Apps Script

1. Abra a planilha: https://docs.google.com/spreadsheets/d/15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc
2. Extensions > **Apps Script**

---

## 2️⃣ Cole este Código de Debug

Substitua tudo por este código para ver os dados:

```javascript
function debugSheets() {
  const SHEET_ID = '15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc';
  const SHEETS_TO_SYNC = ['FAT SET 26', 'FAT OUT26', 'FAT NOV26', 'FAT DEZ27'];
  
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  
  for (const sheetName of SHEETS_TO_SYNC) {
    Logger.log("============================================");
    Logger.log(`🔍 VERIFICANDO ABA: ${sheetName}`);
    Logger.log("============================================");
    
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log(`❌ ABA NÃO ENCONTRADA: ${sheetName}`);
      continue;
    }
    
    const values = sheet.getDataRange().getValues();
    Logger.log(`Total de linhas: ${values.length}`);
    Logger.log(`Total de colunas: ${values[0].length}`);
    Logger.log("");
    Logger.log("📊 PRIMEIRAS 5 LINHAS:");
    
    // Mostra os dados das colunas relevantes
    for (let i = 0; i < Math.min(6, values.length); i++) {
      const row = values[i];
      Logger.log(`Linha ${i}:`);
      Logger.log(`  Coluna C (idx 2): ${row[2]}`);
      Logger.log(`  Coluna E (idx 4): ${row[4]}`);
      Logger.log(`  Coluna F (idx 5): ${row[5]}`);
      Logger.log(`  Coluna N (idx 13): ${row[13]}`);
      Logger.log(`  Coluna P (idx 15): ${row[15]}`);
      Logger.log(`  Coluna Q (idx 16): ${row[16]}`);
      Logger.log("");
    }
  }
}
```

---

## 3️⃣ Execute e Veja os Logs

1. Selecione a função **`debugSheets`** na dropdown
2. Clique **▶️ RUN**
3. Abra **Execution log** (abaixo)

---

## 4️⃣ Me Manda o Output

Me copie e cola TUDO que aparecer no Execution log. Assim vejo:

- ✅ Se as abas existem
- ✅ Se têm dados nas colunas certas
- ✅ Por que o webhook não está trazendo dados reais

---

## 📝 Exemplo de Output Esperado

```
============================================
🔍 VERIFICANDO ABA: FAT SET 26
============================================
Total de linhas: 25
Total de colunas: 30

📊 PRIMEIRAS 5 LINHAS:
Linha 0:
  Coluna C (idx 2): Data
  Coluna E (idx 4): Meta
  Coluna F (idx 5): Realizado
  Coluna N (idx 13): 2026-09-01
  Coluna P (idx 15): 1500.00
  Coluna Q (idx 16): 1800.50
```

---

**Depois que rodar, me manda o output que aparece no "Execution log"!** 👀
