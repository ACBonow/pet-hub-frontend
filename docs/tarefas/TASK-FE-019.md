# TASK-FE-019 — Fluxo de recuperação de senha

## Status
`Pendente`

## Objetivo
Implementar o fluxo completo de recuperação de senha:
- Tela "esqueci minha senha" (input de e-mail)
- Tela de confirmação "e-mail enviado"
- Tela "redefinir senha" (token da URL + nova senha)
- Link "Esqueci minha senha" na LoginForm

## Dependências
- TASK-FE-017 (service layer com `forgotPassword` e `resetPassword`)
- TASK-FE-018 (padrão visual das telas auth estabelecido)

## Rotas Novas

| Rota | Componente | Layout | Tipo |
|------|-----------|--------|------|
| `/esqueci-senha` | `ForgotPasswordPage` | sem layout (card centrado) | AUTH |
| `/esqueci-senha/enviado` | `ForgotPasswordSentPage` | sem layout (card centrado) | AUTH |
| `/redefinir-senha` | `ResetPasswordPage` | sem layout (card centrado) | AUTH |

## Escopo

### 1. `src/routes/routes.config.ts`
Adicionar ao `ROUTES.AUTH` (criado em FE-018):
```typescript
AUTH: {
  // ... (de FE-018)
  FORGOT_PASSWORD: '/esqueci-senha',
  FORGOT_PASSWORD_SENT: '/esqueci-senha/enviado',
  RESET_PASSWORD: '/redefinir-senha',
}
```

### 2. `src/modules/auth/pages/ForgotPasswordPage.tsx` *(novo)*
**Situação:** usuário clicou em "Esqueci minha senha" na tela de login.

Conteúdo:
- Título: "Esqueci minha senha"
- Descrição: "Informe seu e-mail e enviaremos um link para redefinir sua senha."
- Formulário (react-hook-form + zod):
  - Campo `email` (type="email", validação: e-mail válido)
  - Botão "Enviar link" com loading state
- Ao submeter: chama `forgotPassword({ email })` → navega para `/esqueci-senha/enviado?email={email}`
- Erro genérico se a chamada falhar (improvável, pois o backend sempre retorna 200)
- Link "Voltar ao login" → `/login`

### 3. `src/modules/auth/pages/ForgotPasswordSentPage.tsx` *(novo)*
**Situação:** usuário acabou de solicitar o link de redefinição.

Conteúdo:
- Ícone de envelope
- Título: "E-mail enviado"
- Texto: "Se **{email}** estiver cadastrado, você receberá um link para redefinir sua senha. Verifique também o spam."
  - `{email}` vem de `?email=` na URL (se ausente, texto genérico sem o e-mail)
- Link "Tentar outro e-mail" → `/esqueci-senha`
- Link "Voltar ao login" → `/login`

### 4. `src/modules/auth/pages/ResetPasswordPage.tsx` *(novo)*
**Situação:** usuário clicou no link do e-mail de redefinição, chega em `/redefinir-senha?token=xxx`.

Comportamento:
- **Sem token na URL**: redirecionar imediatamente para `/esqueci-senha`
- **Formulário** (react-hook-form + zod):
  - Campo `newPassword` (type="password", min 8 chars, label: "Nova senha")
  - Campo `confirmPassword` (type="password", label: "Confirmar nova senha")
  - Validação: `confirmPassword` deve ser igual a `newPassword` (`.refine(...)` no schema)
  - Botão "Redefinir senha" com loading state
- Ao submeter: chama `resetPassword({ token, newPassword })`
  - **Sucesso**: navegar para `/login` com `?resetSuccess=1` para exibir mensagem na LoginPage
  - **Token inválido/expirado**: exibir mensagem de erro inline + link "Solicitar novo link" → `/esqueci-senha`

### 5. `src/modules/auth/components/LoginForm.tsx` *(modificar)*
- Adicionar link "Esqueci minha senha" abaixo do campo senha → `/esqueci-senha`
- Detectar `?resetSuccess=1` na URL e exibir banner verde: "Senha redefinida com sucesso. Faça login."

