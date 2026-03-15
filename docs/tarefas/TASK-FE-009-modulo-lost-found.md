# TASK-FE-009 — Módulo Lost & Found (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-009 |
| Módulo       | lost-found |
| Prioridade   | Média |
| Dependências | TASK-FE-004, TASK-BE-011 |
| Status       | Pendente |

## Objetivo
Implementar listagem e criação de relatórios de animais perdidos e achados, com filtros e informações de contato.

## Contexto
- Listagem pública — sem login para leitura.
- Criação requer autenticação.
- Tipo visual distinto para `LOST` (perdido) vs `FOUND` (achado) — cores e ícones diferentes.
- Formulário: tipo, descrição, localização, informações de contato, foto opcional.
- Status `RESOLVED` indica que o caso foi resolvido.

## Checklist

### Pré-requisitos
- [ ] TASK-FE-004 concluída (auth)

### Red — Testes falhando primeiro
- [ ] Criar `src/modules/lost-found/__tests__/LostFoundList.test.tsx`
  - [ ] Teste: renderiza relatórios com badge PERDIDO/ACHADO
  - [ ] Teste: filtro por tipo funciona
- [ ] Criar `src/modules/lost-found/__tests__/LostFoundForm.test.tsx`
  - [ ] Teste: exibe campos obrigatórios de contato
  - [ ] Teste: submete relatório com tipo `LOST`
- [ ] Confirmar que todos os testes falham

### Green — Implementação mínima
- [ ] Criar arquivos do módulo (types, services, hooks, components, pages)
- [ ] Adicionar rotas em `routes.config.ts`
- [ ] Confirmar que todos os testes passam

### Finalização
- [ ] Todos os testes passando
- [ ] Distinção visual clara entre PERDIDO e ACHADO
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/lost-found/types/index.ts` |
| Criar     | `src/modules/lost-found/services/lostFound.service.ts` |
| Criar     | `src/modules/lost-found/hooks/useLostFound.ts` |
| Criar     | `src/modules/lost-found/components/LostFoundCard.tsx` |
| Criar     | `src/modules/lost-found/components/LostFoundForm.tsx` |
| Criar     | `src/modules/lost-found/components/LostFoundFilters.tsx` |
| Criar     | `src/modules/lost-found/pages/LostFoundListPage.tsx` |
| Criar     | `src/modules/lost-found/pages/LostFoundDetailPage.tsx` |
| Criar     | `src/modules/lost-found/pages/LostFoundFormPage.tsx` |
| Criar     | `src/modules/lost-found/__tests__/LostFoundList.test.tsx` |
| Criar     | `src/modules/lost-found/__tests__/LostFoundForm.test.tsx` |
| Modificar | `src/routes/routes.config.ts` |

## Critérios de Aceite
- [ ] Badge visual distinto para PERDIDO e ACHADO
- [ ] Listagem pública sem autenticação
- [ ] Criação requer autenticação
- [ ] Relatório `RESOLVED` aparece com estilo diferenciado
