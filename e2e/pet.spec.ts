/**
 * E2E — Fluxo de Pet
 *
 * Fluxo 1: Criar pet → visualizar detalhes
 * Fluxo 2: Transferir tutoria por CPF
 */

import { test, expect } from '@playwright/test'
import { PRIMARY_AUTH_FILE, SECONDARY_USER } from './fixtures'
import { loginUser, createPet } from './helpers/api'

test.use({ storageState: PRIMARY_AUTH_FILE })

test.describe('Criar pet', () => {
  test('cria pet via formulário e exibe na página de detalhe', async ({ page }) => {
    const petName = `Pet E2E ${Date.now()}`

    await page.goto('/pets/novo')
    await expect(page.getByLabel('Nome')).toBeVisible()

    await page.getByLabel('Nome').fill(petName)
    await page.getByLabel('Espécie').selectOption('dog')
    await page.getByLabel('Raça').fill('Labrador')
    await page.getByLabel('Sexo').selectOption('M')

    await page.getByRole('button', { name: /salvar/i }).click()

    // Should redirect to pet detail page
    await expect(page).toHaveURL(/\/pets\/[a-z0-9-]+$/, { timeout: 10_000 })
    await expect(page.getByText(petName)).toBeVisible()
  })
})

test.describe('Transferir tutoria', () => {
  test('transfere tutoria para outro usuário via CPF', async ({ page }) => {
    // Create a pet via API for speed
    const { accessToken } = await loginUser(
      process.env.E2E_PRIMARY_EMAIL ?? 'e2e-primary@pethub.test',
      process.env.E2E_PRIMARY_PASSWORD ?? 'Teste@12345',
    )
    const petId = await createPet(accessToken, `Pet Transferência ${Date.now()}`)

    await page.goto(`/pets/${petId}`)
    await expect(page.getByRole('button', { name: /transferir tutoria/i })).toBeVisible()

    // Open transfer modal
    await page.getByRole('button', { name: /transferir tutoria/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Fill in CPF of secondary user (CpfInput masks it as ###.###.###-##)
    const cpfInput = page.getByLabel(/cpf do novo tutor/i)
    await cpfInput.fill(SECONDARY_USER.cpfFormatted)

    await page.getByRole('dialog').getByRole('button', { name: /confirmar/i }).click()

    // Modal closes on success
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8_000 })
  })
})
