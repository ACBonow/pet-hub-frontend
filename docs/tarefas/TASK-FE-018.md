# TASK-FE-018 — Fluxo de verificação de email

## Status
`Pendente`

## Objetivo
Implementar as telas e o fluxo completo de verificação de e-mail:
- Pós-cadastro: redirecionar para tela "verifique seu e-mail" (com botão reenviar)
- Link de verificação: tela que processa o token e exibe sucesso/erro
- Login com e-mail não verificado: mensagem clara com link para reenviar

## Dependências
- TASK-FE-017 (service layer com os novos métodos)

## Rotas Novas

| Rota | Componente | Layout | Tipo |
|------|-----------|--------|------|
| `/verificar-email/enviado` | `CheckEmailPage` | sem layout (card centrado) | AUTH |
| `/verificar-email` | `VerifyEmailPage` | sem layout (card centrado) | AUTH |

## Escopo

### 1. `src/routes/routes.config.ts`
Adicionar ao objeto `ROUTES`:
```typescript
AUTH: {
  VERIFY_EMAIL: '/verificar-email',
  CHECK_EMAIL: '/verificar-email/enviado',
}
```

### 2. `src/modules/auth/pages/CheckEmailPage.tsx` *(novo)*
**Situação:** usuário acabou de se cadastrar, ou acabou de pedir reenvio.

Conteúdo:
- Ícone de envelope (emoji ou SVG simples)
- Título: "Verifique seu e-mail"
- Texto: "Enviamos um link de confirmação para **{email}**. Verifique sua caixa de entrada (e spam)."
  - O email vem via `?email=` na URL query string (passado pela RegisterForm)
  - Se não houver `?email=`, exibir texto genérico sem destacar o endereço
- Botão "Reenviar e-mail" → chama `resendVerification({ email })` → feedback inline ("E-mail reenviado!" / erro)
- Botão de reenvio fica desabilitado por 60 segundos após clicar (cooldown)
- Link "Entrar" → `/login`

### 3. `src/modules/auth/pages/VerifyEmailPage.tsx` *(novo)*
**Situação:** usuário clicou no link do e-mail, chega na rota `/verificar-email?token=xxx`.

Estados da tela:
- **Carregando**: spinner enquanto `verifyEmail({ token })` está em execução (chama automaticamente ao montar, sem botão)
- **Sucesso**: ícone check verde, "E-mail verificado com sucesso!", link "Entrar agora" → `/login`
- **Token inválido** (`INVALID_VERIFICATION_TOKEN`): ícone X vermelho, "Link de verificação inválido.", link "Solicitar novo link" → `/verificar-email/enviado`
- **Token expirado** (`VERIFICATION_TOKEN_EXPIRED`): ícone X vermelho, "Link expirado.", link "Solicitar novo link" → `/verificar-email/enviado`
- **Sem token na URL**: redirecionar imediatamente para `/verificar-email/enviado`

### 4. `src/modules/auth/components/LoginForm.tsx` *(modificar)*
- Detectar código `EMAIL_NOT_VERIFIED` (403) no catch do login
- Nesse caso, mostrar mensagem especial: "Seu e-mail ainda não foi confirmado." + link "Reenviar e-mail de verificação" → `/verificar-email/enviado`
- Link deve incluir `?email={email digitado}` para pré-preencher a mensagem da CheckEmailPage

### 5. `src/modules/auth/components/RegisterForm.tsx` *(modificar)*
- Após cadastro bem-sucedido, ao invés de `navigate(returnTo ?? ROUTES.HOME)`, navegar para `/verificar-email/enviado?email={email}`

### 6. `src/routes/index.tsx` *(modificar)*
- Importar `CheckEmailPage` e `VerifyEmailPage`
- Adicionar as 2 novas rotas na seção AUTH (sem layout wrapper, como LoginPage e RegisterPage)

## Testes

### `CheckEmailPage.test.tsx`
- Exibe título e instruções
- Exibe e-mail quando `?email=` está presente na URL
- Botão "Reenviar e-mail" chama `resendVerification`
- Botão fica desabilitado após clique (cooldown)
- Exibe feedback "E-mail reenviado!" após sucesso
- Exibe erro inline se `resendVerification` lançar exceção

### `VerifyEmailPage.test.tsx`
- Redireciona para `/verificar-email/enviado` quando não há token na URL
- Exibe spinner enquanto processa
- Exibe mensagem de sucesso após `verifyEmail` resolver
- Exibe mensagem de token inválido quando `verifyEmail` rejeita com `INVALID_VERIFICATION_TOKEN`
- Exibe mensagem de token expirado quando `verifyEmail` rejeita com `VERIFICATION_TOKEN_EXPIRED`
- Link "Entrar agora" está presente após sucesso

### `LoginForm.test.tsx` (adicionar casos)
- Exibe mensagem especial e link de reenvio quando login retorna 403 EMAIL_NOT_VERIFIED
- Link aponta para `/verificar-email/enviado?email=...`

### `RegisterForm.test.tsx` (adicionar casos)
- Redireciona para `/verificar-email/enviado?email=...` após cadastro bem-sucedido

## Arquivos modificados / criados
```
src/routes/routes.config.ts                           ← adicionar rotas
src/routes/index.tsx                                   ← registrar novas rotas
src/modules/auth/pages/CheckEmailPage.tsx              ← NOVO
src/modules/auth/pages/VerifyEmailPage.tsx             ← NOVO
src/modules/auth/components/LoginForm.tsx              ← tratar EMAIL_NOT_VERIFIED
src/modules/auth/components/RegisterForm.tsx           ← redirecionar para check-email
src/modules/auth/__tests__/CheckEmailPage.test.tsx     ← NOVO
src/modules/auth/__tests__/VerifyEmailPage.test.tsx    ← NOVO
src/modules/auth/__tests__/LoginForm.test.tsx          ← adicionar casos
src/modules/auth/__tests__/RegisterForm.test.tsx       ← adicionar casos
```

## Notas de Implementação
- `CheckEmailPage` e `VerifyEmailPage` usam o mesmo card centrado de `LoginPage` (`min-h-screen bg-gray-50 flex items-center justify-center px-4`)
- `VerifyEmailPage` faz a chamada `verifyEmail` no `useEffect([])` — sem botão de submit
- Cooldown do botão reenviar: `useState<number>(0)` + `useInterval` ou `setTimeout` decrementando; botão desabilitado se `cooldown > 0`
- Ao testar `VerifyEmailPage`, usar `jest.useFakeTimers()` não é necessário — basta verificar estado visual
- Erro `EMAIL_NOT_VERIFIED` no login: `(err as ApiError).code === 'EMAIL_NOT_VERIFIED'` — cuidado com tipagem de `ApiError`

## Critérios de Aceite
- [ ] Cadastro redireciona para tela "verifique seu e-mail"
- [ ] Link do e-mail processa o token e exibe sucesso/erro
- [ ] Login com e-mail não verificado exibe mensagem + link de reenvio
- [ ] Botão reenviar tem cooldown de 60s
- [ ] Todos os testes passando
- [ ] TypeScript sem erros
