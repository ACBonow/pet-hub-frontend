# TASK-FE-006 — Módulo Organization (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-006 |
| Módulo       | organization |
| Prioridade   | Alta |
| Dependências | TASK-FE-005, TASK-BE-008 |
| Status       | Pendente |

## Objetivo
Implementar telas de criação, visualização e gerenciamento de organizações (empresas e ONGs), incluindo gestão de pessoas responsáveis.

## Contexto
- Formulário de criação distingue entre `COMPANY` (CNPJ obrigatório) e `NGO` (CNPJ opcional).
- Ao selecionar `COMPANY`, campo CNPJ aparece como obrigatório; ao selecionar `NGO`, aparece como opcional.
- Pelo menos uma pessoa responsável deve ser vinculada na criação.
- CNPJ exibido formatado (`00.000.000/0000-00`).

## Checklist

### Pré-requisitos
- [ ] TASK-FE-005 concluída (person)
- [ ] TASK-FE-003 concluída (CnpjInput)

### Red — Testes falhando primeiro
- [ ] Criar `src/modules/organization/__tests__/OrganizationForm.test.tsx`
  - [ ] Teste: campo CNPJ obrigatório ao selecionar `COMPANY`
  - [ ] Teste: campo CNPJ opcional ao selecionar `NGO`
  - [ ] Teste: exibe erro inline para CNPJ inválido
  - [ ] Teste: submete com dados válidos
- [ ] Criar `src/modules/organization/__tests__/useOrganization.test.ts`
- [ ] Confirmar que todos os testes falham

### Green — Implementação mínima
- [ ] Criar `src/modules/organization/types/index.ts`
- [ ] Criar `src/modules/organization/services/organization.service.ts`
- [ ] Criar `src/modules/organization/hooks/useOrganization.ts`
- [ ] Criar `src/modules/organization/components/OrganizationForm.tsx`
- [ ] Criar `src/modules/organization/components/OrganizationCard.tsx`
- [ ] Criar `src/modules/organization/components/ResponsiblePersonsManager.tsx`
- [ ] Criar `src/modules/organization/pages/OrganizationListPage.tsx`
- [ ] Criar `src/modules/organization/pages/OrganizationDetailPage.tsx`
- [ ] Criar `src/modules/organization/pages/OrganizationFormPage.tsx`
- [ ] Adicionar rotas em `routes.config.ts`
- [ ] Confirmar que todos os testes passam

### Finalização
- [ ] Todos os testes passando
- [ ] CNPJ exibido formatado na UI
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/organization/types/index.ts` |
| Criar     | `src/modules/organization/services/organization.service.ts` |
| Criar     | `src/modules/organization/hooks/useOrganization.ts` |
| Criar     | `src/modules/organization/components/OrganizationForm.tsx` |
| Criar     | `src/modules/organization/components/OrganizationCard.tsx` |
| Criar     | `src/modules/organization/components/ResponsiblePersonsManager.tsx` |
| Criar     | `src/modules/organization/pages/OrganizationListPage.tsx` |
| Criar     | `src/modules/organization/pages/OrganizationDetailPage.tsx` |
| Criar     | `src/modules/organization/pages/OrganizationFormPage.tsx` |
| Criar     | `src/modules/organization/__tests__/OrganizationForm.test.tsx` |
| Criar     | `src/modules/organization/__tests__/useOrganization.test.ts` |
| Modificar | `src/routes/routes.config.ts` |

## Critérios de Aceite
- [ ] CNPJ obrigatório para Company, opcional para NGO
- [ ] CNPJ exibido formatado, enviado sem formatação
- [ ] Gestão de pessoas responsáveis funcional
