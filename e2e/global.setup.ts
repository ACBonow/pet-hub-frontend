/**
 * Global E2E setup: authenticates two test users and persists their browser state.
 *
 * Test accounts (raw CPF digits stored in DB):
 *   Primary:   e2e-primary@pethub.test / Teste@12345  CPF: 529.982.247-25
 *   Secondary: e2e-secondary@pethub.test / Teste@12345  CPF: 111.444.777-35
 *
 * If login fails with EMAIL_NOT_VERIFIED, the error message includes the SQL
 * command needed to verify the account manually.
 */

import { test as setup, expect } from '@playwright/test'
import { registerUser } from './helpers/api'
import { PRIMARY_USER, SECONDARY_USER, PRIMARY_AUTH_FILE, SECONDARY_AUTH_FILE } from './fixtures'

setup('authenticate primary user', async ({ page }) => {
  // Try to register (no-op if already exists)
  await registerUser(PRIMARY_USER.name, PRIMARY_USER.email, PRIMARY_USER.password, PRIMARY_USER.cpf)

  // Login via UI so that localStorage is populated by the auth store
  await page.goto('/login')
  await page.getByLabel('E-mail').fill(PRIMARY_USER.email)
  await page.getByLabel('Senha').fill(PRIMARY_USER.password)
  await page.getByRole('button', { name: /entrar/i }).click()

  // Should redirect to dashboard after successful login
  await expect(page).toHaveURL(/\/(dashboard|pets|perfil|$)/, { timeout: 10_000 })

  await page.context().storageState({ path: PRIMARY_AUTH_FILE })
})

setup('authenticate secondary user', async ({ page }) => {
  await registerUser(
    SECONDARY_USER.name,
    SECONDARY_USER.email,
    SECONDARY_USER.password,
    SECONDARY_USER.cpf,
  )

  await page.goto('/login')
  await page.getByLabel('E-mail').fill(SECONDARY_USER.email)
  await page.getByLabel('Senha').fill(SECONDARY_USER.password)
  await page.getByRole('button', { name: /entrar/i }).click()

  await expect(page).toHaveURL(/\/(dashboard|pets|perfil|$)/, { timeout: 10_000 })

  await page.context().storageState({ path: SECONDARY_AUTH_FILE })
})
