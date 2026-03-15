# PetHUB Frontend — Coding Guidelines

Veja também: `pet-hub-backend/GUIDELINES.md` para as diretrizes gerais do projeto.

---

## Stack Técnica

- **Framework**: React + TypeScript (strict mode)
- **Bundler**: Vite
- **Estilos**: Tailwind CSS (mobile-first, utility-first)
- **Formulários**: react-hook-form + zod resolver
- **Estado global**: Zustand
- **HTTP client**: axios ou fetch com wrapper tipado em `shared/services/api.client.ts`
- **Testes**: Jest + React Testing Library
- **Deploy**: Vercel

---

## Estrutura de Pastas

```
src/
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── __tests__/
│   ├── person/
│   ├── organization/
│   ├── pet/
│   ├── adoption/
│   ├── lost-found/
│   ├── pet-health/
│   └── services-directory/
├── shared/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Spinner.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── BottomNav.tsx   ← navegação principal no mobile
│   │   │   ├── Header.tsx
│   │   │   └── PageWrapper.tsx
│   │   └── forms/
│   │       ├── CpfInput.tsx
│   │       └── CnpjInput.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── services/
│   │   └── api.client.ts
│   ├── validators/
│   │   ├── cpf.validator.ts
│   │   └── cnpj.validator.ts
│   └── types/
│       └── index.ts
├── routes/
│   ├── index.tsx
│   ├── PrivateRoute.tsx
│   └── routes.config.ts
├── store/
│   └── index.ts
├── styles/
│   ├── globals.css
│   └── tokens.css
├── App.tsx
└── main.tsx
```

---

## Naming Conventions

### Arquivos e Componentes

| Tipo               | Convenção   | Exemplo                      |
|--------------------|-------------|------------------------------|
| Componente React   | PascalCase  | `PetCard.tsx`                |
| Hook personalizado | camelCase   | `usePetHealth.ts`            |
| Service            | camelCase   | `pet.service.ts`             |
| Store slice        | camelCase   | `authSlice.ts`               |
| Tipos              | `index.ts`  | `modules/pet/types/index.ts` |
| Arquivo de teste   | `.test.tsx` | `PetCard.test.tsx`           |

---

## Mobile-First

Toda decisão de UI parte do mobile.

### Breakpoints (Tailwind)

```
default (sem prefixo) → mobile
sm:  640px  → celulares grandes
md:  768px  → tablets
lg:  1024px → laptops
xl:  1280px → desktops
```

### Navegação

- **Mobile**: `BottomNav.tsx` — barra de navegação inferior (não menu hambúrguer).
- **Desktop**: Sidebar ou top nav via `AppShell.tsx`.
- Touch targets mínimos: `min-h-[44px] min-w-[44px]`

### Formulários Mobile

- Inputs full-width: `w-full`
- Campo CPF: `inputMode="numeric"` + máscara `000.000.000-00`
- Campo CNPJ: `inputMode="numeric"` + máscara `00.000.000/0000-00`
- Botões de submit: full-width, altura mínima 48px

---

## Component Rules

1. Componentes são **dumb by default** — recebem dados via props, não chamam API diretamente.
2. Toda lógica de estado e chamadas de API ficam em **hooks**.
3. Hooks chamam **services**; services chamam o **api.client**.
4. Use **default exports** para componentes React. **Named exports** para o resto.
5. Props de componentes devem ser tipadas com interfaces (`interface PetCardProps { ... }`).

---

## Formulários

Use sempre `react-hook-form` com `zod` resolver:

```typescript
const schema = z.object({
  cpf: z.string().refine(validateCpf, { message: 'CPF inválido' }),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

Erros de validação são exibidos **inline** no campo, em português.

---

## Git Workflow

Veja `GUIDELINES.md` do backend para o fluxo completo. Resumo:

- Branches permanentes: `main` e `homologacao`
- Cada task tem seu próprio branch: `TASK-FE-XXX` criado a partir de `main`
- PRs vão sempre para `homologacao`, nunca diretamente para `main`
- Título do PR: `[TASK-FE-XXX] Descrição curta`

---

## Testes (Frontend)

### Regras

1. Teste o comportamento do componente, não sua implementação interna.
2. Use `getByRole`, `getByLabelText`, `getByText` — não `getByTestId` como primeira opção.
3. Simule interações com `userEvent` (não `fireEvent`).
4. Services são sempre mockados nos testes de componente.
5. Hooks personalizados são testados com `renderHook`.

### Exemplo

```typescript
describe('CpfInput', () => {
  it('should show error message for invalid CPF', async () => {
    render(<CpfInput />)
    await userEvent.type(screen.getByLabelText('CPF'), '111.111.111-11')
    await userEvent.tab()
    expect(screen.getByText('CPF inválido')).toBeInTheDocument()
  })
})
```

---

## Estado Global (Zustand)

- Use Zustand para estado compartilhado entre módulos (ex.: usuário autenticado, tema).
- Estado local de componente/página fica no `useState` / `useReducer` do próprio componente.
- Cada módulo que precisar de estado global cria seu próprio slice em `modules/<name>/store/`.

---

## API Client

Todas as chamadas de API passam por `shared/services/api.client.ts`. Nunca use `fetch` ou `axios` diretamente em componentes ou hooks — use sempre funções de service que usam o api.client.

O api.client:
- Injeta o base URL da variável de ambiente `VITE_API_BASE_URL`
- Injeta o token JWT no header `Authorization`
- Converte respostas de erro para objetos `ApiError` tipados
- Lida com refresh automático de token quando o access token expira

---

## Validadores (Frontend)

Os validadores de CPF e CNPJ do frontend (`shared/validators/`) devem implementar o **mesmo algoritmo** que o backend. Isso permite validação client-side antes da chamada de API, reduzindo latência em redes móveis.

---

## Performance

- Todas as imagens de pets: `loading="lazy"` + dimensões definidas.
- Listas longas (adoção, diretório): virtualização ou paginação — nunca renderize tudo.
- Code splitting por módulo via `React.lazy` + `Suspense`.
- Evite re-renders desnecessários: use `useMemo` e `useCallback` onde há evidência de problema, não preventivamente.