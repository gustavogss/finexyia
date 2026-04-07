# 📱 Finexyia
### Inteligência Financeira na Palma da sua Mão.

[![CI/CD Pipeline](https://github.com/gustavogss/finexyia/actions/workflows/ci.yml/badge.svg)](https://github.com/gustavogss/finexyia/actions/workflows/ci.yml)
[![Expo](https://img.shields.io/badge/Expo-54.0-black?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81-blue?logo=react&logoColor=white)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?logo=firebase)](https://firebase.google.com/)

---

## 🌟 Visão Geral

**Finexyia** é um corretor financeiro pessoal impulsionado por IA, desenvolvido para ajudar você a dominar suas finanças com elegância e inteligência. Mais do que um simples rastreador de despesas, o Finexyia oferece previsões, simulações de investimentos e insights personalizados para que cada centavo conte.

## ✨ Funcionalidades Principais

| Recurso | Gratuito | Premium 💎 |
| :--- | :---: | :---: |
| Registro de Receitas/Despesas | ✅ | ✅ |
| Dashboards Dinâmicos | ✅ | ✅ |
| Metas Financeiras | ❌ | ✅ |
| Insights com IA | 1/dia | Ilimitado* |
| Simulação de Investimentos | ❌ | ✅ |
| Leitura de QR Code (NF) | ❌ | ✅ |
| Programa de Recompensas | ❌ | ✅ |

> *Conforme sistema de créditos mensais.

## 🛠️ Stack Tecnológica

- **Frontend**: React Native with [Expo](https://expo.dev/) (SDK 54)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS para Mobile)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Backend (Auth/DB)**: Firebase (Authentication & Cloud Firestore)
- **Inteligência**: Integração com LLMs para insights financeiros
- **Infraestrutura**: GitHub Actions (CI/CD) & EAS Build

## 🚀 Começando

### Pré-requisitos

- Node.js (LTS)
- Watchman (para macOS)
- Expo Go (em seu smartphone) ou Emulador Android/iOS

### Instalação

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/gustavogss/finexyia.git
    cd finexyia
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente**:
    Crie um arquivo `.env` baseado nos templates:
    ```bash
    cp .env.development .env
    ```
    *Preencha com suas chaves do Firebase obtidas no Console do Firebase.*

4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run start
    ```

## 🏗️ CI/CD & Deploy

O projeto utiliza uma esteira automatizada via **GitHub Actions**:

- **`develop`**: Validações automáticas e preview builds.
- **`staging`**: Deploy automático para ambiente de homologação via EAS.
- **`main`**: Build de produção e submissão automática.

## 📈 Roadmap

- [x] MVP Frontend estruturado.
- [x] Integração completa com Firebase.
- [x] Pipeline CI/CD automatizada.
- [ ] Integração com Gateway de Pagamento (Stripe).
- [ ] Refinamento dos modelos de IA para previsões de longo prazo.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido com ❤️ pela equipe Finexyia
</p>
