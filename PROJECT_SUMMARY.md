# Resumo do Projeto - Dashboard Loppiano MVP

## 📊 O que foi construído

Um **dashboard web full-stack** para análise de faturamento e vendas da Loppiano Pizza, integrando dados de:
- **Google Sheets** (dados diários de meta e realizado)
- **Colibri** (relatórios detalhados de vendas)

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TypeScript)            │
│                                                                 │
│  ├─ Dashboard com KPIs (Faturamento, Meta, Tickets, Pedidos)   │
│  ├─ Gráfico de Barras (Real vs Meta)                           │
│  ├─ Gráfico de Pizza (Salão vs Delivery)                       │
│  ├─ Tabela detalhada de vendas por dia                         │
│  └─ Filtros de data (Data Inicial e Final)                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (API REST via Supabase)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Supabase + PostgreSQL)               │
│                                                                 │
│  ├─ Tabela: daily_sales_metrics                                │
│  ├─ Tabela: hourly_sales_metrics                               │
│  ├─ Tabela: product_sales                                      │
│  ├─ Tabela: attendant_metrics                                  │
│  ├─ Tabela: sheets_sync_log (rastreamento)                     │
│  └─ Tabela: colibri_sync_log (rastreamento)                    │
└─────────────────────────────────────────────────────────────────┘
         ↑                               ↑
         │                               │
   Google Sheets                       Colibri
   (App Script)                    (Edge Function)
      (diário)                        (23h30)
```

## 📁 Estrutura de Pastas

```
project/
├── src/
│   ├── components/
│   │   ├── DailySalesChart.tsx      # Gráfico de faturamento diário
│   │   ├── DailySalesTable.tsx      # Tabela de dados
│   │   ├── ChannelComparison.tsx    # Pizza chart Salão vs Delivery
│   │   └── SummaryCard.tsx          # Cards KPI
│   ├── hooks/
│   │   └── useSalesData.ts          # Hooks para fetch de dados
│   ├── lib/
│   │   └── supabase.ts              # Cliente Supabase
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   ├── App.tsx                      # Componente principal
│   ├── App.css                      # Estilos Tailwind
│   ├── index.css                    # Resets
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 001_create_tables.sql    # Schema SQL
├── scripts/
│   ├── google-sheets-sync.gs        # Google Apps Script
│   └── colibri-sync.ts              # Edge Function (TODO)
├── tailwind.config.js               # Tailwind config
├── postcss.config.js                # PostCSS config
├── vite.config.ts                   # Vite config
├── tsconfig.json                    # TypeScript config
├── package.json
├── .env.example
├── SETUP.md                         # Guia de setup passo-a-passo
├── README.md                        # README do projeto
└── index.html
```

## 🛠️ Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **UI Library** | Recharts (gráficos) + Lucide Icons |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (PostgreSQL) |
| **Data Sync** | Google Apps Script + (Future: Edge Functions) |
| **API Client** | @supabase/supabase-js |

## 🎯 Funcionalidades MVP

### ✅ Implementado

1. **Dashboard Principal**
   - 4 cards KPI (Faturamento Total, Meta, Pedidos, Ticket Médio)
   - Barra de progresso da meta (% atingido)
   - Filtros de data (Data Inicial e Final)

2. **Visualizações**
   - Gráfico de barras: Real vs Meta por dia
   - Gráfico de pizza: Proporção Salão vs Delivery
   - Tabela: Dados detalhados com % atingido por dia

3. **Integração Google Sheets**
   - App Script para sincronização automática
   - Mapeamento de colunas (C, E, F para Salão; N, P, Q para Delivery)
   - Agendamento automático

4. **Banco de Dados**
   - Schema PostgreSQL com 6 tabelas
   - Índices de performance
   - RLS (Row Level Security) para leitura pública

### 🔄 Em Desenvolvimento

- [ ] Sincronização automática Colibri às 23h30
- [ ] Tabelas adicionais (hourly sales, products, attendants)
- [ ] Filtros por canal (Salão/Delivery)
- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Autenticação de usuários
- [ ] Deploy em produção

## 🚀 Como Usar

### Instalação Rápida

```bash
# 1. Clone e instale
npm install

# 2. Configure variáveis (veja SETUP.md)
cp .env.example .env.local

# 3. Execute o banco de dados
# Execute o SQL em supabase/migrations/001_create_tables.sql

# 4. Inicie o servidor
npm run dev
```

### Deploy

```bash
# Build
npm run build

# Deploy (escolha uma plataforma)
# Vercel: vercel deploy
# Netlify: netlify deploy --prod
```

## 📊 Fluxo de Dados

### Google Sheets → Supabase

1. Google Sheets é atualizado manualmente
2. App Script executa trigger (diariamente)
3. Script extrai dados de colunas específicas
4. Dados são enviados via POST para Supabase
5. `daily_sales_metrics` é atualizado
6. Frontend busca dados e mostra no dashboard

**Frequência**: Diária (configurável)

### Colibri → Supabase

1. Edge Function executa diariamente às 23:30
2. Faz scraping/API call ao Colibri
3. Extrai relatórios exportados
4. Popula tabelas: `hourly_sales_metrics`, `product_sales`, `attendant_metrics`
5. Frontend busca e mostra dados

**Frequência**: Diária às 23:30

## 🔐 Segurança

- Variáveis de ambiente (.env.local) não commitadas
- Chaves de API armazenadas apenas em .env
- RLS ativado no Supabase para leitura pública
- CORS configurado para múltiplos domínios

## 📈 Métricas do Build

```
dist/index.html                   0.49 kB │ gzip:  0.31 kB
dist/assets/index-C-1nWKEb.css    7.89 kB │ gzip:  2.50 kB
dist/assets/index-BNxLblAX.js   227.90 kB │ gzip: 71.66 kB

✓ built in 1.37s
```

## 📝 Próximos Passos

1. **Completar Colibri Sync**
   - Implementar Edge Function
   - Configurar exportação automática

2. **Melhorias UI/UX**
   - Dark mode
   - Modo responsivo móvel
   - Mais gráficos (linha, área, etc)

3. **Funcionalidades**
   - Filtros avançados
   - Exportação de dados
   - Alertas de meta não atingida

4. **Deploy**
   - Configurar domínio customizado
   - SSL certificate
   - CI/CD pipeline

## 🆘 Troubleshooting

Ver arquivo `SETUP.md` para troubleshooting completo.

## 📞 Suporte

- **Documentação**: Veja `SETUP.md` para guia passo-a-passo
- **Issues**: Abra uma issue no repositório GitHub
- **Contato**: Paleta Marketing

---

## Checklist Final

- [x] Estrutura React + TypeScript criada
- [x] Componentes de dashboard implementados
- [x] Supabase schema criado
- [x] Google Sheets sync script criado
- [x] Tailwind CSS configurado
- [x] Build sem erros
- [x] Documentação completa
- [ ] Testes automatizados (TODO)
- [ ] Colibri sync Edge Function (TODO)
- [ ] Deploy em produção (TODO)

---

**Desenvolvido com ❤️ para Loppiano Pizza**
**Status**: MVP Funcional ✅
**Data**: 2026-09-29
