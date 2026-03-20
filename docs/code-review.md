# Code Review Completo

## Escopo analisado
- App Router pages (`app/*`)
- API Routes de autenticação (`app/api/auth/*`)
- Middlewares e fluxo de sessão (`middleware.ts`, `lib/jwt.ts`, `lib/plan-routing.ts`)
- Serviços de dados Firebase/Firestore (`lib/firestore-data.ts`, `lib/*-config.ts`, `lib/subscription.ts`)
- Contextos e hooks de estado (`lib/transactions-context.tsx`, `lib/use-auth-user.ts`)

## Fluxo de dados principal
- `signup` cria usuário no Firebase Auth e documento em `users` com dados iniciais e assinatura trial.
- `login` valida Auth + dados em Firestore e cria cookie de sessão JWT via `api/auth/session`.
- `middleware` valida cookie JWT, expiração do trial e rota permitida por perfil/plano.
- Páginas de dashboard/transactions/profile/recompensas usam snapshots Firestore em tempo real.
- Configurações de plano e recompensas vêm de `config/plans` e `config/rewards`.

## Pontos fortes
- Boa separação entre acesso a dados (`lib/firestore-data.ts`) e UI.
- Uso consistente de hooks e composição de componentes.
- Regra de trial/plano centralizada em funções utilitárias.
- Validação de shape das configs remotas (`plans`/`rewards`) antes do uso.

## Riscos e pontos de atenção
- `lib/jwt.ts` usa fallback de segredo (`changeme`) quando `JWT_SECRET` não existe; isso é risco de segurança em produção.
- `api/auth/session` aceita payload direto do cliente; ideal reforçar validação de origem dos campos sensíveis (plano/trial).
- `next.config.ts` contém chave `eslint` legada que pode quebrar em versões recentes do Next.
- Parte dos textos de produto/feature ainda é estática (copy), embora os números de negócio tenham sido externalizados.

## Duplicações / oportunidades de refatoração
- Repetição de lógica de carregamento de perfil/config em páginas diferentes.
- Formatação e manipulação monetária dispersas (alguns formatos locais vs utilitário).
- Construção de payload de sessão repetida entre pontos de entrada.

## Diretrizes para testes
- Cobrir API routes de sessão (`GET`/`POST`) para casos válidos/invalidos.
- Cobrir `plan-routing`, `subscription`, `plans-config` e `rewards-config`.
- Cobrir middleware para cenários de:
  - não autenticado
  - trial ativo
  - trial expirado
  - plano visitante/básico/premium
- Testes de componente para páginas críticas de entrada (`login`, `pricing`) e comportamento condicional de UI.

## Priorização de execução
1. Refatoração de configuração/build e extração de lógica repetida.
2. Setup completo de Jest + RTL + supertest + mocks Firebase.
3. Testes da regra de negócio de planos e API routes.
4. Execução de `test`, `dev`, `build` e correção de falhas.
