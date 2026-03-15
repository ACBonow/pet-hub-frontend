# TASK-FE-007 — Módulo Pet (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-007 |
| Módulo       | pet |
| Prioridade   | Alta |
| Dependências | TASK-FE-006, TASK-BE-009 |
| Status       | Pendente |

## Objetivo
Implementar telas de gerenciamento de pets: cadastro, perfil do pet, transferência de tutoria, co-tutores e histórico de tutoria.

## Contexto
- Foto do pet: upload via formulário, enviada ao backend que armazena no Supabase Storage.
- Tutoria primária: exibir tutor atual e tipo (dono/tutor/lar temporário).
- Transferência de tutoria: fluxo com confirmação antes de executar.
- Histórico de tutoria: timeline visual ordenada por data.
- Co-tutores: lista com opção de adicionar/remover.

## Checklist

### Pré-requisitos
- [ ] TASK-FE-006 concluída (organization, para vincular pet a org)
- [ ] Backend TASK-BE-009 concluída

### Red — Testes falhando primeiro
- [ ] Criar `src/modules/pet/__tests__/PetForm.test.tsx`
  - [ ] Teste: exibe campos nome, espécie, raça, data nascimento
  - [ ] Teste: campo tutor primário obrigatório
  - [ ] Teste: submete dados do pet com sucesso
- [ ] Criar `src/modules/pet/__tests__/TutorshipTransfer.test.tsx`
  - [ ] Teste: exibe modal de confirmação antes de transferir
  - [ ] Teste: cancela transferência sem chamar serviço
  - [ ] Teste: confirma e chama serviço de transferência
- [ ] Criar `src/modules/pet/__tests__/usePet.test.ts`
- [ ] Confirmar que todos os testes falham

### Green — Implementação mínima
- [ ] Criar `src/modules/pet/types/index.ts`
- [ ] Criar `src/modules/pet/services/pet.service.ts`
- [ ] Criar `src/modules/pet/hooks/usePet.ts`
- [ ] Criar `src/modules/pet/components/PetForm.tsx`
- [ ] Criar `src/modules/pet/components/PetCard.tsx`
- [ ] Criar `src/modules/pet/components/TutorshipInfo.tsx`
- [ ] Criar `src/modules/pet/components/TutorshipTransfer.tsx` (com modal de confirmação)
- [ ] Criar `src/modules/pet/components/CoTutorsList.tsx`
- [ ] Criar `src/modules/pet/components/TutorshipHistory.tsx` (timeline)
- [ ] Criar páginas: `PetListPage`, `PetDetailPage`, `PetFormPage`
- [ ] Adicionar rotas em `routes.config.ts`
- [ ] Confirmar que todos os testes passam

### Finalização
- [ ] Todos os testes passando
- [ ] Transferência de tutoria com confirmação funcional
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/pet/types/index.ts` |
| Criar     | `src/modules/pet/services/pet.service.ts` |
| Criar     | `src/modules/pet/hooks/usePet.ts` |
| Criar     | `src/modules/pet/components/PetForm.tsx` |
| Criar     | `src/modules/pet/components/PetCard.tsx` |
| Criar     | `src/modules/pet/components/TutorshipInfo.tsx` |
| Criar     | `src/modules/pet/components/TutorshipTransfer.tsx` |
| Criar     | `src/modules/pet/components/CoTutorsList.tsx` |
| Criar     | `src/modules/pet/components/TutorshipHistory.tsx` |
| Criar     | `src/modules/pet/pages/PetListPage.tsx` |
| Criar     | `src/modules/pet/pages/PetDetailPage.tsx` |
| Criar     | `src/modules/pet/pages/PetFormPage.tsx` |
| Criar     | `src/modules/pet/__tests__/PetForm.test.tsx` |
| Criar     | `src/modules/pet/__tests__/TutorshipTransfer.test.tsx` |
| Criar     | `src/modules/pet/__tests__/usePet.test.ts` |
| Modificar | `src/routes/routes.config.ts` |

## Critérios de Aceite
- [ ] Cadastro de pet com tutor primário obrigatório
- [ ] Transferência de tutoria exige confirmação do usuário
- [ ] Histórico de tutoria exibido em ordem cronológica
- [ ] Co-tutores gerenciados sem afetar tutoria primária
