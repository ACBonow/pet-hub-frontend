/**
 * E2E — Auth flows
 *
 * Fluxo 1: Registro → redirecionamento para "verifique seu e-mail"
 * Fluxo 2: Login com credenciais inválidas → erro
 * Fluxo 3: Login com e-mail não verificado → banner + link de reenvio
 * Fluxo 4: Login com sucesso → redireciona ao dashboard
 */

import { test, expect } from '@playwright/test'
import { PRIMARY_USER, PRIMARY_AUTH_FILE } from './fixtures'

// ───────────────────────────── Validação de formulários ─────────────────────

test.describe('RegisterForm — validação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastro')
  })

  test('exibe erro ao submeter formulário vazio', async ({ page }) => {
    await page.getByRole('button', { name: /cadastrar/i }).click()
    await expect(page.getByText('Nome deve ter pelo menos 2 caracteres')).toBeVisible()
    await expect(page.getByText('E-mail inválido')).toBeVisible()
    await expect(page.getByText('Senha deve ter pelo menos 8 caracteres')).toBeVisible()
  })

  test('exibe erro para e-mail inválido', async ({ page }) => {
    await page.getByLabel('E-mail').fill('nao-e-email')
    await page.getByLabel('Nome').click() // trigger onBlur
    await expect(page.getByText('E-mail inválido')).toBeVisible()
  })

  test('exibe erro para senha curta', async ({ page }) => {
    await page.getByLabel('Senha').fill('123')
    await page.getByLabel('Nome').click()
    await expect(page.getByText('Senha deve ter pelo menos 8 caracteres')).toBeVisible()
  })
})

test.describe('RegisterForm — fluxo de registro', () => {
  test('registro bem-sucedido redireciona para "verifique seu e-mail"', async ({ page }) => {
    const uniqueEmail = `e2e-new-${Date.now()}@pethub.test`

    await page.goto('/cadastro')
    await page.getByLabel('Nome').fill('Novo Usuário Teste')
    await page.getByLabel('E-mail').fill(uniqueEmail)
    await page.getByLabel('Senha').fill('Teste@12345')
    // CPF is optional in the validator
    await page.getByRole('button', { name: /cadastrar/i }).click()

    // Should redirect to check-email page
    await expect(page).toHaveURL(/verificar-email\/enviado/, { timeout: 10_000 })
    await expect(page.getByText(/verifique/i)).toBeVisible()
  })
})

// ───────────────────────────── Login ─────────────────────────────────────────

test.describe('LoginForm — validação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('exibe erros ao submeter formulário vazio', async ({ page }) => {
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByText('E-mail inválido')).toBeVisible()
    await expect(page.getByText('Senha é obrigatória')).toBeVisible()
  })

  test('exibe erro para credenciais inválidas', async ({ page }) => {
    await page.getByLabel('E-mail').fill('nao-existe@pethub.test')
    await page.getByLabel('Senha').fill('SenhaErrada123')
    await page.getByRole('button', { name: /entrar/i }).click()
    // Backend should return error — displayed as alert
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 8_000 })
  })
})

test.describe('LoginForm — login com sucesso', () => {
  test('login válido redireciona ao dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(PRIMARY_USER.email)
    await page.getByLabel('Senha').fill(PRIMARY_USER.password)
    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveURL(/\/(dashboard|pets|perfil|$)/, { timeout: 10_000 })
  })
})

test.describe('Sessão persistida', () => {
  test.use({ storageState: PRIMARY_AUTH_FILE })

  test('usuário logado não é redirecionado ao acessar rota protegida', async ({ page }) => {
    await page.goto('/dashboard')
    // Should stay on dashboard (not redirect to /login)
    await expect(page).not.toHaveURL(/\/login/)
  })
})
