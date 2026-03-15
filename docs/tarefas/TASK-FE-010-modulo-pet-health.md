# TASK-FE-010 — Módulo Pet Health (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-010 |
| Módulo       | pet-health |
| Prioridade   | Média |
| Dependências | TASK-FE-007, TASK-BE-012 |
| Status       | Pendente |

## Objetivo
Implementar carteirinha de vacinação digital, visualização e upload de arquivos de exames, com acesso restrito a tutores do pet.

## Contexto
- Carteirinha de vacinação: lista de vacinas com data de aplicação e próxima dose.
- Próxima dose futura destacada visualmente (alerta se próxima dose < 30 dias).
- Arquivos de exame: listagem com data, tipo e opção de download/visualização.
- Upload de exame: campo de arquivo, tipo e data.
- Acesso apenas para tutores (primário e co-tutores) do pet.

## Checklist

### Pré-requisitos
- [ ] TASK-FE-007 concluída (pet)

### Red — Testes falhando primeiro
- [ ] Criar `src/modules/pet-health/__tests__/VaccinationCard.test.tsx`
  - [ ] Teste: lista vacinas em ordem cronológica
  - [ ] Teste: destaca visualmente vacinas com próxima dose nos próximos 30 dias
  - [ ] Teste: exibe mensagem de lista vazia quando não há vacinas
- [ ] Criar `src/modules/pet-health/__tests__/ExamFileList.test.tsx`
  - [ ] Teste: lista arquivos de exame com nome e data
  - [ ] Teste: botão de upload abre seletor de arquivo
- [ ] Confirmar que todos os testes falham

### Green — Implementação mínima
- [ ] Criar `src/modules/pet-health/types/index.ts`
- [ ] Criar `src/modules/pet-health/services/petHealth.service.ts`
- [ ] Criar `src/modules/pet-health/hooks/usePetHealth.ts`
- [ ] Criar `src/modules/pet-health/components/VaccinationCard.tsx`
- [ ] Criar `src/modules/pet-health/components/VaccinationForm.tsx`
- [ ] Criar `src/modules/pet-health/components/ExamFileList.tsx`
- [ ] Criar `src/modules/pet-health/components/ExamUploadForm.tsx`
- [ ] Criar `src/modules/pet-health/pages/PetHealthPage.tsx` (tab vacinas + tab exames)
- [ ] Adicionar rota `/pets/:id/health` em `routes.config.ts`
- [ ] Confirmar que todos os testes passam

### Finalização
- [ ] Todos os testes passando
- [ ] Upload de arquivo funcional no browser
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/pet-health/types/index.ts` |
| Criar     | `src/modules/pet-health/services/petHealth.service.ts` |
| Criar     | `src/modules/pet-health/hooks/usePetHealth.ts` |
| Criar     | `src/modules/pet-health/components/VaccinationCard.tsx` |
| Criar     | `src/modules/pet-health/components/VaccinationForm.tsx` |
| Criar     | `src/modules/pet-health/components/ExamFileList.tsx` |
| Criar     | `src/modules/pet-health/components/ExamUploadForm.tsx` |
| Criar     | `src/modules/pet-health/pages/PetHealthPage.tsx` |
| Criar     | `src/modules/pet-health/__tests__/VaccinationCard.test.tsx` |
| Criar     | `src/modules/pet-health/__tests__/ExamFileList.test.tsx` |
| Modificar | `src/routes/routes.config.ts` |

## Critérios de Aceite
- [ ] Vacinas listadas em ordem cronológica decrescente
- [ ] Alerta visual para próxima dose nos próximos 30 dias
- [ ] Upload de arquivo de exame funcional (PDF, imagens)
- [ ] Acesso restrito a tutores do pet
