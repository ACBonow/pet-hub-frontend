# TASK-FE-045 — Editar anúncio de adoção

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-045 |
| Módulo       | adoption |
| Prioridade   | Média |
| Dependências | TASK-FE-041, TASK-BE-031 |
| Status       | Pendente |

## Objetivo
Permitir que o criador edite a descrição e informações de contato de um anúncio de adoção após a publicação.

## Contexto
O `AdoptionDetailPage` exibe o anúncio mas não tem link de edição. Com o TASK-BE-031, o backend terá `PATCH /adoptions/:id`. Esta task expõe essa funcionalidade no frontend.

## Escopo

### 1. `src/routes/routes.config.ts`
Adicionar `EDIT` ao objeto `ADOPTION`:
```typescript
ADOPTION: {
  ...
  EDIT: (id: string) => `/adocao/${id}/editar`,
}
```

### 2. `src/routes/index.tsx`
Registrar rota privada:
```typescript
{ path: ROUTES.ADOPTION.EDIT(':id'), element: <S><AdoptionEditPage /></S> },
```

### 3. `src/modules/adoption/services/adoption.service.ts`
Já existe `updateAdoptionRequest` (PUT) — confirmar se continua ou adaptar para PATCH.

### 4. `src/modules/adoption/pages/AdoptionEditPage.tsx` (novo)
- Carrega o anúncio pelo `id` dos params
- Reutiliza `AdoptionForm` com `defaultValues` preenchidos
- Ao submeter: chama `updateAdoption(id, data)`
- Redireciona para `ROUTES.ADOPTION.DETAIL(id)` após salvar

### 5. `src/modules/adoption/pages/AdoptionDetailPage.tsx`
Adicionar botão "Editar" visível somente ao criador (`user.personId === listing.personId`).

### Campos editáveis (alinhados com BE-031)
- `description`
- `contactEmail`, `contactPhone`, `contactWhatsapp`

**Não editável no form de edição**: `petId`, `status` (já gerenciado pelo painel de status).

## Testes
Arquivo: `src/modules/adoption/__tests__/AdoptionEditPage.test.tsx`

- [ ] Carrega dados do anúncio no form
- [ ] Submissão chama `updateAdoption` com o id
- [ ] Redireciona para detalhe após salvar
- [ ] Botão "Editar" aparece no detalhe somente para o criador

## Arquivos

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/routes/routes.config.ts` |
| Modificar | `src/routes/index.tsx` |
| Criar     | `src/modules/adoption/pages/AdoptionEditPage.tsx` |
| Criar     | `src/modules/adoption/__tests__/AdoptionEditPage.test.tsx` |
| Modificar | `src/modules/adoption/pages/AdoptionDetailPage.tsx` |

## Critérios de Aceite
- [ ] `/adocao/:id/editar` carrega dados atuais
- [ ] Submissão atualiza e redireciona
- [ ] Botão "Editar" visível somente ao criador no detalhe
- [ ] Testes passando
