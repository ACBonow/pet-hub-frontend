/**
 * E2E — Fluxo de Organização
 *
 * Fluxo 1: Criar organização → visualizar detalhe
 * Fluxo 2: Adicionar membro via CPF
 * Fluxo 3: Acessar painel da organização (/painel)
 */

import { test, expect } from '@playwright/test'
import { PRIMARY_AUTH_FILE, PRIMARY_USER, SECONDARY_USER } from './fixtures'
import { loginUser, createOrganization } from './helpers/api'

// Valid CNPJ for tests: 12.345.678/0001-95
const TEST_CNPJ = '12345678000195'
const TEST_CNPJ_FORMATTED = '12.345.678/0001-95'

test.use({ storageState: PRIMARY_AUTH_FILE })

test.describe('Criar organização', () => {
  test('cria organização e exibe na página de detalhe', async ({ page }) => {
    const orgName = `Org E2E ${Date.now()}`

    await page.goto('/organizacoes/novo')
    await expect(page.getByLabel('Nome')).toBeVisible()

    await page.getByLabel('Nome').fill(orgName)
    await page.getByLabel('Tipo').selectOption('COMPANY')

    // CNPJ field (CnpjInput — renders masked)
    const cnpjInput = page.getByLabel(/cnpj/i)
    await cnpjInput.fill(TEST_CNPJ_FORMATTED)

    await page.getByLabel('E-mail').fill('org@pethub.test')

    await page.getByRole('button', { name: /salvar/i }).click()

    await expect(page).toHaveURL(/\/organizacoes\/[a-z0-9-]+$/, { timeout: 10_000 })
    await expect(page.getByText(orgName)).toBeVisible()
  })
})

test.describe('Adicionar membro via CPF', () => {
  test('OWNER adiciona membro usando CPF', async ({ page }) => {
    // Create org via API for speed
    const { accessToken } = await loginUser(PRIMARY_USER.email, PRIMARY_USER.password)
    // Use a unique CNPJ per run to avoid CNPJ_ALREADY_IN_USE errors
    const cnpj = generateUniqueCnpj()
    const orgId = await createOrganization(accessToken, `Org Membros ${Date.now()}`, cnpj)

    await page.goto(`/organizacoes/${orgId}`)

    // Navigate to member management (OWNER sees "Gerenciar" or dashboard link)
    const manageLink = page.getByRole('link', { name: /gerenciar/i })
    if (await manageLink.isVisible()) {
      await manageLink.click()
    } else {
      await page.goto(`/organizacoes/${orgId}/painel`)
    }

    // Click on Membros tab
    await page.getByRole('tab', { name: /membros/i }).click()

    // Add member via CPF
    const cpfInput = page.getByLabel(/cpf/i)
    await expect(cpfInput).toBeVisible({ timeout: 5_000 })
    await cpfInput.fill(SECONDARY_USER.cpfFormatted)

    await page.getByRole('button', { name: /adicionar/i }).click()

    // Secondary user should now appear in the members list
    await expect(page.getByText(SECONDARY_USER.name)).toBeVisible({ timeout: 8_000 })
  })
})

test.describe('Painel da organização', () => {
  test('painel exibe tabs de Dados, Membros, Pets, Adoções, Achados, Serviços', async ({
    page,
  }) => {
    const { accessToken } = await loginUser(PRIMARY_USER.email, PRIMARY_USER.password)
    const cnpj = generateUniqueCnpj()
    const orgId = await createOrganization(accessToken, `Org Painel ${Date.now()}`, cnpj)

    await page.goto(`/organizacoes/${orgId}/painel`)

    await expect(page.getByRole('tab', { name: /dados/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /membros/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /pets/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /adoções/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /achados/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /serviços/i })).toBeVisible()
  })

  test('tab Dados exibe informações da organização', async ({ page }) => {
    const orgName = `Org Dados ${Date.now()}`
    const { accessToken } = await loginUser(PRIMARY_USER.email, PRIMARY_USER.password)
    const cnpj = generateUniqueCnpj()
    const orgId = await createOrganization(accessToken, orgName, cnpj)

    await page.goto(`/organizacoes/${orgId}/painel`)

    await page.getByRole('tab', { name: /dados/i }).click()
    await expect(page.getByText(orgName)).toBeVisible()
  })
})

/**
 * Generates a unique valid CNPJ per test run by computing check digits
 * from a timestamp-derived 8-digit prefix + "0001" (filial).
 *
 * Format: XXXXXXXX0001YZ where YZ = computed check digits.
 */
function generateUniqueCnpj(): string {
  // Use last 8 digits of current timestamp as company root
  const base8 = String(Date.now()).slice(-8).padStart(8, '1')
  const base12 = `${base8}0001`
  const digits = base12.split('').map(Number)

  const calc = (d: number[], weights: number[]): number => {
    const sum = d.reduce((acc, n, i) => acc + n * weights[i], 0)
    const rem = sum % 11
    return rem < 2 ? 0 : 11 - rem
  }

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const c1 = calc(digits, w1)

  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const c2 = calc([...digits, c1], w2)

  return `${base12}${c1}${c2}`
}
