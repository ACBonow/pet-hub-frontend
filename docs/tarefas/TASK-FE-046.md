# TASK-FE-046 — Editar relatório de achado/perdido

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-046 |
| Módulo       | lost-found |
| Prioridade   | Média |
| Dependências | TASK-BE-032 |
| Status       | Pendente |

## Objetivo
Permitir que o criador edite endereço, descrição e contato de um relatório de achado/perdido após a publicação.

## Contexto
Correções de endereço são críticas em achados/perdidos — um endereço errado impede que o animal seja encontrado. Com o TASK-BE-032, o backend terá `PATCH /lost-found/:id`. Esta task expõe essa funcionalidade no frontend.

## Escopo

### 1. `src/routes/routes.config.ts`
Adicionar `EDIT` ao objeto `LOST_FOUND`:
```typescript
LOST_FOUND: {
  ...
  EDIT: (id: string) => `/achados-perdidos/${id}/editar`,
}
```

### 2. `src/routes/index.tsx`
Registrar rota privada:
```typescript
{ path: ROUTES.LOST_FOUND.EDIT(':id'), element: <S><LostFoundEditPage /></S> },
```

### 3. `src/modules/lost-found/services/lostFound.service.ts`
Adicionar `updateLostFoundReportRequest(id, data)` — `PATCH /api/v1/lost-found/:id`.

### 4. `src/modules/lost-found/hooks/useLostFound.ts`
Adicionar `updateReport(id, data)`.

### 5. `src/modules/lost-found/pages/LostFoundEditPage.tsx` (novo)
- Carrega o relatório pelo `id` dos params
- Reutiliza `LostFoundForm` com `defaultValues` preenchidos
- Ao submeter: chama `updateReport(id, data)`
- Redireciona para `ROUTES.LOST_FOUND.DETAIL(id)` após salvar

### 6. `src/modules/lost-found/pages/LostFoundDetailPage.tsx`
Adicionar botão "Editar" visível somente ao criador (`user.personId === report.reporterId`).

### Campos editáveis (alinhados com BE-032)
- `description`
- `location` (campo legado)
- `addressStreet`, `addressNumber`, `addressNeighborhood`
- `addressCep`, `addressCity`, `addressState`, `addressNotes`
- `contactEmail`, `contactPhone`

**Não editável**: `type`, `status`.

## Testes
Arquivo: `src/modules/lost-found/__tests__/LostFoundEditPage.test.tsx`

- [ ] Carrega dados do relatório no form
- [ ] Submissão chama `updateReport` com o id
- [ ] Redireciona para detalhe após salvar
- [ ] Botão "Editar" aparece no detalhe somente para o criador

## Arquivos

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/routes/routes.config.ts` |
| Modificar | `src/routes/index.tsx` |
| Modificar | `src/modules/lost-found/services/lostFound.service.ts` |
| Modificar | `src/modules/lost-found/hooks/useLostFound.ts` |
| Criar     | `src/modules/lost-found/pages/LostFoundEditPage.tsx` |
| Criar     | `src/modules/lost-found/__tests__/LostFoundEditPage.test.tsx` |
| Modificar | `src/modules/lost-found/pages/LostFoundDetailPage.tsx` |

## Critérios de Aceite
- [ ] `/achados-perdidos/:id/editar` carrega dados atuais
- [ ] Submissão atualiza e redireciona
- [ ] Botão "Editar" visível somente ao criador no detalhe
- [ ] Testes passando
