# TASK-FE-028 — Sistema de Papéis de Organização: UI e controle de visibilidade

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-028 |
| Módulo       | organization |
| Prioridade   | Alta |
| Dependências | TASK-FE-006 (módulo org), TASK-BE-020 (sistema de papéis) |
| Status       | Pendente |

## Objetivo
Adaptar o frontend para consumir o campo `role` retornado nos endpoints de organização. Controlar a visibilidade de ações (editar, gerenciar membros, excluir) com base no papel do usuário autenticado na organização.

## Contexto
Com a TASK-BE-020, o backend passa a retornar o papel do usuário autenticado em cada resposta de organização. O frontend deve usar esse campo para:
- Ocultar botão "Editar" para MEMBER
- Ocultar aba/seção "Membros" para MANAGER e MEMBER
- Ocultar botão "Excluir" para não-OWNER

## Escopo

### 1. `src/modules/organization/types/index.ts`
Adicionar:
```typescript
export type OrganizationRole = 'OWNER' | 'MANAGER' | 'MEMBER'

export interface OrganizationMember {
  personId: string
  name: string
  role: OrganizationRole
}

// Atualizar Organization para incluir myRole quando listado pelo usuário logado
export interface Organization {
  // ... campos existentes
  myRole?: OrganizationRole  // presente quando o usuário autenticado é membro
}
```

### 2. `src/modules/organization/hooks/useOrganization.ts`
- Adicionar `myRole` lido da resposta do endpoint
- Adicionar helper local `canEdit` = `myRole === 'OWNER'`
- Adicionar helper `canManageMembers` = `myRole === 'OWNER'`
- Adicionar helper `canCreateResources` = `myRole !== undefined` (qualquer membro pode criar)

### 3. `src/modules/organization/components/OrganizationDetailPage.tsx`
- Exibir badge com o papel do usuário logado
- Mostrar botão "Editar" apenas para OWNER
- Mostrar botão "Excluir" apenas para OWNER
- Mostrar link "Gerenciar membros" apenas para OWNER

## Testes
Arquivo: `src/modules/organization/__tests__/OrganizationDetailPage.test.tsx`

- [ ] Teste: OWNER vê botões Editar, Excluir e Gerenciar membros
- [ ] Teste: MANAGER vê apenas recursos, sem Editar/Excluir/Gerenciar membros
- [ ] Teste: MEMBER vê apenas recursos, sem ações administrativas
- [ ] Teste: visitante (myRole undefined) não vê nenhuma ação administrativa
- [ ] Confirmar que os testes falham (red), implementar (green)

## Arquivos a Modificar

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/modules/organization/types/index.ts` |
| Modificar | `src/modules/organization/hooks/useOrganization.ts` |
| Modificar | `src/modules/organization/components/OrganizationDetailPage.tsx` |
| Modificar | `src/modules/organization/__tests__/OrganizationDetailPage.test.tsx` |

## Critérios de Aceite
- [ ] OWNER: vê todos os controles administrativos
- [ ] MANAGER: vê ações operacionais, não vê gerenciar membros nem excluir org
- [ ] MEMBER: não vê controles administrativos
- [ ] Badge de papel exibido para usuário logado membro da org
- [ ] Todos os testes existentes continuam passando
