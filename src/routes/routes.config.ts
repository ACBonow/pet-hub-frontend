export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
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
    EDIT: (id: string) => `/organizacoes/${id}/editar`,
    DASHBOARD: (id: string) => `/organizacoes/${id}/painel`,
  },
  PET: {
    LIST: '/pets',
    CREATE: '/pets/novo',
    DETAIL: (id: string) => `/pets/${id}`,
    EDIT: (id: string) => `/pets/${id}/editar`,
    HEALTH: (id: string) => `/pets/${id}/health`,
  },
  ADOPTION: {
    LIST: '/adocao',
    CREATE: '/adocao/novo',
    DETAIL: (id: string) => `/adocao/${id}`,
  },
  LOST_FOUND: {
    LIST: '/achados-perdidos',
    CREATE: '/achados-perdidos/novo',
    DETAIL: (id: string) => `/achados-perdidos/${id}`,
  },
  AUTH: {
    VERIFY_EMAIL: '/verificar-email',
    CHECK_EMAIL: '/verificar-email/enviado',
    FORGOT_PASSWORD: '/esqueci-senha',
    FORGOT_PASSWORD_SENT: '/esqueci-senha/enviado',
    RESET_PASSWORD: '/redefinir-senha',
  },
  PROFILE: '/perfil',
  SERVICES: {
    LIST: '/servicos',
    DETAIL: (id: string) => `/servicos/${id}`,
    CREATE: '/servicos/novo',
  },
} as const
