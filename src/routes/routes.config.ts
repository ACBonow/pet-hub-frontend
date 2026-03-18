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
  ADOPTION: {
    LIST: '/adocao',
    DETAIL: (id: string) => `/adocao/${id}`,
  },
  LOST_FOUND: {
    LIST: '/achados-perdidos',
    CREATE: '/achados-perdidos/novo',
    DETAIL: (id: string) => `/achados-perdidos/${id}`,
  },
} as const
