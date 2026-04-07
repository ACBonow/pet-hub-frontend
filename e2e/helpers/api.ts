/**
 * Direct API helpers for E2E test setup.
 * These bypass the UI to seed test data quickly.
 */

const API_BASE = process.env.E2E_API_URL ?? 'http://localhost:3000'

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: { code: string; message: string }
}

async function post<T>(path: string, body: unknown, token?: string): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  return res.json() as Promise<ApiResponse<T>>
}

async function get<T>(path: string, token?: string): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { headers })
  return res.json() as Promise<ApiResponse<T>>
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface UserData {
  id: string
  email: string
  name: string
}

/** Register a new user. Ignores EMAIL_ALREADY_IN_USE errors. */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  cpf: string,
): Promise<void> {
  const res = await post('/api/v1/auth/register', { name, email, password, cpf })
  if (!res.success && res.error?.code !== 'EMAIL_ALREADY_IN_USE') {
    throw new Error(`Registration failed: ${res.error?.message}`)
  }
}

/** Login and return tokens. Throws if login fails (e.g. EMAIL_NOT_VERIFIED). */
export async function loginUser(email: string, password: string): Promise<AuthTokens> {
  const res = await post<{ accessToken: string; refreshToken: string }>('/api/v1/auth/login', {
    email,
    password,
  })
  if (!res.success || !res.data) {
    throw new Error(
      res.error?.code === 'EMAIL_NOT_VERIFIED'
        ? `Test user "${email}" is not verified.\n` +
            'Manually verify this account in the database before running E2E tests:\n' +
            '  UPDATE "User" SET "emailVerified" = true WHERE email = \'' +
            email +
            "';"
        : `Login failed: ${res.error?.message}`,
    )
  }
  return res.data
}

/** Create a pet via API and return its id. */
export async function createPet(
  accessToken: string,
  name: string,
  species: string = 'dog',
): Promise<string> {
  const res = await post<{ id: string }>('/api/v1/pets', { name, species, tutorshipType: 'OWNER' }, accessToken)
  if (!res.success || !res.data) {
    throw new Error(`Failed to create pet: ${res.error?.message}`)
  }
  return res.data.id
}

/** Create an organization via API and return its id. */
export async function createOrganization(
  accessToken: string,
  name: string,
  cnpj: string,
): Promise<string> {
  const res = await post<{ id: string }>(
    '/api/v1/organizations',
    { name, type: 'COMPANY', cnpj },
    accessToken,
  )
  if (!res.success || !res.data) {
    throw new Error(`Failed to create org: ${res.error?.message}`)
  }
  return res.data.id
}

/** Create an adoption listing via API and return its id. */
export async function createAdoption(
  accessToken: string,
  petId: string,
  contactEmail: string,
): Promise<string> {
  const res = await post<{ id: string }>(
    '/api/v1/adoptions',
    { petId, contactEmail, description: 'E2E test adoption' },
    accessToken,
  )
  if (!res.success || !res.data) {
    throw new Error(`Failed to create adoption: ${res.error?.message}`)
  }
  return res.data.id
}

export { get }
