# TASK-FE-017 — Auth Service: email verification & password recovery

## Status
`Pendente`

## Objetivo
Estender a camada de serviço e o hook `useAuth` com os 4 novos endpoints criados na TASK-BE-014.
Esta task é a fundação para FE-018 (verificação) e FE-019 (recuperação de senha).

## Dependências
- TASK-FE-016 (rotas completas)
- TASK-BE-014 (endpoints no backend)

## Escopo

### 1. `src/modules/auth/types/index.ts`
Adicionar interfaces:
```typescript
export interface VerifyEmailData { token: string }
export interface ResendVerificationData { email: string }
export interface ForgotPasswordData { email: string }
export interface ResetPasswordData { token: string; newPassword: string }
```

### 2. `src/modules/auth/services/auth.service.ts`
Adicionar 4 funções:
```typescript
verifyEmailRequest(data: VerifyEmailData): Promise<void>
resendVerificationRequest(data: ResendVerificationData): Promise<void>
forgotPasswordRequest(data: ForgotPasswordData): Promise<void>
resetPasswordRequest(data: ResetPasswordData): Promise<void>
```

Todas fazem `POST` para os respectivos endpoints `/api/v1/auth/*` via `api.client`.

### 3. `src/modules/auth/hooks/useAuth.ts`
Adicionar 4 métodos que chamam as funções do service:
```typescript
verifyEmail(data: VerifyEmailData): Promise<void>
resendVerification(data: ResendVerificationData): Promise<void>
forgotPassword(data: ForgotPasswordData): Promise<void>
resetPassword(data: ResetPasswordData): Promise<void>
```

Estes métodos **não** alteram o estado do store — apenas delegam para o service.

### 4. `src/modules/auth/index.ts`
Exportar os novos tipos.

## Testes
Arquivo(s): `src/modules/auth/__tests__/auth.service.test.ts` e `useAuth.test.ts` (se existirem, adicionar; se não, criar).

### Service tests
Mockar `api.client`. Para cada função:
- Verifica que faz POST para a URL correta com o payload correto
- Verifica que resolve sem erros em caso de sucesso (status 200)
- Verifica que propaga o erro em caso de falha da API

### Hook tests
Mockar `auth.service`. Para cada método do hook:
- Verifica que delega para a função correta do service
- Verifica que propaga erros lançados pelo service

## Arquivos modificados
```
src/modules/auth/types/index.ts        ← adicionar tipos
src/modules/auth/services/auth.service.ts ← adicionar funções
src/modules/auth/hooks/useAuth.ts      ← adicionar métodos
src/modules/auth/index.ts              ← exportar novos tipos
src/modules/auth/__tests__/...         ← testes (red → green)
```

## Notas de Implementação
- `verifyEmailRequest` pode lançar `ApiError` com `code: 'INVALID_VERIFICATION_TOKEN'` (400) ou `'VERIFICATION_TOKEN_EXPIRED'` (400) — o chamador (FE-018) tratará esses códigos
- `forgotPasswordRequest` e `resendVerificationRequest` sempre resolvem com sucesso do ponto de vista HTTP (o backend nunca revela se o e-mail existe)
- `resetPasswordRequest` pode lançar `ApiError` com `code: 'INVALID_RESET_TOKEN'` ou `'RESET_TOKEN_EXPIRED'`
- Nenhum destes métodos chama `setAuth` ou `clearAuth`

## Critérios de Aceite
- [ ] Todos os testes novos passando (green)
- [ ] Todos os testes existentes ainda passando
- [ ] TypeScript sem erros (`tsc --noEmit`)
