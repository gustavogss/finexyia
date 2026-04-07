## 1. 📌 Visão Geral Técnica

Este documento descreve a arquitetura, design técnico e estrutura do sistema de um aplicativo de finanças pessoais com IA.

Arquitetura híbrida:

- Firebase (BaaS)
- Backend próprio (API)
- Aplicativo mobile (React Native)

---

## 2. 🏗️ Arquitetura Geral

### Camadas

1. Frontend (Mobile)
2. Firebase (BaaS)
3. Backend (API)
4. Serviços externos (IA e pagamentos)

---

### Diagrama

[ React Native App ]
↓
[ Firebase ]
(Auth / Firestore / FCM)
↓
[ Backend API ]
(Node.js + Prisma + PostgreSQL)
↓
[ IA + Pagamentos (Stripe) ]

---

## 3. 📱 Frontend

### Tecnologias

- React Native
- TypeScript
- Tailwind (NativeWind)

---

### Estrutura de Pastas

/src
/components
/screens
/navigation
/services
/hooks
/store
/utils
/types

---

### Responsabilidades

- Interface do usuário
- Consumo de APIs
- Integração com Firebase
- Gerenciamento de estado

---

## 4. 🔐 Firebase

### Serviços

- Authentication
- Firestore
- Cloud Messaging (FCM)

---

### Coleções

#### users

- id
- name
- email
- plan (free/premium)
- createdAt

#### transactions

- id
- userId
- type (income/expense)
- amount
- category
- date
- description

#### goals

- id
- userId
- title
- targetAmount
- currentAmount

#### bills

- id
- userId
- name
- amount
- dueDate
- reminderEnabled

---

## 5. 🧠 Backend API

### Tecnologias

- Node.js
- Prisma ORM
- PostgreSQL
- Docker

---

### Estrutura

/src
/modules
/auth
/users
/credits
/payments
/ai
/rewards
/middlewares
/services
/utils

---

### Responsabilidades

- Regras de negócio
- Sistema de créditos
- Integração com IA
- Pagamentos
- Recompensas

---

## 6. 🗄️ Banco de Dados

### users

- id
- email
- plan
- stripeCustomerId
- createdAt

---

### subscriptions

- id
- userId
- status
- currentPeriodEnd

---

### credits

- id
- userId
- balance
- updatedAt

---

### credit_transactions

- id
- userId
- type (purchase/reward/usage)
- amount
- createdAt

---

### rewards

- id
- userId
- type
- credits
- status
- releaseDate

---

## 7. 🔌 APIs

### Auth

- POST /auth/login
- POST /auth/register

---

### Credits

- GET /credits
- POST /credits/use
- POST /credits/purchase

---

### Payments

- POST /payments/subscribe
- POST /payments/webhook
- POST /payments/buy-credits

---

### IA

- POST /ai/insights
- POST /ai/predict-balance
- POST /ai/simulate-investment

---

### Rewards

- GET /rewards
- POST /rewards/process

---

## 8. 🧠 IA

### Funcionalidades

- Insights financeiros
- Previsão de saldo
- Simulação de investimentos

---

### Fluxo

App → Backend → IA → Backend → App

---

### Regras

- Cada chamada consome 1 crédito
- Validar saldo antes

---

## 9. 💳 Pagamentos

### Plataforma

- Stripe

---

### Funcionalidades

- Assinatura mensal
- Compra de créditos

---

### Webhooks

- Confirma pagamento
- Atualiza assinatura
- Libera créditos

---

## 10. 🔔 Notificações

- Contas a vencer
- Insights IA
- Recompensas

---

## 11. 🔐 Segurança

- Autenticação via token
- Validação no backend
- Proteção de endpoints
- Verificação de webhooks

---

## 12. ⚙️ Regras de Negócio

### Créditos

- 1 uso de IA = 1 crédito
- Premium: 50 créditos/mês

---

### Recompensas

- Liberadas dia 10
- Apenas usuários ativos

---

### Plano Premium

- Acesso completo
- Renovação automática

---

## 13. 🚀 Escalabilidade

- Firebase escala automático
- Backend com Docker
- PostgreSQL para consistência

---

## 14. 🧪 Testes

- Unitários (backend)
- Integração
- UI (frontend)

---

## 15. 📊 Monitoramento

- Logs backend
- Erros
- Métricas de uso

---

## 16. 🔄 Deploy

### Frontend

- Play Store

### Backend

- VPS ou Cloud

### Banco

- PostgreSQL gerenciado

---

## 17. 🎯 Considerações

Sistema projetado para:

- SaaS escalável
- Monetização por assinatura + créditos
- Uso intensivo de IA
- Evolução contínua## 15. 📊 Monitoramento

- Logs backend
- Erros
- Métricas de uso

---

## 16. 🔄 Deploy

### Frontend

- Play Store

### Backend

- VPS ou Cloud

### Banco

- PostgreSQL gerenciado

---

## 17. 🎯 Considerações

Sistema projetado para:

- SaaS escalável
- Monetização por assinatura + créditos
- Uso intensivo de IA
- Evolução contínua
