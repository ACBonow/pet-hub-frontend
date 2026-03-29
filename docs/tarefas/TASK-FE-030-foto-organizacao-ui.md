# TASK-FE-030 — Foto de Organização: exibição e upload

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-030 |
| Módulo       | organization |
| Prioridade   | Média |
| Dependências | TASK-FE-028 (roles UI), TASK-BE-022 (endpoint de upload) |
| Status       | Pendente |

## Objetivo
Exibir a foto/logo da organização no `OrganizationDetailPage` e nos cards. Adicionar input de upload no formulário de organização acessível a OWNER e MANAGER.

## Contexto
O padrão de upload de foto já existe para pets (TASK-FE-023). Seguir o mesmo padrão: preview local antes de enviar, upload em etapa separada após salvar os dados principais.

## Escopo

### 1. `src/modules/organization/components/OrganizationCard.tsx`
- Adicionar avatar/logo: se `photoUrl` presente, exibir imagem circular; senão, placeholder com inicial do nome.

### 2. `src/modules/organization/components/OrganizationDetailPage.tsx`
- Exibir foto grande no topo da página.
- Para OWNER/MANAGER logado: exibir botão "Alterar foto" que abre input file.

### 3. `src/modules/organization/components/OrganizationForm.tsx`
- Adicionar campo de upload de foto (opcional).
- Exibir preview da imagem selecionada antes de enviar.
- Upload é feito via `PATCH /api/v1/organizations/:id/photo` **após** criar/atualizar a organização.

### 4. `src/modules/organization/services/organization.service.ts`
Adicionar função:
```typescript
uploadOrgPhoto(orgId: string, file: File): Promise<{ photoUrl: string }>
```
Chama `PATCH /api/v1/organizations/:id/photo` com `FormData`.

## Testes
Arquivo: `src/modules/organization/__tests__/OrganizationForm.test.tsx`

- [ ] Teste: input de foto presente no formulário
- [ ] Teste: seleção de arquivo exibe preview
- [ ] Teste: OWNER vê botão "Alterar foto" no detalhe da org
- [ ] Teste: MEMBER não vê botão "Alterar foto"
- [ ] Teste: `uploadOrgPhoto` chamado após salvar dados da org quando arquivo selecionado

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/modules/organization/components/OrganizationCard.tsx` |
| Modificar | `src/modules/organization/components/OrganizationDetailPage.tsx` |
| Modificar | `src/modules/organization/components/OrganizationForm.tsx` |
| Modificar | `src/modules/organization/services/organization.service.ts` |
| Modificar | `src/modules/organization/__tests__/OrganizationForm.test.tsx` |

## Critérios de Aceite
- [ ] Org com foto exibe a imagem no card e no detalhe
- [ ] Org sem foto exibe placeholder com inicial
- [ ] OWNER/MANAGER pode fazer upload de foto
- [ ] Preview exibido antes do upload
- [ ] Upload chama endpoint correto com FormData
- [ ] Todos os testes existentes continuam passando
