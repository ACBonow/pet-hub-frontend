# BACKLOG TÉCNICO — Frontend

Tarefas de segurança, performance e qualidade identificadas em revisão técnica.  
Não são features de produto — são melhorias de engenharia.

> **Convenção de ID**: `TECH-FE-XXX`  
> **Status possíveis**: `Pendente` · `Em andamento` · `Concluída` · `Cancelada`

---

## Índice

- [Segurança](#segurança)
- [Performance](#performance)
- [Qualidade](#qualidade)
- [Testes](#testes)

---

## Segurança

### TECH-FE-001 — Persistir refresh token e restaurar sessão ao recarregar a página

| Campo        | Valor |
|--------------|-------|
| ID           | TECH-FE-001 |
| Categoria    | Segurança |
| Prioridade   | **Crítica** |
| Status       | Pendente |

**Problema**  
O refresh token retornado pelo login não está sendo persistido. Após reload da página, o usuário perde a sessão e precisa fazer login novamente.

**Fix**
1. Salvar `refreshToken` em `localStorage` com chave `pethub:refresh_token`
2. Em `main.tsx` (ou `App.tsx`), ao inicializar, verificar `localStorage` por refresh token
3. Se encontrar, chamar `authService.refresh(refreshToken)` para obter novo access token
4. Popular o Zustand store com o resultado antes de renderizar rotas protegidas
5. Se refresh falhar (token expirado), limpar storage e exibir tela de login normalmente

**Arquivos**
- `src/modules/auth/store/authSlice.ts`
- `src/main.tsx`
- `src/modules/auth/services/auth.service.ts`

---

### TECH-FE-002 — Adicionar interceptor de 401 no `api.client` para refresh automático de token

| Campo        | Valor |
|--------------|-------|
| ID           | TECH-FE-002 |
| Categoria    | Segurança |
| Prioridade   | **Crítica** |
| Status       | Concluída |
| Dependências | TECH-FE-001 (precisa do refresh token persistido) |

**Problema**  
Quando o access token expira, todas as requisições retornam `401` e o usuário é forçado a fazer login manual. O `api.client` não tenta refresh automaticamente.

**Fix**
1. No response interceptor do axios, capturar status `401`
2. Chamar `authService.refresh(refreshToken)` para obter novo access token
3. Atualizar o Zustand store e o `tokenGetter`
4. Retentar a requisição original com o novo token via `config._retry`
5. Se o refresh falhar, limpar sessão e redirecionar para `/login`
6. Usar flag `_retry` para evitar loop infinito de refresh

**Arquivos**
- `src/shared/services/api.client.ts`
- `src/modules/auth/store/authSlice.ts`

---

## Performance

### TECH-FE-003 — Cancelar requisições HTTP pendentes com `AbortController` ao desmontar componentes

| Campo        | Valor |
|--------------|-------|
| ID           | TECH-FE-003 |
| Categoria    | Performance |
| Prioridade   | Alta |
| Status       | Pendente |

**Problema**  
Quando um componente é desmontado enquanto uma requisição está em andamento (ex: usuário navega para outra página), a resposta tenta atualizar estado de componente desmontado, gerando warnings e potencial memory leak.

**Fix**
1. Nos hooks de dados, criar `AbortController` dentro do `useEffect`
2. Passar `signal` para as chamadas axios: `api.get('/...', { signal: controller.signal })`
3. Cancelar no cleanup: `return () => controller.abort()`
4. Tratar `CanceledError` como caso silencioso (não exibir erro)

**Arquivos**  
Todos os hooks de dados em `src/modules/*/hooks/` — `useAdoptions`, `usePets`, `useOrganizations`, `useLostFound`, `useServices`, etc.

---

### TECH-FE-004 — Comprimir imagens no frontend antes do upload

| Campo        | Valor |
|--------------|-------|
| ID           | TECH-FE-004 |
| Categoria    | Performance |
| Prioridade   | Média |
| Status       | Pendente |
| Dependências | Avaliar `browser-image-compression` |

**Problema**  
Fotos de pets, orgs e serviços são enviadas sem compressão. Usuários mobile podem enviar fotos de 5–10 MB, consumindo banda e storage desnecessariamente.

**Fix**
1. Instalar `browser-image-compression` (ou implementar via Canvas API)
2. Criar utilitário `src/shared/utils/image.ts` com `compressImage(file, options): Promise<File>`
3. Target: max 1 MB, max 1200 px de largura, manter aspect ratio
4. Chamar antes do upload em `PetFormPage`, `OrganizationFormPage`, `ServiceFormPage`

**Arquivos**
- `src/shared/utils/image.ts` (novo)
- `src/modules/pet/pages/PetFormPage.tsx`
- `src/modules/organization/pages/OrganizationFormPage.tsx`
- `src/modules/services-directory/pages/ServiceFormPage.tsx`

---

## Qualidade

### TECH-FE-005 — Adicionar Error Boundaries nas rotas principais

| Campo        | Valor |
|--------------|-------|
| ID           | TECH-FE-005 |
| Categoria    | Qualidade |
| Prioridade   | Média |
| Status       | Concluída |

**Problema**  
Erros de runtime em qualquer componente derrubam a árvore inteira sem mensagem amigável. Não há nenhuma Error Boundary configurada.

**Fix**
1. Criar `src/shared/components/ErrorBoundary.tsx` (class component — React não suporta hooks em boundaries)
2. Exibir mensagem amigável em português com botão "Tentar novamente" (`window.location.reload()`)
3. Logar o erro via `console.error` (ou serviço futuro de monitoramento)
4. Envolver o `<RouterProvider>` em `App.tsx` com o boundary
5. Opcionalmente, envolver cada módulo de rota individualmente para fallbacks granulares

**Arquivos**
- `src/shared/components/ErrorBoundary.tsx` (novo)
- `src/App.tsx`

---

### TECH-FE-006 — Adicionar thresholds de cobertura de testes no `jest.config.ts`

| Campo        | Valor |
|--------------|-------|
| ID           | TECH-FE-006 |
| Categoria    | Qualidade |
| Prioridade   | Média |
| Status       | Pendente |

**Problema**  
Não há limites mínimos de cobertura configurados. É possível adicionar código sem testes e o CI não falha.

**Fix**  
Adicionar em `jest.config.ts`:
```ts
coverageThreshold: {
  global: { branches: 70, functions: 80, lines: 80, statements: 80 },
},
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/__tests__/**',
  '!src/main.tsx',
  '!src/setupTests.ts',
],
```

**Arquivos**
- `jest.config.ts`

---

## Testes

### TECH-FE-007 — Adicionar testes E2E com Playwright cobrindo fluxos críticos

| Campo        | Valor |
|--------------|-------|
| ID           | TECH-FE-007 |
| Categoria    | Testes |
| Prioridade   | Alta |
| Status       | Pendente |
| Dependências | Backend rodando localmente ou ambiente de staging |

**Problema**  
Não há testes end-to-end. Mudanças no contrato de API ou no comportamento do frontend podem quebrar fluxos críticos sem detecção automatizada.

**Fluxos prioritários**
1. Registro → verificação de email → login
2. Criar pet → transferir tutoria por CPF
3. Criar anúncio de adoção → visualizar como visitante (ContactGate)
4. Criar organização → adicionar membro → acessar painel (`/painel`)

**Fix**
1. Instalar e configurar `@playwright/test`
2. Criar `playwright.config.ts` apontando para `VITE_API_BASE_URL` de staging
3. Criar `e2e/` com um arquivo por fluxo
4. Adicionar script `test:e2e` no `package.json`

**Arquivos**
- `playwright.config.ts` (novo)
- `e2e/auth.spec.ts` (novo)
- `e2e/pet.spec.ts` (novo)
- `e2e/adoption.spec.ts` (novo)
- `e2e/organization.spec.ts` (novo)
