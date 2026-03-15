# TASK-FE-002 — Camada Shared (API Client, Layout, UI Components)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-002 |
| Módulo       | shared |
| Prioridade   | Alta |
| Dependências | TASK-FE-001 |
| Status       | Pendente |

## Objetivo
Criar a infraestrutura compartilhada: API client tipado, componentes de layout mobile-first (AppShell, BottomNav), componentes UI base e tipos globais.

## Contexto
- `api.client.ts` injeta `VITE_API_BASE_URL` e o token JWT automaticamente.
- `BottomNav.tsx` é a navegação principal no mobile — não usar hambúrguer.
- Touch targets mínimos: 44x44px.
- Todos os componentes UI compartilhados vivem em `shared/components/ui/`.

## Checklist

### Pré-requisitos
- [ ] TASK-FE-001 concluída

### Red — Testes falhando primeiro
- [ ] Escrever testes para `api.client.ts`: injeta base URL, injeta header Authorization quando tem token
- [ ] Escrever testes para `Button`: renderiza texto, aplica variante, chama `onClick`
- [ ] Escrever testes para `BottomNav`: renderiza links de navegação corretos
- [ ] Confirmar que os testes falham

### Green — Implementação mínima
- [ ] Criar `src/shared/services/api.client.ts` (axios instance com interceptors de request/response)
- [ ] Criar `src/shared/types/index.ts` (`ApiResponse<T>`, `ApiError`, `PaginationMeta`)
- [ ] Criar `src/shared/components/ui/Button.tsx`
- [ ] Criar `src/shared/components/ui/Input.tsx`
- [ ] Criar `src/shared/components/ui/Card.tsx`
- [ ] Criar `src/shared/components/ui/Modal.tsx`
- [ ] Criar `src/shared/components/ui/Spinner.tsx`
- [ ] Criar `src/shared/components/layout/AppShell.tsx`
- [ ] Criar `src/shared/components/layout/BottomNav.tsx` (mobile) com tabs principais
- [ ] Criar `src/shared/components/layout/Header.tsx`
- [ ] Criar `src/shared/components/layout/PageWrapper.tsx`
- [ ] Criar `src/shared/hooks/useDebounce.ts`
- [ ] Criar `src/shared/hooks/usePagination.ts`
- [ ] Confirmar que todos os testes passam

### Refactor
- [ ] Garantir que todos os componentes UI aceitam `className` extra via props
- [ ] Garantir touch targets mínimos 44px nos componentes interativos

### Finalização
- [ ] Todos os testes passando
- [ ] Componentes visualmente verificados no browser (mobile viewport)
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação  | Arquivo |
|-------|---------|
| Criar | `src/shared/services/api.client.ts` |
| Criar | `src/shared/types/index.ts` |
| Criar | `src/shared/components/ui/Button.tsx` |
| Criar | `src/shared/components/ui/Input.tsx` |
| Criar | `src/shared/components/ui/Card.tsx` |
| Criar | `src/shared/components/ui/Modal.tsx` |
| Criar | `src/shared/components/ui/Spinner.tsx` |
| Criar | `src/shared/components/layout/AppShell.tsx` |
| Criar | `src/shared/components/layout/BottomNav.tsx` |
| Criar | `src/shared/components/layout/Header.tsx` |
| Criar | `src/shared/components/layout/PageWrapper.tsx` |
| Criar | `src/shared/hooks/useDebounce.ts` |
| Criar | `src/shared/hooks/usePagination.ts` |
| Criar | `src/shared/components/ui/__tests__/Button.test.tsx` |
| Criar | `src/shared/components/layout/__tests__/BottomNav.test.tsx` |
| Criar | `src/shared/services/__tests__/api.client.test.ts` |

## Critérios de Aceite
- [ ] `api.client` injeta `Authorization: Bearer <token>` quando token existe no store
- [ ] `api.client` converte erros para `ApiError` tipado
- [ ] `BottomNav` exibido apenas em mobile (oculto em `lg:` e acima)
- [ ] Todos os componentes UI têm testes básicos de renderização
