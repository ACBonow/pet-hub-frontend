# TASK-FE-041 — Atualização de status: Adoção e Achados/Perdidos

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-041 |
| Módulo       | adoption, lost-found, auth |
| Prioridade   | Alta |
| Dependências | TASK-FE-008, TASK-FE-009, TASK-BE-010, TASK-BE-011 |
| Status       | Pendente |

## Objetivo
Expor o `personId` do usuário autenticado no auth store e adicionar UI para o criador de um anúncio de adoção ou relatório de achado/perdido atualizar o status do registro.

## Contexto
O backend já possui:
- `PATCH /api/v1/adoptions/:id/status` — muda status entre `AVAILABLE`, `RESERVED`, `ADOPTED`
- `PATCH /api/v1/lost-found/:id/status` — muda status entre `OPEN`, `RESOLVED`

O frontend exibe o status (badge), mas não oferece nenhuma forma de alterá-lo. Os criadores de anúncios não conseguem gerenciar o ciclo de vida dos seus registros.

## Escopo

### 1. `src/modules/auth/types/index.ts`
Adicionar `personId: string | null` a `AuthUser`.

### 2. `src/modules/auth/services/auth.service.ts`
Atualizar `loginRequest` e `registerRequest` para mapear `person.id` do response do backend para `user.personId`.

### 3. `src/modules/adoption/types/index.ts`
Adicionar `personId: string | null` a `AdoptionListing` (o backend já retorna este campo).

### 4. `src/modules/adoption/services/adoption.service.ts`
Adicionar `updateAdoptionStatusRequest(id, status)`.

### 5. `src/modules/adoption/hooks/useAdoption.ts`
Adicionar `updateAdoptionStatus(id, status)`.

### 6. `src/modules/adoption/pages/AdoptionDetailPage.tsx`
Se `user.personId === listing.personId`, exibir painel "Atualizar status" com botões `Disponível`, `Reservado`, `Adotado`.

### 7. `src/modules/lost-found/services/lostFound.service.ts`
Adicionar `updateLostFoundStatusRequest(id, status)`.

### 8. `src/modules/lost-found/hooks/useLostFound.ts`
Adicionar `updateStatus(id, status)`.

### 9. `src/modules/lost-found/pages/LostFoundDetailPage.tsx`
Se `user.personId === report.reporterId` e status é `OPEN`, exibir botão "Marcar como resolvido".

## Testes
- `useAdoption.test.ts` — `updateAdoptionStatus`: chama service, atualiza estado
- `AdoptionDetailPage.test.tsx` — creator vê botões de status; não-creator não vê; clique chama hook
- `LostFoundDetail.test.tsx` — creator com OPEN vê botão; RESOLVED não vê; não-creator não vê; clique chama hook

## Arquivos

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/modules/auth/types/index.ts` |
| Modificar | `src/modules/auth/services/auth.service.ts` |
| Modificar | `src/modules/adoption/types/index.ts` |
| Modificar | `src/modules/adoption/services/adoption.service.ts` |
| Modificar | `src/modules/adoption/hooks/useAdoption.ts` |
| Modificar | `src/modules/adoption/pages/AdoptionDetailPage.tsx` |
| Modificar | `src/modules/adoption/__tests__/useAdoption.test.ts` |
| Criar     | `src/modules/adoption/__tests__/AdoptionDetailPage.test.tsx` |
| Modificar | `src/modules/lost-found/services/lostFound.service.ts` |
| Modificar | `src/modules/lost-found/hooks/useLostFound.ts` |
| Modificar | `src/modules/lost-found/pages/LostFoundDetailPage.tsx` |
| Modificar | `src/modules/lost-found/__tests__/LostFoundDetail.test.tsx` |

## Critérios de Aceite
- [ ] Criador (personId === user.personId) vê botões de atualização de status
- [ ] Visitante ou não-criador não vê botões
- [ ] Clique no botão chama o endpoint e atualiza o estado local
- [ ] Para lost-found: botão só aparece quando status é OPEN
- [ ] Todos os testes existentes continuam passando
