# ⚙️ SPECS – Aplicativo de Finanças Pessoais com IA

## 1. 📌 Visão Geral

Este documento define as especificações funcionais e não funcionais do aplicativo de finanças pessoais com IA, incluindo regras de negócio, comportamento do sistema e requisitos técnicos.

---

## 2. 🎯 Requisitos Funcionais

### 2.1 Autenticação

- Usuário pode:
  - Criar conta (email/senha)
  - Fazer login
  - Permanecer autenticado
- Login social (Google)

---

### 2.2 Transações

#### Cadastro manual

- Criar receita/despesa com:
  - Valor (obrigatório)
  - Categoria
  - Data
  - Descrição

#### QR Code

- Ler QR Code de nota fiscal
- Extrair valor automaticamente (quando possível)
- Permitir edição manual

---

### 2.3 Dashboard

- Exibir:
  - Saldo total
  - Total de receitas
  - Total de despesas
  - Gráfico de pizza por categoria
  - Últimas transações

---

### 2.4 Contas a pagar

- Criar conta com:
  - Nome
  - Valor
  - Data de vencimento
- Enviar notificação 1 dia antes

---

### 2.5 Metas financeiras

- Criar meta:
  - Nome
  - Valor alvo
- Atualizar progresso
- Exibir status

---

### 2.6 Histórico

- Listar transações
- Filtrar por:
  - Data
  - Categoria
  - Tipo

---

### 2.7 Plano Premium

- Usuário pode:
  - Assinar plano Premium
  - Cancelar assinatura
- Sistema deve validar status do plano

---

### 2.8 Créditos

#### Regras

- Cada uso de IA consome 1 crédito
- Premium recebe 50 créditos/mês

#### Funcionalidades

- Consultar saldo
- Histórico de uso
- Compra de créditos

---

### 2.9 IA – Insights

- Analisar dados financeiros
- Gerar:
  - Alertas de gastos
  - Sugestões de economia

---

### 2.10 IA – Previsão de saldo

- Calcular projeção baseada em:
  - Histórico
  - Padrões de gasto
- Exibir:
  - Dias até saldo zerar
  - Alertas

---

### 2.11 IA – Simulação de investimentos

- Entrada:
  - Valor inicial
  - Perfil (conservador/moderado/arrojado)
- Saída:
  - Projeções (curto/médio/longo prazo)

---

### 2.12 Recompensas

#### Regras

- Liberadas dia 10 do mês seguinte

#### Condições

- 7 dias de uso → +1 crédito
- 2 meses Premium → +2 créditos
- Indicação convertida → +5 créditos

---

### 2.13 Notificações

- Contas a vencer
- Insights IA
- Recompensas

---

## 3. ⚙️ Requisitos Não Funcionais

### 3.1 Performance

- Tempo de resposta < 2 segundos
- UI fluida

---

### 3.2 Escalabilidade

- Suporte a crescimento de usuários
- Backend escalável

---

### 3.3 Segurança

- Autenticação segura
- Validação no backend
- Proteção de dados

---

### 3.4 Usabilidade

- Interface intuitiva
- Navegação simples
- Feedback visual

---

### 3.5 Disponibilidade

- Sistema disponível 99% do tempo

---

## 4. 🧠 Regras de Negócio

### Créditos

- Não permitir saldo negativo
- Validar antes de usar IA

---

### Plano Premium

- Ativa funcionalidades extras
- Renovação automática

---

### Recompensas

- Apenas usuários ativos
- Créditos liberados automaticamente

---

## 5. 🔌 Integrações

### Firebase

- Auth
- Firestore
- Notificações

---

### Backend

- Regras de negócio
- IA
- Créditos

---

### Pagamentos

- Stripe:
  - Assinatura
  - Compra de créditos

---

## 6. 📊 Estados do Sistema

### Usuário

- FREE
- PREMIUM

---

### Créditos

- DISPONÍVEL
- ESGOTADO

---

### Assinatura

- ATIVA
- CANCELADA
- EXPIRADA

---

## 7. 🚨 Casos de Erro

- Falha na leitura de QR Code → permitir edição manual
- Falta de créditos → bloquear IA
- Pagamento não confirmado → não liberar créditos
- Falha na IA → exibir mensagem amigável

---

## 8. 📈 Métricas

- Conversão para Premium
- Uso de IA
- Retenção
- Receita mensal (MRR)

---

## 9. 🔄 Fluxos Críticos

### Uso de IA

1. Verificar créditos
2. Consumir crédito
3. Executar IA
4. Retornar resultado

---

### Compra de créditos

1. Criar pagamento
2. Confirmar via webhook
3. Atualizar saldo

---

### Assinatura

1. Criar assinatura
2. Confirmar pagamento
3. Ativar plano

---

## 10. 🎯 Considerações

## Sistema projetado para

## 9. 🔄 Fluxos Críticos

### Uso de IA

1. Verificar créditos
2. Consumir crédito
3. Executar IA
4. Retornar resultado

---

### Compra de créditos

1. Criar pagamento
2. Confirmar via webhook
3. Atualizar saldo

---

### Assinatura

1. Criar assinatura
2. Confirmar pagamento
3. Ativar plano

---

## 10. 🎯 Considerações

Sistema projetado para:

- Monetização híbrida (assinatura + créditos)
- Alto engajamento
- Escalabilidade
- Experiência premium
