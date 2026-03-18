export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PERSON: {
    LIST: '/pessoas',
    CREATE: '/pessoas/novo',
    DETAIL: (id: string) => `/pessoas/${id}`,
    EDIT: (id: string) => `/pessoas/${id}/editar`,
  },
  ORGANIZATION: {
    LIST: '/organizacoes',
    CREATE: '/organizacoes/novo',
    DETAIL: (id: string) => `/organizacoes/${id}`,
  },
  PET: {
    LIST: '/pets',
    CREATE: '/pets/novo',
    DETAIL: (id: string) => `/pets/${id}`,
  },
} as const
