# TASK-FE-008 — Módulo Adoption (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-008 |
| Módulo       | adoption |
| Prioridade   | Média |
| Dependências | TASK-FE-007, TASK-BE-010 |
| Status       | Pendente |

## Objetivo
Implementar listagem pública de pets para adoção com filtros, e telas de gerenciamento para usuários autenticados.

## Contexto
- Listagem é pública — acessível sem login.
- Filtros: espécie, porte, status, organização.
- Cards de pet para adoção: foto, nome, espécie, breve descrição, contato.
- Usuário autenticado pode criar e gerenciar suas listagens.
- Layout: grade de cards no mobile (1 coluna), 2 colunas no `sm:`, 3 no `lg:`.

## Checklist

### Pré-requisitos
- [ ] TASK-FE-007 concluída (pet)

### Red — Testes falhando primeiro
- [ ] Criar `src/modules/adoption/__tests__/AdoptionList.test.tsx`
  - [ ] Teste: renderiza lista de cards de adoção
  - [ ] Teste: filtro por espécie atualiza listagem
  - [ ] Teste: acessível sem autenticação
- [ ] Criar `src/modules/adoption/__tests__/useAdoption.test.ts`
- [ ] Confirmar que todos os testes falham

### Green — Implementação mínima
- [ ] Criar `src/modules/adoption/types/index.ts`
- [ ] Criar `src/modules/adoption/services/adoption.service.ts`
- [ ] Criar `src/modules/adoption/hooks/useAdoption.ts`
- [ ] Criar `src/modules/adoption/components/AdoptionCard.tsx`
- [ ] Criar `src/modules/adoption/components/AdoptionFilters.tsx`
- [ ] Criar `src/modules/adoption/components/AdoptionForm.tsx`
- [ ] Criar páginas: `AdoptionListPage`, `AdoptionDetailPage`, `AdoptionFormPage`
- [ ] Adicionar rotas públicas em `routes.config.ts`
- [ ] Confirmar que todos os testes passam

### Finalização
- [ ] Todos os testes passando
- [ ] Listagem acessível sem login no browser
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/adoption/types/index.ts` |
| Criar     | `src/modules/adoption/services/adoption.service.ts` |
| Criar     | `src/modules/adoption/hooks/useAdoption.ts` |
| Criar     | `src/modules/adoption/components/AdoptionCard.tsx` |
| Criar     | `src/modules/adoption/components/AdoptionFilters.tsx` |
| Criar     | `src/modules/adoption/components/AdoptionForm.tsx` |
| Criar     | `src/modules/adoption/pages/AdoptionListPage.tsx` |
| Criar     | `src/modules/adoption/pages/AdoptionDetailPage.tsx` |
| Criar     | `src/modules/adoption/pages/AdoptionFormPage.tsx` |
| Criar     | `src/modules/adoption/__tests__/AdoptionList.test.tsx` |
| Criar     | `src/modules/adoption/__tests__/useAdoption.test.ts` |
| Modificar | `src/routes/routes.config.ts` |

## Critérios de Aceite
- [ ] Listagem acessível sem autenticação
- [ ] Filtros funcionais (espécie, status)
- [ ] Paginação com `usePagination` hook
- [ ] Cards com `loading="lazy"` nas imagens
