# TASK-FE-033 — Painel da Organização

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-033 |
| Módulo       | organization |
| Prioridade   | Média |
| Dependências | TASK-FE-028, TASK-FE-030, TASK-FE-032 |
| Status       | Pendente |

## Objetivo
Criar a `OrganizationDashboardPage` — página privada de gestão de uma organização com tabs para Dados, Membros, Pets, Adoções, Achados/Perdidos e Serviços cadastrados em nome da org.

## Contexto
Hoje não existe uma visão centralizada dos recursos de uma organização. O painel agrega tudo em um único lugar, controlado por papel (OWNER/MANAGER/MEMBER).

### Rota
- Path: `/organizacoes/:id/painel`
- Layout: `AppShell` (privada)
- Adicionar em `routes.config.ts` como `PrivateRoute`

## Escopo

### Tabs e conteúdo

| Tab | Visível para | Conteúdo |
|-----|-------------|----------|
| Dados | Todos os membros | Informações da org + foto; botão Editar para OWNER |
| Membros | Apenas OWNER | `OrgMembersPanel` (TASK-FE-032) |
| Pets | Todos os membros | Lista de pets com tutor = esta organização |
| Adoções | Todos os membros | Lista de AdoptionListings da organização |
| Achados/Perdidos | Todos os membros | Lista de LostFoundReports da organização |
| Serviços | Todos os membros | Lista de ServiceListings da organização |

### Componentes principais
- `OrganizationDashboardPage.tsx` — gerencia tab ativa via URL param `?tab=dados`
- `OrgDataTab.tsx` — exibe e permite editar dados da org (para OWNER)
- `OrgResourceTab.tsx` — lista genérica reutilizável para Pets, Adoções, etc.

### Navegação para o painel
- `OrganizationDetailPage` deve ter botão/link "Gerenciar" → `/organizacoes/:id/painel` para membros logados

## Testes
Arquivo: `src/modules/organization/__tests__/OrganizationDashboardPage.test.tsx`

- [ ] Teste: tabs corretas exibidas para OWNER (6 tabs)
- [ ] Teste: tab Membros ausente para MANAGER e MEMBER
- [ ] Teste: tab Dados sem botão Editar para MANAGER
- [ ] Teste: navegação entre tabs funciona
- [ ] Teste: rota privada — visitante redirecionado para login

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/organization/pages/OrganizationDashboardPage.tsx` |
| Criar     | `src/modules/organization/components/OrgDataTab.tsx` |
| Criar     | `src/modules/organization/components/OrgResourceTab.tsx` |
| Modificar | `src/modules/organization/components/OrganizationDetailPage.tsx` |
| Modificar | `src/routes/routes.config.ts` |
| Criar     | `src/modules/organization/__tests__/OrganizationDashboardPage.test.tsx` |

## Critérios de Aceite
- [ ] Rota `/organizacoes/:id/painel` acessível apenas para membros da org logados
- [ ] OWNER vê todas as 6 tabs
- [ ] Tab Membros oculta para MANAGER e MEMBER
- [ ] Tab Dados com botão Editar apenas para OWNER
- [ ] Cada tab carrega os dados corretos da organização
- [ ] Link "Gerenciar" no `OrganizationDetailPage` para membros logados
