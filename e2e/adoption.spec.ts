/**
 * E2E — Fluxo de Adoção
 *
 * Fluxo 1: Criar anúncio de adoção (autenticado)
 * Fluxo 2: Visualizar anúncio como visitante → ContactGate bloqueia contato
 */

import { test, expect } from '@playwright/test'
import { PRIMARY_AUTH_FILE, PRIMARY_USER } from './fixtures'
import { loginUser, createPet, createAdoption } from './helpers/api'

// ────────────────────────────────────────────────────────
// Criar anúncio (usuário autenticado)
// ────────────────────────────────────────────────────────

test.describe('Criar anúncio de adoção', () => {
  test.use({ storageState: PRIMARY_AUTH_FILE })

  test('cria anúncio via formulário e redireciona para detalhe', async ({ page }) => {
    // Create a pet via API first
    const { accessToken } = await loginUser(PRIMARY_USER.email, PRIMARY_USER.password)
    await createPet(accessToken, `Pet Adoção ${Date.now()}`)

    await page.goto('/adocao/novo')
    await expect(page.getByText(/pet para adoção/i)).toBeVisible()

    // Open pet picker
    await page.getByRole('button', { name: /selecionar pet/i }).click()
    // Select the first pet in the modal
    const firstPet = page.getByRole('dialog').getByRole('button').first()
    await expect(firstPet).toBeVisible({ timeout: 8_000 })
    await firstPet.click()

    await page.getByLabel(/descrição/i).fill('E2E test — pet para adoção')
    await page.getByLabel(/email de contato/i).fill('contato@pethub.test')

    await page.getByRole('button', { name: /publicar anúncio/i }).click()

    await expect(page).toHaveURL(/\/adocao\/[a-z0-9-]+$/, { timeout: 10_000 })
  })
})

// ────────────────────────────────────────────────────────
// ContactGate — visitante não autenticado
// ────────────────────────────────────────────────────────

test.describe('ContactGate para visitante não autenticado', () => {
  // No storageState → unauthenticated browser

  test('exibe gate de autenticação no lugar do contato', async ({ page }) => {
    // Seed an adoption listing via API
    const { accessToken } = await loginUser(PRIMARY_USER.email, PRIMARY_USER.password)
    const petId = await createPet(accessToken, `Pet Visitante ${Date.now()}`)
    const adoptionId = await createAdoption(accessToken, petId, 'contato@pethub.test')

    await page.goto(`/adocao/${adoptionId}`)

    // Contact info should NOT be visible — ContactGate shows a login prompt instead
    await expect(page.getByText('contato@pethub.test')).not.toBeVisible()
    // The gate asks user to login/register to see contact
    await expect(
      page.getByRole('link', { name: /entrar|login|cadastrar/i }).first(),
    ).toBeVisible()
  })

  test('lista de adoção é pública e não requer login', async ({ page }) => {
    await page.goto('/adocao')
    await expect(page).not.toHaveURL(/\/login/)
    // Page renders without redirect
    await expect(page.getByRole('main')).toBeVisible()
  })
})
