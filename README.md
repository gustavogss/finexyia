# FinexyIA

<div align="center">

**Gestão financeira pessoal inteligente com IA generativa**

[![Next.js](https://img.shields.io/badge/Next.js-15.4+-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[Recursos](#recursos) • [Instalação](#instalação) • [Uso](#uso) • [Arquitetura](#arquitetura)

</div>

---

## 📋 Visão Geral

**FinexyIA** é uma plataforma web moderna de gestão financeira pessoal que combina inteligência artificial generativa com uma interface intuitiva e segura. Designed para usuários que buscam clareza editorial e controle total sobre suas finanças.

Com FinexyIA, você pode:
- 💰 Registrar receitas e despesas com categorização inteligente
- 📊 Visualizar dados financeiros em dashboards interativos
- 🎯 Estabelecer metas e acompanhar progresso
- 🤖 Conversar com um assistente IA para insights financeiros
- 💳 Gerenciar cartões e métodos de pagamento
- 🔔 Receber alertas de vencimento e gastos
- 🎁 Coletar recompensas através de gamificação
- 📱 Acesso mobile-first com interface responsiva

---

## ✨ Recursos Principais

### 🎯 Gestão de Finanças
- **Dashboard Intuitivo**: Visualização em tempo real do saldo e fluxo de caixa
- **Rastreamento de Transações**: Registre receitas e despesas com categorias personalizadas
- **Orçamentos Inteligentes**: Crie metas de gastos por categoria
- **Histórico Detalhado**: Consulte todas as suas transações com filtros avançados

### 🤖 Assistente IA Generativo
- **Análise em Linguagem Natural**: Converse com a IA sobre suas finanças
- **Insights Automáticos**: Receba recomendações baseadas em seus padrões de gastos
- **Detecção de Anomalias**: Identifique gastos incomuns
- **Consultas Estratégicas**: Obtenha dicas para otimizar sua situação financeira

### 😌 Monitoramento e Alertas
- **Alertas de Vencimento**: Notificações 24h antes do vencimento de contas
- **Alertas de Gastos**: Aviso quando atingir 80% do teto orçamentário
- **Lembretes de Contas**: Gerenciador de datas de vencimento
- **Relatórios Mensais**: Resumo financeiro por email

### 💳 Gestão de Cartões e Pagamentos
- **Múltiplos Cartões**: Adicione e gerencie vários cartões
- **Pagamento PIX**: Suporte ao PIX com integração QR Code
- **Transações com Cartão**: Rastreie gastos por método de pagamento
- **Segurança**: Dados de cartão criptografados

### 🎁 Sistema de Recompensas
- **Gamificação**: Ganhe créditos por ações na plataforma
- **Metas de Economia**: Recompensas por atingir objetivos financeiros
- **Indicações**: Ganhe créditos ao convidar amigos
- **Fidelidade**: Bônus por manter assinatura ativa

### 🎯 Metas Financeiras
- **Objetivos Personalizados**: Estabeleça metas com alvo de valor e prazo
- **Progresso Visual**: Gráficos de barras mostrando evolução
- **Histórico Mensal**: Comparação com períodos anteriores
- **Análise de Tendências**: Identifique padrões de economia

### 👤 Gestão de Perfil
- **Planos de Assinatura**: Básico e Premium
- **Créditos de IA**: Sistema de créditos para consultas IA
- **Preferências Personalizadas**: Configure notificações e alertas
- **Renovação Automática**: Gestão de subscrição facilitada

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.4+ (React 19.2+)
- **Linguagem**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1 com Material Design 3
- **Animações**: Motion (Framer Motion)
- **Gráficos**: Recharts para visualizações de dados
- **Componentes**: Lucide React para ícones
- **Validação**: React Hook Form com Resolvers

### Backend & IA
- **IA Generativa**: Google Generative AI (`@google/genai`)
- **QR Code**: QR Code Reader (html5-qrcode) e Generator (qrcode.react)
- **Markdown**: React Markdown para renderização de conteúdo

### Ferramentas & Deploy
- **Linter**: ESLint com config Next.js
- **Build**: Next.js Build System
- **DevTools**: PostCSS, Autoprefixer
- **Firebase Tools**: Deploy e hosting

---

## 📂 Estrutura do Projeto

```
finexyia/
├── app/                          # Aplicação principal (App Router)
│   ├── page.tsx                 # Dashboard
│   ├── layout.tsx               # Layout base
│   ├── globals.css              # Estilos globais
│   ├── analysis/                # Análise de dados
│   ├── checkout/                # Processamento de pagamento
│   ├── goals/                   # Gestão de metas
│   ├── login/                   # Autenticação
│   ├── pricing/                 # Planos de assinatura
│   ├── profile/                 # Perfil do usuário
│   ├── recompensas/             # Sistema de recompensas
│   ├── transactions/            # Histórico de transações
│   └── signup/                  # Criação de conta
├── components/                  # Componentes React reutilizáveis
│   ├── add-budget-modal.tsx    # Modal de adição de orçamento
│   ├── add-card-modal.tsx      # Modal de adição de cartão
│   ├── assistant-modal.tsx     # Assistente IA Modal
│   ├── card-modal.tsx          # Modal de Cartão
│   ├── navigation.tsx          # Componentes de navegação
│   ├── notification-center.tsx # Centro de notificações
│   ├── pix-modal.tsx           # Modal de pagamento PIX
│   └── qr-scanner-modal.tsx    # Scanner QR Code
├── hooks/                       # React Hooks customizados
│   ├── use-mobile.ts           # Detecção de mobile
│   └── use-notifications.ts    # Gestão de notificações
├── lib/                         # Utilitários e contextos
│   ├── categories.ts           # Categorias de transações
│   ├── theme-context.tsx       # Contexto de tema
│   ├── transactions-context.tsx # Contexto de transações
│   └── utils.ts                # Funções utilitárias
├── package.json                # Dependências
├── tsconfig.json               # Configuração TypeScript
├── next.config.ts              # Configuração Next.js
├── tailwind.config.js          # Configuração Tailwind CSS
├── postcss.config.mjs          # Configuração PostCSS
└── eslint.config.mjs           # Configuração ESLint
```

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ ou superior
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/finexyia.git
   cd finexyia
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Adicione suas credenciais:
   ```env
   NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY=seu_google_api_key
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Abra o navegador**
   ```
   http://localhost:3000
   ```

---

## 💻 Uso

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar aplicação em produção
npm start

# Executar linter
npm run lint

# Limpar cache de build
npm run clean
```

### Fluxo Principal de Usuário

1. **Cadastro/Login**: Crie sua conta com email e senha
2. **Dashboard**: Visualize seu saldo e últimas transações
3. **Adicionar Transações**: Registre receitas e despesas
4. **Gerenciar Cartões**: Configure métodos de pagamento
5. **Estabelecer Metas**: Crie objetivos financeiros
6. **Consultar IA**: Use o assistente para insights
7. **Monitorar Alertas**: Configure notificações
8. **Acompanhar Recompensas**: Colete créditos

---

## 🏗️ Arquitetura

### Padrões de Arquitetura

```
┌─────────────────────────────────┐
│   User Interface (Components)   │
├─────────────────────────────────┤
│     React Hooks & Contexts      │
├─────────────────────────────────┤
│ Business Logic (Transactions)   │
├─────────────────────────────────┤
│   External Services (Google AI) │
└─────────────────────────────────┘
```

### State Management
- **Context API**: Gerenciamento de estado global
- **React Hooks**: `useState`, `useEffect`, `useContext`
- **LocalStorage**: Persistência de preferências do usuário

### Comunicação com IA
- **Google Generative AI API**: Integração com modelos de linguagem
- **Streaming**: Respostas em tempo real do assistente
- **Context Window**: Histórico de conversas para continuidade

---

## 🔒 Segurança

- ✅ TypeScript para type safety
- ✅ Validação de formulários com React Hook Form
- ✅ Clsx/Tailwind para prevenção de CSS injection
- ✅ Markdown rendering com sanitização
- ✅ LocalStorage para dados sensíveis (com criptografia recomendada)
- ✅ HTTPS em produção obrigatório
- ✅ Foco em segurança de dados financeiros

---

## 📊 Features em Desenvolvimento

- [ ] Suporte a múltiplas moedas
- [ ] Exportação de relatórios em PDF
- [ ] Sincronização com contas bancárias
- [ ] Mobile app nativa (React Native)
- [ ] Autenticação OAuth2
- [ ] Backup automático em nuvem
- [ ] Análise predictiva com ML
- [ ] Integração com carteiras digitais

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes
- Siga o estilo de código existente
- Adicione testes para novas features
- Atualize o README conforme necessário
- Mantenha mensagens de commit claras e descritivas

---

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através de:
- Email: support@finexyia.com
- Chat: Disponível no app via assistente IA
- Documentação: Visite nossa [Wiki](https://github.com/seu-usuario/finexyia/wiki)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Google Generative AI](https://ai.google.dev/) - Inteligência Artificial
- [Lucide React](https://lucide.dev/) - Ícones
- [Recharts](https://recharts.org/) - Gráficos

---

## 📈 Roadmap

### Q2 2026
- [ ] Sistema de notificações push avançado
- [ ] Exportação de dados em múltiplos formatos
- [ ] Integração com serviços bancários

### Q3 2026
- [ ] Dashboard colaborativo para casais
- [ ] Análise de investimentos
- [ ] Recomendações de produtos financeiros

### Q4 2026
- [ ] PWA com offline support
- [ ] Suporte multilíngue
- [ ] API REST pública

---

## 👨‍💻 Desenvolvedor

**Gustavo Silva**
- GitHub: [@gustavogss](https://github.com/gustavogss)
- Email: contato@gustavosouza.dev.br

---

<div align="center">

**Gerencie suas finanças com clareza e segurança com ajuda de nosso assistente de inteligência artificial** 💼✨

Made with ❤️ by FinexyIA Team

</div>
