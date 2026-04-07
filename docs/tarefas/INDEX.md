# PetHUB Frontend — Índice de Tarefas de Desenvolvimento

## Legenda de Status
- `Pendente` — não iniciada
- `Em andamento` — em desenvolvimento
- `Concluída` — implementada, testes passando, PR merged

## Ordem de Execução

```
TASK-FE-001 → TASK-FE-002 → TASK-FE-003
                                       ↓
                              TASK-FE-004 (auth)
                                       ↓
                              TASK-FE-005 (person)
                                       ↓
                              TASK-FE-006 (organization)
                                       ↓
                              TASK-FE-007 (pet)
                              ↙        ↓         ↘
               TASK-FE-008  TASK-FE-009  TASK-FE-010
               (adoption)  (lost-found) (pet-health)
                                       ↓
                              TASK-FE-011 (services-directory)
                                       ↓
                              TASK-FE-017 (auth service layer)
                              ↙                  ↘
               TASK-FE-018 (email verification)  TASK-FE-019 (password recovery)
                    ↓              ↓
         TASK-FE-026           TASK-FE-027         TASK-FE-028 (roles org)
      (ContactGate LF)    (ContactGate Services)         ↓
                                                  TASK-FE-029 (agindo como)
                                                  ↙        ↓        ↘
                                          FE-030       FE-032      FE-034
                                        (foto org) (membros org) (indicador)
                                          FE-031       FE-033
                                        (foto svc)  (painel org)
```

## Tabela de Tarefas

| ID           | Tarefa                                      | Prioridade | Dependências             | Status    |
|--------------|---------------------------------------------|------------|--------------------------|-----------|
| TASK-FE-001  | Inicialização do Projeto                    | Alta       | Nenhuma                  | Concluída |
| TASK-FE-002  | Shared Layer (API Client, Layout)           | Alta       | FE-001                   | Concluída |
| TASK-FE-003  | Validators CPF e CNPJ                       | Alta       | FE-001                   | Concluída |
| TASK-FE-004  | Módulo Auth                                 | Alta       | FE-002, FE-003, BE-006   | Concluída |
| TASK-FE-005  | Módulo Person                               | Alta       | FE-004, BE-007            | Concluída |
| TASK-FE-006  | Módulo Organization                         | Alta       | FE-005, BE-008            | Concluída |
| TASK-FE-007  | Módulo Pet                                  | Alta       | FE-006, BE-009            | Concluída |
| TASK-FE-008  | Módulo Adoption                             | Média      | FE-007, BE-010            | Concluída |
| TASK-FE-009  | Módulo Lost & Found                         | Média      | FE-004, BE-011            | Concluída |
| TASK-FE-010  | Módulo Pet Health                           | Média      | FE-007, BE-012            | Concluída |
| TASK-FE-011  | Módulo Services Directory                   | Baixa      | FE-002, BE-013            | Concluída |
| TASK-FE-012  | TopNav                                      | Alta       | FE-002                    | Concluída |
| TASK-FE-013  | BottomNav auth-aware                        | Alta       | FE-004                    | Concluída |
| TASK-FE-014  | LandingPage                                 | Alta       | FE-002                    | Concluída |
| TASK-FE-015  | ContactGate + LoginForm returnTo            | Alta       | FE-004                    | Concluída |
| TASK-FE-016  | Rotas completas                             | Alta       | FE-002                    | Concluída |
| TASK-FE-017  | Auth Service: verify email + reset password | Alta       | FE-016, BE-014            | Concluída |
| TASK-FE-018  | Fluxo de verificação de email               | Alta       | FE-017                    | Concluída |
| TASK-FE-019  | Fluxo de recuperação de senha               | Alta       | FE-017, FE-018            | Concluída |
| TASK-FE-020  | Módulo Services Directory UI completo       | Média      | FE-011                    | Concluída |
| TASK-FE-021  | Auth pages com logo + showBack              | Baixa      | FE-016                    | Concluída |
| TASK-FE-022  | PetForm sem primaryTutorId + TutorTransfer  | Alta       | FE-007                    | Concluída |
| TASK-FE-023  | Pet: upload de foto                         | Média      | FE-007, BE-016            | Concluída |
| TASK-FE-024  | AdoptionForm: WhatsApp + org picker         | Média      | FE-008, BE-017            | Concluída |
| TASK-FE-025  | PetForm: gender + castrated                 | Baixa      | FE-007, BE-018            | Concluída |
| TASK-FE-026  | ContactGate nas páginas de Lost & Found     | Alta       | FE-009, BE-011            | Concluída |
| TASK-FE-027  | ContactGate nas páginas de Services         | Alta       | FE-011, BE-013            | Concluída |
| TASK-FE-028  | Papéis de org na UI (OWNER/MGR/MBR)         | Alta       | FE-006, BE-020            | Concluída |
| TASK-FE-029  | Contexto "Agindo Como" no frontend          | Alta       | FE-028, BE-021            | Concluída |
| TASK-FE-030  | Foto de organização: UI e upload            | Média      | FE-028, BE-022            | Concluída |
| TASK-FE-031  | Foto de serviço: UI e upload                | Média      | FE-011, BE-023            | Concluída |
| TASK-FE-032  | Gerenciamento de membros da org: UI         | Alta       | FE-028, BE-024            | Concluída |
| TASK-FE-033  | Painel da organização                       | Média      | FE-028, FE-030, FE-032    | Concluída |
| TASK-FE-034  | Indicador de proprietário nos cards         | Baixa      | FE-029, BE-021            | Concluída |
| TASK-FE-035  | GET /organizations/:orgId/pets no frontend  | Média      | FE-033, BE-027            | Concluída |
| TASK-FE-036  | Co-tutores reais no PetDetailPage           | Média      | FE-007, BE-029            | Concluída |
| TASK-FE-037  | Delete exam file UI                         | Média      | FE-010                    | Concluída |
| TASK-FE-038  | Delete vaccination UI                       | Média      | FE-010, BE-030            | Concluída |
| TASK-FE-039  | Alinhamento tipos/URLs pet-health           | Alta       | FE-010                    | Concluída |
| TASK-FE-040  | PetHealthPage testes completos              | Média      | FE-010                    | Concluída |
| TASK-FE-041  | Atualização de status: adoção e lost-found  | Alta       | FE-008, FE-009            | Concluída |
| TASK-FE-042  | Editar anúncio de serviço                   | Alta       | FE-020                    | Concluída |
| TASK-FE-043  | Página 404 Not Found                        | Média      | —                         | Concluída |
| TASK-FE-044  | Controles de paginação nas listagens        | Média      | —                         | Pendente  |
| TASK-FE-045  | Editar anúncio de adoção                    | Média      | FE-041, BE-031            | Pendente  |
| TASK-FE-046  | Editar relatório de achado/perdido          | Média      | BE-032                    | Pendente  |
