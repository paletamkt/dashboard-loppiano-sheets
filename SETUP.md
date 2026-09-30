# Setup Guia - Dashboard Loppiano

## 1️⃣ Preparação Inicial

### Clone o repositório
```bash
git clone https://github.com/paletamkt/dashboard-loppiano-sheets.git
cd dashboard-loppiano-sheets
npm install
```

### Crie `.env.local`
```bash
cp .env.example .env.local
```

---

## 2️⃣ Supabase Setup

### Criar tabelas do banco de dados

1. Acesse [Supabase Console](https://app.supabase.com)
2. Selecione o projeto `zuwnaejrihlhdmbwoirw`
3. Vá para **SQL Editor**
4. Clique em "New Query"
5. Cole o conteúdo de `supabase/migrations/001_create_tables.sql`
6. Execute

Ou via CLI:
```bash
supabase link --project-ref zuwnaejrihlhdmbwoirw
supabase db push
```

### Obter credenciais

1. No Supabase, acesse **Settings > API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`
3. Cole em `.env.local`

---

## 3️⃣ Google Sheets Setup

### Obter Google API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie novo projeto (ou use existente)
3. Ative **Google Sheets API**:
   - Search "Sheets API"
   - Clique "Enable"
4. Vá para **Credentials** (lado esquerdo)
5. Clique "Create Credentials" > "API Key"
6. Copie a chave
7. Cole em `.env.local` como `VITE_GOOGLE_API_KEY`

### Configurar App Script para sincronização

1. Acesse a planilha: https://docs.google.com/spreadsheets/d/15QbfZGenF6uKiG4_7tKutjFkxZ4EQudetjw_wlfM4gc
2. Clique em **Extensions > Apps Script**
3. Delete todo código existente
4. Cole o código de `scripts/google-sheets-sync.gs`

### Atualizar chave do Supabase no App Script

1. No Supabase, acesse **Settings > API**
2. Selecione **Service Role Secret** (cuidado! chave com permissões totais)
3. Copie a chave
4. No Apps Script, encontre a linha `const SUPABASE_KEY = '...'`
5. Substitua com a chave copiada

### Deploy como Webhook

1. No Apps Script, clique **Deploy** (botão superior direito)
2. Selecione **New Deployment**
3. Tipo: **Web app**
4. Execute como: Sua conta
5. Acesso: **Anyone**
6. Clique Deploy
7. Copie a URL de deploy (você precisará para testes)

### Agendar sincronização automática

1. No Apps Script, clique no ícone de **Triggers** (relógio)
2. Clique **Create new trigger**
3. Configure:
   - Função: `syncSheetsToSupabase`
   - Qual evento: `Time-driven`
   - Tipo: `Day timer`
   - Horário: `06:00 AM` (escolha o melhor horário)
4. Salve

**Nota:** A primeira sincronização pode levar alguns minutos. Verifique o Supabase para confirmar que os dados chegaram.

---

## 4️⃣ Colibri Setup (Manual por enquanto)

### Exportar dados do Colibri

1. Acesse https://loppianopizza.colibricloud.com/login.html
2. Navegue até os relatórios:
   - Faturamento Diário Sintético Multi-loja
   - Faturamento por Hora e Loja
   - Faturamento por Modo de Venda
   - Venda de Materiais por Grupo e Loja
   - Volume de Vendas por Atendente

3. Para cada relatório, clique "Exportar" e salve como CSV/JSON

### Processar dados

Por enquanto, você precisará carregar os dados manualmente no Supabase ou esperar pela implementação de sincronização automática.

**TODO**: Implementar Edge Function para automatizar às 23:30

---

## 5️⃣ Iniciar o Dashboard

```bash
npm run dev
```

Acesse http://localhost:5173

---

## ✅ Checklist de Verificação

- [ ] Tabelas criadas no Supabase
- [ ] `.env.local` preenchido com credenciais corretas
- [ ] App Script deployado como web app
- [ ] Trigger agendado no Google Sheets
- [ ] Dados aparecem no dashboard
- [ ] Colibri (manual ou automático) configurado

---

## 🆘 Troubleshooting

### "Nenhum dado disponível" no dashboard

1. Verifique se os dados foram sincronizados:
   ```sql
   SELECT * FROM daily_sales_metrics LIMIT 10;
   ```
2. Se vazio, rode o App Script manualmente:
   - No Apps Script, selecione função `testSync`
   - Clique ▶️ Run
   - Verifique logs

### Erro de autenticação Supabase

1. Verificar `.env.local`:
   - URL correta? https://zuwnaejrihlhdmbwoirw.supabase.co
   - Anon Key válida?
2. No navegador, abra DevTools (F12)
3. Guia Console - procure por erros vermelhos

### Google Sheets não sincroniza

1. Verifique se o Service Role Secret está correto no Apps Script
2. No Apps Script, use a função `testSync()` para testar
3. Verifique se os nomes das abas estão em `SHEETS_TO_SYNC`

---

## 📚 Próximos Passos

1. Customizar filtros de data
2. Adicionar mais gráficos e visualizações
3. Implementar sincronização automática Colibri
4. Deploy para produção (Vercel, Netlify)
5. Configurar acesso de usuários

---

**Desenvolvido com ❤️ para Loppiano Pizza**
