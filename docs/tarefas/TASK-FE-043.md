# TASK-FE-043 — Página 404 Not Found

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-043 |
| Módulo       | shared / routes |
| Prioridade   | Média |
| Dependências | Nenhuma |
| Status       | Pendente |

## Objetivo
Exibir uma página amigável quando o usuário navegar para uma rota inexistente, em vez de tela em branco.

## Contexto
O router (`src/routes/index.tsx`) não tem rota catch-all `path="*"`. Qualquer URL inválida renderiza em branco sem feedback algum.

## Escopo

### 1. `src/pages/NotFoundPage.tsx` (novo)
- Layout: `PublicLayout` (acessível sem autenticação)
- Conteúdo: código "404", mensagem em PT-BR, botão "Voltar para o início" → `ROUTES.HOME`
- Sem dependência de estado de auth

### 2. `src/routes/index.tsx`
Adicionar ao final da lista de rotas:
```typescript
{ path: '*', element: <S><NotFoundPage /></S> },
```

## Testes
Arquivo: `src/pages/__tests__/NotFoundPage.test.tsx`

- [ ] Renderiza mensagem de "página não encontrada"
- [ ] Exibe link/botão para voltar ao início

## Arquivos

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/pages/NotFoundPage.tsx` |
| Criar     | `src/pages/__tests__/NotFoundPage.test.tsx` |
| Modificar | `src/routes/index.tsx` |

## Critérios de Aceite
- [ ] URL desconhecida exibe a página 404
- [ ] Página tem link funcional para `/`
- [ ] Testes passando
