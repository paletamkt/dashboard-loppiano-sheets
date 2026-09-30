# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

# Dashboard Loppiano 🍕

Sistema integrado de dashboard para análise de faturamento e vendas da Loppiano Pizza.

## 📋 Visão Geral

O dashboard reúne dados de duas principais fontes:

1. **Google Sheets** - Métricas de faturamento diário por canal (Salão e Delivery)
2. **Colibri** - Relatórios detalhados de vendas, produtos e atendentes

## 🚀 Configuração Inicial

### Pré-requisitos

- Node.js 18+
- Conta Supabase
- Credenciais Google Cloud
- Acesso à plataforma Colibri

### 1. Variáveis de Ambiente

```bash
cp .env.example .env.local
```

### 2. Setup Supabase

Execute SQL em `supabase/migrations/001_create_tables.sql`

### 3. Setup Google Sheets

Configure o App Script em `scripts/google-sheets-sync.gs`

## 📦 Instalação

```bash
npm install
npm run dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/    # React components
├── hooks/        # Custom hooks
├── lib/          # Utilities
├── types/        # TypeScript types
└── App.tsx
```

## 📊 Fluxo de Dados

```
Google Sheets → Supabase → Frontend
Colibri → Supabase → Frontend
```

Desenvolvido com ❤️ para Loppiano Pizza
