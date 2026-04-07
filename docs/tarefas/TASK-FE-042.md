# TASK-FE-042 — Editar anúncio de serviço

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-042 |
| Módulo       | services-directory |
| Prioridade   | Alta |
| Dependências | TASK-FE-020 (ServiceForm/ServiceFormPage existentes) |
| Status       | Pendente |

## Objetivo
Expor a edição de anúncios de serviço no frontend. O backend já tem `PATCH /api/v1/services-directory/:id` e o hook já tem `updateService`. Falta apenas a rota e a página.

## Contexto
É o único módulo com endpoint de edição no backend sem UI correspondente. O criador de um serviço não consegue corrigir informações após publicar.

## O que já existe
- Backend: `PATCH /api/v1/services-directory/:id` ✓
- Frontend service: `updateServiceRequest` em `servicesDirectory.service.ts` ✓
- Frontend hook: `updateService` em `useServicesDirectory.ts` ✓
- Frontend form: `ServiceForm.tsx` (suporta modo edição via `defaultValues`) ✓

## O que falta

### 1. `src/routes/routes.config.ts`
Adicionar `EDIT` ao objeto `SERVICES`:
```typescript
SERVICES: {
  ...
  EDIT: (id: string) => `/servicos/${id}/editar`,
}
```

### 2. `src/routes/index.tsx`
Registrar a rota privada:
```typescript
{ path: ROUTES.SERVICES.EDIT(':id'), element: <S><ServiceFormPage /></S> },
```

### 3. `src/modules/services-directory/pages/ServiceFormPage.tsx`
Adaptar para modo edição quando `id` estiver presente nos params:
- Se `:id` presente: buscar serviço com `getService(id)`, popular `ServiceForm` com os dados
- Ao submeter: chamar `updateService(id, data)` em vez de `createService(data)`
- Após salvar: redirecionar para `ROUTES.SERVICES.DETAIL(id)`

### 4. `src/modules/services-directory/pages/ServiceDetailPage.tsx`
Adicionar botão "Editar" visível somente ao criador:
- Criador pessoal: `service.createdByUserId === user.id`
- Criador via org: `service.organizationId` + verificar `myRole` (OWNER/MANAGER) via `useActingAs` ou `myOrgRole`

## Testes
Arquivo: `src/modules/services-directory/__tests__/ServiceFormPage.test.tsx`

- [ ] No modo edição (`id` presente), carrega os dados do serviço no form
- [ ] Submissão chama `updateService` com o id correto
- [ ] Redireciona para a página de detalhe após salvar
- [ ] Botão "Editar" aparece no detalhe somente para o criador

## Arquivos

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/routes/routes.config.ts` |
| Modificar | `src/routes/index.tsx` |
| Modificar | `src/modules/services-directory/pages/ServiceFormPage.tsx` |
| Modificar | `src/modules/services-directory/pages/ServiceDetailPage.tsx` |
| Modificar | `src/modules/services-directory/__tests__/ServiceFormPage.test.tsx` |

## Critérios de Aceite
- [ ] `/servicos/:id/editar` carrega dados atuais do serviço
- [ ] Submissão atualiza o serviço e redireciona para o detalhe
- [ ] Botão "Editar" visível somente ao criador no `ServiceDetailPage`
- [ ] Testes passando
