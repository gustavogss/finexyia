# Firestore Schema - FinexyIA

## users
- `id` (string, uid do Firebase Auth)
- `name` (string)
- `email` (string)
- `photoURL` (string)
- `createdAt` (timestamp)
- `plan` (string: `basic` | `premium` | `visitante`)
- `credits` (number)
- `trial` (boolean)
- `trialActivated` (boolean)
- `trialExpiresAt` (timestamp | null)
- `openingBalance` (number)
- `autoRenewal` (boolean)
- `notifications` (map)
  - `spendingAlerts` (boolean)
  - `monthlyReports` (boolean)
  - `dueAlerts` (boolean)

## transactions
- `id` (string, auto)
- `userId` (string, ref lógica para `users.id`)
- `amount` (number)
- `type` (string: `income` | `expense`)
- `category` (string)
- `description` (string)
- `date` (timestamp)
- `createdAt` (timestamp)

## budgets
- `id` (string, auto)
- `userId` (string, ref lógica para `users.id`)
- `category` (string)
- `amount` (number)
- `createdAt` (timestamp)

## goals
- `id` (string, auto)
- `userId` (string, ref lógica para `users.id`)
- `name` (string)
- `targetAmount` (number)
- `currentAmount` (number)
- `monthlyTarget` (number)
- `history` (array de objetos)
  - `month` (string)
  - `saved` (number)
- `createdAt` (timestamp)

## reminders
- `id` (string, auto)
- `userId` (string, ref lógica para `users.id`)
- `name` (string)
- `amount` (number)
- `dueDate` (timestamp)
- `createdAt` (timestamp)

## cards
- `id` (string, auto)
- `userId` (string, ref lógica para `users.id`)
- `name` (string)
- `number` (string)
- `expiry` (string)
- `cvv` (string)
- `createdAt` (timestamp)

## subscription_events
- `id` (string, auto)
- `userId` (string, ref lógica para `users.id`)
- `plan` (string: `basic` | `premium` | `visitante`)
- `trial` (boolean)
- `credits` (number | string)
- `expiresAt` (timestamp | null)
- `createdAt` (timestamp)

## Relacionamentos
- `users.id` -> dono de todas as demais coleções
- `transactions.userId` -> `users.id`
- `budgets.userId` -> `users.id`
- `goals.userId` -> `users.id`
- `reminders.userId` -> `users.id`
- `cards.userId` -> `users.id`
- `subscription_events.userId` -> `users.id`

## Índices recomendados
- `transactions`: `userId ASC, date DESC`
- `budgets`: `userId ASC, createdAt DESC`
- `goals`: `userId ASC, createdAt DESC`
- `reminders`: `userId ASC, dueDate ASC`
- `cards`: `userId ASC, createdAt DESC`
- `subscription_events`: `userId ASC, createdAt DESC`
