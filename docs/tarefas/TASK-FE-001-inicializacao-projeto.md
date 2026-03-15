# TASK-FE-001 — Inicialização do Projeto Frontend

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-001 |
| Módulo       | infra |
| Prioridade   | Alta |
| Dependências | Nenhuma |
| Status       | Pendente |

## Objetivo
Inicializar o projeto React com Vite, TypeScript, Tailwind CSS, react-hook-form, Zustand e configurar Jest com React Testing Library.

## Contexto
Ponto de partida do frontend. Nenhum módulo pode ser iniciado antes desta tarefa. O projeto é deployado na Vercel como SPA React. O design é mobile-first com Tailwind CSS.

## Checklist

### Pré-requisitos
- [ ] Node.js instalado (versão LTS)
- [ ] Backend URL disponível (ou local rodando)

### Red — Testes falhando primeiro
- [ ] Escrever um teste de smoke em `src/__tests__/App.test.tsx` verificando que o componente `App` renderiza sem erros
- [ ] Confirmar que falha (App ainda não configurado)

### Green — Implementação mínima
- [ ] `npm create vite@latest . -- --template react-ts`
- [ ] Instalar: `tailwindcss`, `@tailwindcss/vite`, `react-router-dom`
- [ ] Instalar: `react-hook-form`, `@hookform/resolvers`, `zod`
- [ ] Instalar: `zustand`
- [ ] Instalar: `axios`
- [ ] Instalar dev: `jest`, `ts-jest`, `@types/jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jest-environment-jsdom`
- [ ] Configurar `tailwind.config.ts` com tema do projeto
- [ ] Configurar `jest.config.ts`
- [ ] Configurar `src/styles/globals.css` com diretivas Tailwind
- [ ] Criar `src/App.tsx` básico com `RouterProvider`
- [ ] Criar `.env.example` com `VITE_API_BASE_URL`
- [ ] Criar `vercel.json` com rewrites para SPA (`/*` → `/index.html`)
- [ ] Confirmar que teste de smoke passa

### Refactor
- [ ] Verificar se paths do `tsconfig.json` estão configurados com alias `@/` apontando para `src/`

### Finalização
- [ ] `npm test` executa e passa
- [ ] `npm run dev` abre no browser sem erros de console
- [ ] `npm run build` compila sem erros
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação   | Arquivo |
|--------|---------|
| Criar  | `vite.config.ts` |
| Criar  | `tailwind.config.ts` |
| Criar  | `jest.config.ts` |
| Criar  | `tsconfig.json` |
| Criar  | `src/App.tsx` |
| Criar  | `src/main.tsx` |
| Criar  | `src/styles/globals.css` |
| Criar  | `src/styles/tokens.css` |
| Criar  | `.env.example` |
| Criar  | `vercel.json` |
| Criar  | `src/__tests__/App.test.tsx` |

## Critérios de Aceite
- [ ] `npm test` passa
- [ ] `npm run build` sem erros TypeScript
- [ ] Tailwind funcional (classe `bg-primary` ou similar renderiza cor)
- [ ] Alias `@/` funcional nos imports
