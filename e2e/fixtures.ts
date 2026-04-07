/**
 * Shared fixtures for E2E tests.
 * NOT a test file — can be imported by any spec or setup file.
 */

import { fileURLToPath } from 'url'
import * as path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const PRIMARY_USER = {
  email: process.env.E2E_PRIMARY_EMAIL ?? 'e2e-primary@pethub.test',
  password: process.env.E2E_PRIMARY_PASSWORD ?? 'Teste@12345',
  name: 'E2E Primário',
  cpf: '52998224725',
  cpfFormatted: '529.982.247-25',
}

export const SECONDARY_USER = {
  email: process.env.E2E_SECONDARY_EMAIL ?? 'e2e-secondary@pethub.test',
  password: process.env.E2E_SECONDARY_PASSWORD ?? 'Teste@12345',
  name: 'E2E Secundário',
  cpf: '11144477735',
  cpfFormatted: '111.444.777-35',
}

export const PRIMARY_AUTH_FILE = path.join(__dirname, '../.auth/primary.json')
export const SECONDARY_AUTH_FILE = path.join(__dirname, '../.auth/secondary.json')
