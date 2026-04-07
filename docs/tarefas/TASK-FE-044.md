# TASK-FE-044 — Controles de paginação nas listagens

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-044 |
| Módulo       | adoption, lost-found, services-directory |
| Prioridade   | Média |
| Dependências | Nenhuma (backend já pagina) |
| Status       | Pendente |

## Objetivo
Exibir controles de paginação ("Anterior" / "Próxima" / indicador de página) nas listagens de adoção, achados/perdidos e serviços. O backend já suporta `page` e `pageSize` — falta consumir na UI.

## Contexto
As listagens atualmente carregam somente a primeira página (padrão do backend). Com volume crescente de anúncios, dados além da primeira página ficam inacessíveis.

## Escopo

### 1. `src/shared/components/ui/Pagination.tsx` (novo)
Componente compartilhado que recebe:
```typescript
interface PaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}
```
- Botão "Anterior" desabilitado na primeira página
- Botão "Próxima" desabilitado na última página
- Texto "Página X de Y"

### 2. Tipos — adicionar `page`/`pageSize` nos filtros frontend

Adicionar em cada módulo:
```typescript
// adoption/types/index.ts
export interface AdoptionFilters {
  ...
  page?: number
  pageSize?: number
}

// lost-found/types/index.ts — idem
// services-directory/types/index.ts — idem
```

### 3. Services — passar `page`/`pageSize` para a API

Cada `listXxxRequest` já recebe `filters` — só precisa incluir `page` e `pageSize` se presentes.

### 4. Hooks — gerenciar estado de paginação

Cada hook de listagem recebe de volta `meta: { page, pageSize, total, totalPages }`. Expor estado local de `page` atual e total de páginas.

Exemplo para `useAdoption`:
```typescript
// Expor também:
currentPage: number
totalPages: number
goToPage: (page: number) => void
```

### 5. Páginas de listagem

Em `AdoptionListPage`, `LostFoundListPage`, `ServicesListPage`: exibir `<Pagination />` abaixo da lista quando `totalPages > 1`.

### pageSize padrão: `12`

## Testes
- [ ] Componente `Pagination`: botões desabilitados corretamente, exibe contagem
- [ ] Hook: `goToPage` recarrega com o novo `page`
- [ ] Lista: exibe `Pagination` quando há mais de uma página

## Arquivos

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/shared/components/ui/Pagination.tsx` |
| Criar     | `src/shared/components/ui/__tests__/Pagination.test.tsx` |
| Modificar | `src/modules/adoption/types/index.ts` |
| Modificar | `src/modules/adoption/hooks/useAdoption.ts` |
| Modificar | `src/modules/adoption/pages/AdoptionListPage.tsx` |
| Modificar | `src/modules/lost-found/types/index.ts` |
| Modificar | `src/modules/lost-found/hooks/useLostFound.ts` |
| Modificar | `src/modules/lost-found/pages/LostFoundListPage.tsx` |
| Modificar | `src/modules/services-directory/types/index.ts` |
| Modificar | `src/modules/services-directory/hooks/useServicesDirectory.ts` |
| Modificar | `src/modules/services-directory/pages/ServicesListPage.tsx` |

## Critérios de Aceite
- [ ] Navegação entre páginas funciona nas 3 listagens
- [ ] Filtros + paginação coexistem (mudar filtro reseta para página 1)
- [ ] Paginação oculta quando `totalPages <= 1`
- [ ] Testes do componente e hooks passando
