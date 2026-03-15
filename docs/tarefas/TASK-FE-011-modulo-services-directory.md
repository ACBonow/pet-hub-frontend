# TASK-FE-011 — Módulo Services Directory (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-011 |
| Módulo       | services-directory |
| Prioridade   | Baixa |
| Dependências | TASK-FE-002, TASK-BE-013 |
| Status       | Pendente |

## Objetivo
Implementar diretório público de serviços pet com filtros por tipo e busca por nome.

## Contexto
- Totalmente público — sem autenticação para leitura.
- Tipos: Veterinário, Clínica, Exames, Farmácia de Manipulação, Banho e Tosa, Hospedaria, Transporte, Outro.
- Cards com nome, tipo (badge colorido por categoria), endereço e contato.
- Busca por nome e filtro por tipo.
- Cadastro de novo serviço requer autenticação.

## Checklist

### Pré-requisitos
- [ ] TASK-FE-002 concluída (shared layer)

### Red — Testes falhando primeiro
- [ ] Criar `src/modules/services-directory/__tests__/ServicesList.test.tsx`
  - [ ] Teste: renderiza cards com nome e badge de tipo
  - [ ] Teste: filtro por tipo atualiza listagem
  - [ ] Teste: busca por nome filtra resultados
  - [ ] Teste: acessível sem autenticação
- [ ] Confirmar que os testes falham

### Green — Implementação mínima
- [ ] Criar arquivos do módulo (types, services, hooks, components, pages)
- [ ] Adicionar rota pública `/services` em `routes.config.ts`
- [ ] Confirmar que todos os testes passam

### Finalização
- [ ] Todos os testes passando
- [ ] Badges coloridos por categoria de serviço
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/services-directory/types/index.ts` |
| Criar     | `src/modules/services-directory/services/servicesDirectory.service.ts` |
| Criar     | `src/modules/services-directory/hooks/useServicesDirectory.ts` |
| Criar     | `src/modules/services-directory/components/ServiceCard.tsx` |
| Criar     | `src/modules/services-directory/components/ServiceFilters.tsx` |
| Criar     | `src/modules/services-directory/components/ServiceForm.tsx` |
| Criar     | `src/modules/services-directory/pages/ServicesListPage.tsx` |
| Criar     | `src/modules/services-directory/pages/ServiceDetailPage.tsx` |
| Criar     | `src/modules/services-directory/pages/ServiceFormPage.tsx` |
| Criar     | `src/modules/services-directory/__tests__/ServicesList.test.tsx` |
| Modificar | `src/routes/routes.config.ts` |

## Critérios de Aceite
- [ ] Listagem pública sem autenticação
- [ ] Badge colorido por tipo de serviço
- [ ] Busca por nome funcional (com debounce)
- [ ] Filtro por tipo funcional
- [ ] Paginação funcional
