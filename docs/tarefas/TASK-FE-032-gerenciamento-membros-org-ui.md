# TASK-FE-032 — Gerenciamento de Membros da Organização: UI

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-032 |
| Módulo       | organization |
| Prioridade   | Alta |
| Dependências | TASK-FE-028 (roles UI), TASK-BE-024 (endpoints de membros) |
| Status       | Pendente |

## Objetivo
Implementar a interface de gerenciamento de membros da organização: listagem, adição por CPF, alteração de papel e remoção. Visível apenas para OWNER.

## Escopo

### 1. `src/modules/organization/services/organization.service.ts`
Adicionar funções:
```typescript
listOrgMembers(orgId: string): Promise<OrganizationMember[]>
addOrgMember(orgId: string, cpf: string, role: OrganizationRole): Promise<OrganizationMember>
updateOrgMemberRole(orgId: string, personId: string, role: OrganizationRole): Promise<OrganizationMember>
removeOrgMember(orgId: string, personId: string): Promise<void>
```

### 2. `src/modules/organization/hooks/useOrgMembers.ts`
Hook que combina estado e service:
```typescript
export function useOrgMembers(orgId: string) {
  // members, loading, error
  // addMember(cpf, role)
  // updateRole(personId, role)
  // removeMember(personId)
}
```

### 3. `src/modules/organization/components/OrgMembersPanel.tsx`
Componente com:
- Lista de membros: avatar inicial + nome + badge de papel + ações (alterar papel / remover)
- Formulário de adição: `CpfInput` + select de papel + botão "Adicionar"
- Confirmação antes de remover
- Mensagem de erro inline quando CPF não encontrado ou já membro

### 4. Integrar no `OrganizationDetailPage.tsx`
- Mostrar `<OrgMembersPanel />` como seção ou tab, visível apenas para OWNER

## Testes
Arquivo: `src/modules/organization/__tests__/OrgMembersPanel.test.tsx`

- [ ] Teste: lista de membros exibida corretamente
- [ ] Teste: adicionar membro com CPF válido → aparece na lista
- [ ] Teste: CPF não encontrado → mensagem de erro inline
- [ ] Teste: CPF já membro → mensagem de erro inline
- [ ] Teste: alterar papel exibe novo badge
- [ ] Teste: remover membro remove da lista
- [ ] Teste: tentativa de remover último OWNER → mensagem de erro
- [ ] Teste: painel não visível para MANAGER ou MEMBER

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/modules/organization/services/organization.service.ts` |
| Criar     | `src/modules/organization/hooks/useOrgMembers.ts` |
| Criar     | `src/modules/organization/components/OrgMembersPanel.tsx` |
| Modificar | `src/modules/organization/components/OrganizationDetailPage.tsx` |
| Criar     | `src/modules/organization/__tests__/OrgMembersPanel.test.tsx` |
| Modificar | `src/modules/organization/types/index.ts` |

## Critérios de Aceite
- [ ] OWNER vê painel de membros com lista e formulário de adição
- [ ] Adicionar por CPF funciona — membro aparece na lista imediatamente
- [ ] CPF inexistente exibe erro "Pessoa não encontrada"
- [ ] CPF já membro exibe erro "Já é membro desta organização"
- [ ] Remover último OWNER exibe erro "Não é possível remover o único administrador"
- [ ] MANAGER e MEMBER não veem o painel
- [ ] Todos os testes existentes continuam passando
