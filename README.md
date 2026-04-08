# PetHUB — Frontend

Interface web do PetHUB. Construída com **React + Vite + TypeScript + Tailwind CSS**, deployada na **Vercel**.

---

## Pré-requisitos

- Node.js 20+
- Backend do PetHUB rodando (local ou em produção)

---

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` e aponte `VITE_API_BASE_URL` para o backend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Iniciar em modo dev

```bash
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

---

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite HMR) |
| `npm run build` | Compila TypeScript e gera o bundle de produção em `dist/` |
| `npm run preview` | Serve o bundle de produção localmente |
| `npm test` | Roda os testes unitários (Jest + RTL) |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run test:e2e` | Testes end-to-end com Playwright |
| `npm run test:e2e:ui` | Playwright em modo interativo |

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_API_BASE_URL` | Sim | URL base do backend (ex: `https://pethub-api.vercel.app`) |

---

## Arquitetura

```
src/
├── modules/              # Módulos de domínio
│   └── <module>/
│       ├── components/   # Componentes React orientados a props
│       ├── hooks/        # Lógica de estado e chamadas de API
│       ├── pages/        # Páginas (conectam hooks + componentes)
│       ├── services/     # Funções que chamam o api.client
│       ├── types/        # Interfaces TypeScript
│       └── __tests__/
├── shared/
│   ├── components/       # Layout, UI reutilizável (Button, Card, ContactGate, ...)
│   ├── hooks/            # Hooks genéricos (useActingAs, useDebounce)
│   ├── services/         # api.client (axios wrapper com interceptores)
│   ├── utils/            # image.ts (compressão), validators
│   └── types/
├── routes/               # Configuração de rotas (react-router v7)
├── App.tsx               # Restauração de sessão + ErrorBoundary
└── main.tsx              # Entry point
```

Fluxo de dados: `page → hook → service → api.client → backend`

---

## Módulos implementados

| Módulo | Rotas |
|--------|-------|
| Auth | `/entrar`, `/cadastrar`, `/esqueci-senha`, `/redefinir-senha`, `/verificar-email` |
| Person | `/pessoas/:id`, `/pessoas/:id/editar` |
| Organization | `/organizacoes`, `/organizacoes/:id`, `/organizacoes/:id/editar`, `/organizacoes/:id/painel` |
| Pet | `/pets`, `/pets/:id`, `/pets/:id/editar`, `/pets/:id/saude` |
| Adoption | `/adocao`, `/adocao/:id`, `/adocao/novo`, `/adocao/:id/editar` |
| Lost & Found | `/achados-perdidos`, `/achados-perdidos/:id`, `/achados-perdidos/novo`, `/achados-perdidos/:id/editar` |
| Services | `/servicos`, `/servicos/:id`, `/servicos/novo`, `/servicos/:id/editar` |

---

## Testes

```bash
npm test                 # Testes unitários
npm run test:coverage    # Com cobertura (mínimo: 80% statements/lines, 70% branches, 65% functions)
```

### Testes E2E (Playwright)

Requerem backend local rodando e contas de teste com e-mail verificado no banco:

```bash
# Certifique-se que o backend está em http://localhost:3000
npm run test:e2e
```

As contas de teste são configuradas em `e2e/fixtures.ts`.

---

## Deploy (Vercel)

O projeto usa `vercel.json` com rewrite para SPA (`/* → /index.html`).

A variável `VITE_API_BASE_URL` deve ser configurada no painel da Vercel apontando para a URL de produção do backend.
