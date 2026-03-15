# TASK-FE-004 — Módulo Auth (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-004 |
| Módulo       | auth |
| Prioridade   | Alta |
| Dependências | TASK-FE-002, TASK-FE-003, TASK-BE-006 |
| Status       | Pendente |

## Objetivo
Implementar fluxo de autenticação no frontend: telas de login e cadastro, gerenciamento de tokens JWT, store de autenticação e proteção de rotas.

## Contexto
- Access token armazenado em memória (store Zustand) — não em localStorage para segurança.
- Refresh token gerenciado via cookie httpOnly (configurado pelo backend).
- `PrivateRoute` redireciona para `/login` se não autenticado.
- Após login/register, redirecionar para tela inicial do app.

## Checklist

### Pré-requisitos
- [ ] TASK-FE-002 concluída (api.client, componentes UI)
- [ ] TASK-FE-003 concluída (CpfInput para o formulário de cadastro)
- [ ] Backend TASK-BE-006 concluída (endpoints de auth disponíveis)

### Red — Testes falhando primeiro
- [ ] Criar `src/modules/auth/__tests__/LoginForm.test.tsx`
  - [ ] Teste: exibe campos email e senha
  - [ ] Teste: exibe erro de validação para email inválido
  - [ ] Teste: chama `useAuth().login` ao submeter com dados válidos
  - [ ] Teste: exibe mensagem de erro da API ao falhar
- [ ] Criar `src/modules/auth/__tests__/RegisterForm.test.tsx`
  - [ ] Teste: exibe campos nome, email, senha, CPF
  - [ ] Teste: exibe erro inline para CPF inválido
  - [ ] Teste: chama `useAuth().register` ao submeter com dados válidos
- [ ] Criar `src/modules/auth/__tests__/useAuth.test.ts`
  - [ ] Teste: `login` armazena accessToken no store
  - [ ] Teste: `logout` limpa o store
  - [ ] Teste: `isAuthenticated` retorna true com token válido
- [ ] Confirmar que todos os testes falham

### Green — Implementação mínima
- [ ] Criar `src/modules/auth/types/index.ts`
- [ ] Criar `src/modules/auth/services/auth.service.ts`
- [ ] Criar `src/modules/auth/store/authSlice.ts` (Zustand slice)
- [ ] Criar `src/modules/auth/hooks/useAuth.ts`
- [ ] Criar `src/modules/auth/components/LoginForm.tsx`
- [ ] Criar `src/modules/auth/components/RegisterForm.tsx`
- [ ] Criar páginas: `src/modules/auth/pages/LoginPage.tsx`, `RegisterPage.tsx`
- [ ] Criar `src/routes/PrivateRoute.tsx`
- [ ] Configurar rotas em `src/routes/routes.config.ts` e `src/routes/index.tsx`
- [ ] Confirmar que todos os testes passam

### Finalização
- [ ] Todos os testes passando
- [ ] Fluxo login → dashboard funcional no browser
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/modules/auth/types/index.ts` |
| Criar     | `src/modules/auth/services/auth.service.ts` |
| Criar     | `src/modules/auth/store/authSlice.ts` |
| Criar     | `src/modules/auth/hooks/useAuth.ts` |
| Criar     | `src/modules/auth/components/LoginForm.tsx` |
| Criar     | `src/modules/auth/components/RegisterForm.tsx` |
| Criar     | `src/modules/auth/pages/LoginPage.tsx` |
| Criar     | `src/modules/auth/pages/RegisterPage.tsx` |
| Criar     | `src/modules/auth/__tests__/LoginForm.test.tsx` |
| Criar     | `src/modules/auth/__tests__/RegisterForm.test.tsx` |
| Criar     | `src/modules/auth/__tests__/useAuth.test.ts` |
| Criar     | `src/routes/PrivateRoute.tsx` |
| Criar     | `src/routes/routes.config.ts` |
| Criar     | `src/routes/index.tsx` |
| Modificar | `src/App.tsx` |

## Critérios de Aceite
- [ ] Login com credenciais válidas redireciona para home
- [ ] Rota protegida sem autenticação redireciona para `/login`
- [ ] Token não armazenado em localStorage
- [ ] Erro de API exibido em português no formulário
