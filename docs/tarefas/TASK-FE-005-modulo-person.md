# TASK-FE-005 — Módulo Person (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-005 |
| Módulo       | person |
| Prioridade   | Alta |
| Dependências | TASK-FE-004, TASK-BE-007 |
| Status       | Pendente |

## Objetivo
Implementar tela de perfil da pessoa, edição de dados e visualização de informações com CPF formatado.

## Contexto
- CPF exibido formatado (`000.000.000-00`), armazenado/enviado sem formatação.
- Usuário pode editar seus próprios dados, não os de outros.
- CPF não pode ser alterado após cadastro.

## Checklist

### Pré-requisitos
- [ ] TASK-FE-004 concluída (auth)
- [ ] TASK-FE-003 concluída (CpfInput)

### Red — Testes falhando primeiro
- [ ] Criar `src/modules/person/__tests__/PersonProfile.test.tsx`
  - [ ] Teste: exibe nome e CPF formatado do usuário
  - [ ] Teste: campo CPF é somente leitura no modo edição
  - [ ] Teste: salva alterações e exibe sucesso
- [ ] Criar `src/modules/person/__tests__/usePerson.test.ts`
  - [ ] Teste: `getPerson` retorna dados da pessoa
  - [ ] Teste: `updatePerson` chama serviço e atualiza store
- [ ] Confirmar que todos os testes falham

### Green — Implementação mínima
- [ ] Criar `src/modules/person/types/index.ts`
- [ ] Criar `src/modules/person/services/person.service.ts`
- [ ] Criar `src/modules/person/hooks/usePerson.ts`
- [ ] Criar `src/modules/person/components/PersonProfile.tsx`
- [ ] Criar `src/modules/person/pages/ProfilePage.tsx`
- [ ] Adicionar rota `/profile` em `routes.config.ts`
- [ ] Confirmar que todos os testes passam

### Finalização
- [ ] Todos os testes passando
- [ ] CPF exibido formatado na UI
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/person/types/index.ts` |
| Criar     | `src/modules/person/services/person.service.ts` |
| Criar     | `src/modules/person/hooks/usePerson.ts` |
| Criar     | `src/modules/person/components/PersonProfile.tsx` |
| Criar     | `src/modules/person/pages/ProfilePage.tsx` |
| Criar     | `src/modules/person/__tests__/PersonProfile.test.tsx` |
| Criar     | `src/modules/person/__tests__/usePerson.test.ts` |
| Modificar | `src/routes/routes.config.ts` |

## Critérios de Aceite
- [ ] CPF exibido formatado, enviado sem formatação
- [ ] Campo CPF somente leitura após cadastro
- [ ] Rota `/profile` protegida por autenticação
