# 📱 PRD – Aplicativo de Finanças Pessoais com IA

## 1. 📌 Visão Geral

Aplicativo mobile-first para gerenciamento financeiro pessoal, permitindo que usuários controlem receitas, despesas, metas financeiras e recebam insights inteligentes com uso de IA.

O aplicativo segue modelo SaaS com plano gratuito e premium, incluindo sistema de créditos para uso de funcionalidades avançadas baseadas em IA.

---

## 2. 🎯 Objetivo do Produto

- Ajudar usuários a controlar suas finanças
- Melhorar a educação financeira
- Oferecer previsões e insights inteligentes
- Gerar receita recorrente via assinatura e venda de créditos

---

## 3. 👤 Público-Alvo

- Jovens adultos (18–40 anos)
- Usuários com renda ativa
- Pessoas que querem organizar finanças pessoais
- Iniciantes em investimentos

---

## 4. 💰 Modelo de Negócio

### 🆓 Plano Gratuito

- Registro manual de receitas e despesas
- Visualização básica de saldo
- Histórico simples

---

### 💎 Plano Premium (R$ 39,90/mês)

- 50 créditos mensais
- Insights com IA
- Simulação de investimentos
- Leitura de QR Code
- Lembretes de pagamento
- Orçamentos

---

### 💳 Compra de Créditos

- 10 créditos → R$ 15,90
- 30 créditos → R$ 29,90
- 50 créditos → R$ 39,90

---

## 5. 🧠 Sistema de Créditos

- Cada simulação de IA consome 1 crédito
- Créditos renovados mensalmente (Premium)
- Créditos podem ser comprados
- Créditos ganhos via recompensas

---

## 6. 🎁 Programa de Recompensas

Créditos liberados todo dia 10 do mês seguinte para usuários ativos:

- Uso por 7 dias consecutivos → +1 crédito
- Renovação automática por 2 meses → +2 créditos
- Indicação com assinatura Premium → +5 créditos

---

## 7. 📲 Funcionalidades

### 📊 Dashboard

- Saldo total
- Resumo mensal
- Gráfico de pizza por categoria
- Últimas transações
- Insight rápido com IA

---

### 💸 Transações

- Cadastro manual:
  - Receita
  - Despesa
- Leitura via QR Code:
  - Extração de valor (quando possível)

---

### 📅 Contas a Pagar

- Cadastro de contas
- Notificação 1 dia antes do vencimento

---

### 🎯 Metas Financeiras

- Criação de metas
- Acompanhamento de progresso

---

### 🧠 Insights com IA

- Análise de gastos
- Sugestões financeiras
- Alertas de consumo

---

### 📈 Simulação de Investimentos

- Perfil:
  - Conservador
  - Moderado
  - Arrojado
- Simulação:
  - Curto, médio e longo prazo
- Consome créditos

---

### 🔮 Previsão de Saldo (IA)

- Projeção baseada em comportamento
- Alertas de saldo negativo
- Simulação de cenários futuros

---

### 📜 Histórico

- Lista completa de transações
- Filtros por data/categoria

---

### 💳 Créditos

- Visualização de saldo
- Compra de créditos
- Histórico de uso

---

### 💎 Plano Premium

- Tela de upgrade
- Benefícios
- Assinatura

---

### 👤 Perfil

- Dados do usuário
- Plano atual
- Créditos disponíveis

---

### 🎁 Recompensas

- Missões
- Créditos a receber
- Data de liberação

---

### 🔔 Notificações

- Contas a vencer
- Insights IA
- Recompensas

---

## 8. 🧱 Arquitetura

### Frontend

- React Native
- TypeScript
- Tailwind (NativeWind)

---

### Backend (Híbrido)

#### Firebase

- Autenticação
- Banco (Firestore)
- Notificações

#### Backend Próprio

- Node.js
- Prisma ORM
- PostgreSQL
- Docker

Responsável por:

- Créditos
- IA
- Pagamentos
- Recompensas

---

### Pagamentos

- Stripe:
  - Assinaturas
  - Compra de créditos

---

## 9. 🔐 Segurança

- Autenticação segura
- Validação no backend
- Uso de webhooks (pagamentos)
- Proteção contra manipulação de créditos

---

## 10. 📊 Métricas de Sucesso

- Taxa de conversão Free → Premium
- Retenção mensal
- Uso de créditos
- Receita recorrente (MRR)
- Engajamento diário

---

## 11. 🚀 Roadmap (MVP)

### Fase 1

- Frontend completo
- Firebase integrado

### Fase 2

- Backend (créditos + IA)

### Fase 3

- Pagamentos (Stripe)

### Fase 4

- Taxa de conversão Free → Premium
- Retenção mensal
- Uso de créditos
- Receita recorrente (MRR)
- Engajamento diário

---

## 11. 🚀 Roadmap (MVP)

### Fase 1

- Frontend completo
- Firebase integrado

### Fase 2

- Backend (créditos + IA)

### Fase 3

- Pagamentos (Stripe)

### Fase 4

- Otimização e escala

---

## 12. 🎯 Diferenciais

- Sistema de créditos (monetização avançada)
- IA aplicada às finanças pessoais
- Simulação de investimentos
- UX premium estilo fintech
- Programa de recompensas