### 6. `src/routes/index.tsx` *(modificar)*
- Importar as 3 novas páginas
- Adicionar as 3 novas rotas na seção AUTH

## Testes

### `ForgotPasswordPage.test.tsx`
- Renderiza campo de e-mail e botão
- Exibe erro de validação para e-mail inválido
- Chama `forgotPassword` com o e-mail informado
- Redireciona para `/esqueci-senha/enviado?email=...` após sucesso
- Exibe erro genérico se `forgotPassword` lançar exceção
- Link "Voltar ao login" presente e aponta para `/login`

### `ForgotPasswordSentPage.test.tsx`
- Exibe título e mensagem
- Exibe e-mail quando `?email=` está presente na URL
- Link "Tentar outro e-mail" aponta para `/esqueci-senha`
- Link "Voltar ao login" aponta para `/login`

### `ResetPasswordPage.test.tsx`
- Redireciona para `/esqueci-senha` quando não há token na URL
- Renderiza campos de nova senha e confirmação
- Exibe erro se senhas não coincidem
- Exibe erro se senha for muito curta (< 8 chars)
- Chama `resetPassword` com token da URL e nova senha
- Redireciona para `/login?resetSuccess=1` após sucesso
- Exibe erro de token inválido quando `resetPassword` rejeita com `INVALID_RESET_TOKEN`
- Exibe erro de token expirado quando `resetPassword` rejeita com `RESET_TOKEN_EXPIRED`

### `LoginForm.test.tsx` (adicionar casos)
- Link "Esqueci minha senha" está presente e aponta para `/esqueci-senha`
- Exibe banner de sucesso quando `?resetSuccess=1` está na URL

## Arquivos modificados / criados
```
src/routes/routes.config.ts                              ← adicionar novas rotas AUTH
src/routes/index.tsx                                      ← registrar novas páginas
src/modules/auth/pages/ForgotPasswordPage.tsx            ← NOVO
src/modules/auth/pages/ForgotPasswordSentPage.tsx        ← NOVO
src/modules/auth/pages/ResetPasswordPage.tsx             ← NOVO
src/modules/auth/components/LoginForm.tsx                ← link "esqueci" + banner sucesso
src/modules/auth/__tests__/ForgotPasswordPage.test.tsx   ← NOVO
src/modules/auth/__tests__/ForgotPasswordSentPage.test.tsx ← NOVO
src/modules/auth/__tests__/ResetPasswordPage.test.tsx    ← NOVO
src/modules/auth/__tests__/LoginForm.test.tsx            ← adicionar casos
```

## Notas de Implementação
- Schema Zod para ResetPasswordPage:
  ```typescript
  const schema = z.object({
    newPassword: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  }).refine(d => d.newPassword === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  ```
- `ResetPasswordPage` lê o token via `useSearchParams()` → `searchParams.get('token')`
- Banner de sucesso no login: `searchParams.get('resetSuccess') === '1'` → exibir `<div role="status">Senha redefinida...</div>` com fundo verde claro
- O `?resetSuccess=1` não causa loop de redirect — basta ler o parâmetro e exibir o banner, sem remover da URL
- `ForgotPasswordPage` não precisa de cooldown (diferente de reenvio de verificação) — uma submissão por vez já é suficiente pelo loading state

## Critérios de Aceite
- [ ] Link "Esqueci minha senha" visível na tela de login
- [ ] Formulário de e-mail envia e redireciona para tela de confirmação
- [ ] Tela de confirmação exibe o e-mail e links corretos
- [ ] Link do e-mail de reset leva para formulário de nova senha
- [ ] Senha nova com confirmação valida igualdade e tamanho mínimo
- [ ] Após reset bem-sucedido, login exibe banner verde de confirmação
- [ ] Token inválido/expirado mostra mensagem clara com link para solicitar novo
- [ ] Todos os testes passando
- [ ] TypeScript sem erros
