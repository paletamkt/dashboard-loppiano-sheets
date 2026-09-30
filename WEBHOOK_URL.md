# Google Apps Script - Webhook Deployado ✅

## 📌 Informações do Deployment

**Status**: ✅ **ATIVO E FUNCIONANDO**

| Info | Valor |
|------|-------|
| **Código de Implantação** | `AKfycbzIe0SdCL9KJ-s7GEieO3TJxBGKGe7aQrwGuhuT26mfYRKHSX4_PWjHB9pO8tcz-pxX` |
| **URL do Webhook** | `https://script.google.com/macros/s/AKfycbzIe0SdCL9KJ-s7GEieO3TJxBGKGe7aQrwGuhuT26mfYRKHSX4_PWjHB9pO8tcz-pxX/exec` |
| **Método** | `POST` |
| **Content-Type** | `application/json` |

---

## 🧪 Testar o Webhook

### Via cURL:

```bash
curl -X POST "https://script.google.com/macros/s/AKfycbzIe0SdCL9KJ-s7GEieO3TJxBGKGe7aQrwGuhuT26mfYRKHSX4_PWjHB9pO8tcz-pxX/exec" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Resposta esperada:

```json
{
  "timestamp": "2026-09-29T14:30:00.000Z",
  "sheetsProcessed": 4,
  "results": [
    {
      "sheet": "FAT SET 26",
      "recordsUploaded": 20,
      "status": 201
    },
    {
      "sheet": "FAT OUT26",
      "recordsUploaded": 18,
      "status": 201
    },
    ...
  ]
}
```

---

## 🔄 Como Sincronizar Dados

### Opção 1: Manualmente via cURL

```bash
# Sincroniza imediatamente
curl -X POST "https://script.google.com/macros/s/AKfycbzIe0SdCL9KJ-s7GEieO3TJxBGKGe7aQrwGuhuT26mfYRKHSX4_PWjHB9pO8tcz-pxX/exec" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Opção 2: Via Apps Script Trigger (Automático)

1. No Google Apps Script, configure um **Trigger**:
   - Função: `syncSheetsToSupabase`
   - Frequência: `Daily` às `6:00 AM`
   - Automático todos os dias!

### Opção 3: Via Dashboard (Frontend)

Você pode criar um botão "Sincronizar Agora" no dashboard que chama este webhook:

```javascript
async function syncNow() {
  const response = await fetch(
    'https://script.google.com/macros/s/AKfycbzIe0SdCL9KJ-s7GEieO3TJxBGKGe7aQrwGuhuT26mfYRKHSX4_PWjHB9pO8tcz-pxX/exec',
    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
  );
  const result = await response.json();
  console.log('Sync result:', result);
}
```

---

## ✅ Verificar Sincronização

### No Supabase:

```sql
-- Ver último sync
SELECT * FROM sheets_sync_log 
ORDER BY updated_at DESC 
LIMIT 5;

-- Ver dados sincronizados
SELECT * FROM daily_sales_metrics 
WHERE updated_at >= NOW() - INTERVAL '1 day'
ORDER BY date DESC;
```

### No Dashboard:

Recarregue http://localhost:5173/ para ver os dados atualizados! 🎉

---

## 📊 O que Sincroniza

- **Abas**: FAT SET 26, FAT OUT26, FAT NOV26, FAT DEZ27
- **Dados Salão**: Coluna C (data), E (meta), F (realizado)
- **Dados Delivery**: Coluna N (data), P (meta), Q (realizado)
- **Destino**: Tabela `daily_sales_metrics` no Supabase

---

## 🔐 Segurança

- ✅ Webhook público (qualquer um pode chamar)
- ✅ Dados sensíveis NO supabase (chave segura no Apps Script)
- ✅ RLS ativado no Supabase (leitura apenas)

---

## 🚀 Próximos Passos

### Agora (Imediato):
1. ✅ Webhook deployado
2. ✅ Testar sincronização manual
3. ✅ Verificar dados no Supabase

### Este mês:
1. 📅 Configurar Trigger automático (diário)
2. 📊 Monitorar sincronização
3. 🔄 Adicionar Colibri sync

### Deploy:
1. 🌐 Publicar em Vercel/Netlify
2. 🎨 Customizar dashboard
3. 👥 Adicionar autenticação (opcional)

---

## 📝 Anotações

**URL salva para referência:**
```
https://script.google.com/macros/s/AKfycbzIe0SdCL9KJ-s7GEieO3TJxBGKGe7aQrwGuhuT26mfYRKHSX4_PWjHB9pO8tcz-pxX/exec
```

**Código de implantação:**
```
AKfycbzIe0SdCL9KJ-s7GEieO3TJxBGKGe7aQrwGuhuT26mfYRKHSX4_PWjHB9pO8tcz-pxX
```

---

**Status**: ✅ Webhook ativo e pronto para usar!
