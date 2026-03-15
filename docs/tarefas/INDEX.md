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
```

## Tabela de Tarefas

| ID           | Tarefa                             | Prioridade | Dependências                      | Status   |
|--------------|------------------------------------|------------|-----------------------------------|----------|
| TASK-FE-001  | Inicialização do Projeto           | Alta       | Nenhuma                           | Pendente |
| TASK-FE-002  | Shared Layer (API Client, Layout)  | Alta       | FE-001                            | Pendente |
| TASK-FE-003  | Validators CPF e CNPJ              | Alta       | FE-001                            | Pendente |
| TASK-FE-004  | Módulo Auth                        | Alta       | FE-002, FE-003, BE-006            | Pendente |
| TASK-FE-005  | Módulo Person                      | Alta       | FE-004, BE-007                    | Pendente |
| TASK-FE-006  | Módulo Organization                | Alta       | FE-005, BE-008                    | Pendente |
| TASK-FE-007  | Módulo Pet                         | Alta       | FE-006, BE-009                    | Pendente |
| TASK-FE-008  | Módulo Adoption                    | Média      | FE-007, BE-010                    | Pendente |
| TASK-FE-009  | Módulo Lost & Found                | Média      | FE-004, BE-011                    | Pendente |
| TASK-FE-010  | Módulo Pet Health                  | Média      | FE-007, BE-012                    | Pendente |
| TASK-FE-011  | Módulo Services Directory          | Baixa      | FE-002, BE-013                    | Pendente |
