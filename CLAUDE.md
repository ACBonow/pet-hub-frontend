# CLAUDE.md — Instruções para o Claude AI no PetHUB (Frontend)

Leia este arquivo integralmente antes de escrever qualquer código ou fazer qualquer modificação.

---

## O que é este projeto?

PetHUB é um sistema web brasileiro de gerenciamento de vida do pet (petcare / saúde animal), com interface mobile-first responsiva. Este repositório é o **frontend React**.

---

## Repositórios

- **Frontend** (este repo): React + TypeScript, Vercel
- **Backend**: Node.js + TypeScript, Vercel serverless

---

## Stack Técnica

- **Framework**: React + TypeScript (strict mode)
- **Bundler**: Vite
- **Estilos**: Tailwind CSS
- **Formulários**: react-hook-form + zod resolver
- **Estado global**: Zustand
- **HTTP**: api.client wrapper em `shared/services/api.client.ts`
- **Testes**: Jest + React Testing Library
- **Deploy**: Vercel

---

## Regras Inegociáveis

1. **TDD é obrigatório.** Escreva o teste antes de implementar o componente ou hook.
2. **Componentes não chamam API diretamente.** Toda chamada de API passa por services → api.client.
3. **Toda lógica de negócio fica em hooks ou services**, não em componentes.
4. **Nunca use `any` sem um comentário explicando o motivo.**
5. **Toda validação de CPF/CNPJ deve usar** `shared/validators/` — nunca implemente inline.
6. **Texto voltado ao usuário deve ser em português brasileiro.** Identificadores de código são inglês.
7. **Mobile-first:** Escreva os estilos Tailwind sem prefixo de breakpoint primeiro (mobile), depois adicione `sm:`, `md:`, `lg:` para telas maiores.
8. **Navegação usa dois layouts distintos — nunca misture:**
   - `PublicLayout` (páginas públicas): `TopNav` no desktop + `BottomNav` no mobile.
   - `AppShell` (páginas autenticadas): `Header` de página + `BottomNav` no mobile.
   - `BottomNav` é **auth-aware**: tabs diferentes para usuários logados e não-logados.
   - Nunca use menu hambúrguer ou sidebar — mobile é sempre `BottomNav`.
9. **Inputs de CPF e CNPJ** devem usar os componentes compartilhados (`CpfInput.tsx`, `CnpjInput.tsx`) com `inputMode="numeric"`.
10. **Erros de validação são exibidos inline** no campo, em português, nunca como alert/toast para erros de formulário.
11. **Contato em páginas públicas** deve sempre usar `ContactGate` (`shared/components/ui/ContactGate.tsx`) — nunca exibir dados de contato diretamente sem gate de autenticação. Isso se aplica a **todos os módulos**: adoção (email, telefone, WhatsApp), achados/perdidos (email, telefone) e serviços (telefone, WhatsApp, email, endereço completo, redes sociais, links de mapa).
12. **Páginas de criação de recursos** (pet, adoção, achado/perdido, serviço) devem incluir `<ActingAsSelector />` (`shared/components/ui/ActingAsSelector.tsx`) quando o usuário for OWNER ou MANAGER de alguma organização. O componente só se renderiza quando há organizações disponíveis. O `organizationId` selecionado deve ser incluído no payload da requisição.
13. **Visibilidade de ações de organização é controlada pelo papel do usuário.** Use o campo `myRole` retornado pela API: OWNER vê editar/excluir/membros; MANAGER vê apenas ações operacionais; MEMBER não vê controles administrativos. Nunca hardcode visibilidade sem verificar o papel.

---

## Como Adicionar um Novo Módulo (Frontend)

Siga esta sequência:

1. Crie a pasta: `src/modules/<module-name>/`
2. Crie `types/index.ts` — defina todas as interfaces TypeScript primeiro.
3. Escreva os testes em `__tests__/` — devem falhar (red).
4. Crie `services/<module-name>.service.ts` — funções que chamam o api.client.
5. Crie `hooks/use<ModuleName>.ts` — hook que combina estado e service.
6. Crie os componentes em `components/` — orientados a props, sem lógica de API.
7. Se precisar de estado global: `store/<module-name>Slice.ts`.
8. Exporte a superfície pública em `src/modules/<module-name>/index.ts`.
9. Adicione a rota em `src/routes/routes.config.ts`.

---

## Regras de Componentes

```typescript
// CORRETO: componente dumb, recebe dados via props
export default function PetCard({ pet, onTransfer }: PetCardProps) {
  return <div>...</div>
}

// ERRADO: componente faz chamada de API diretamente
export default function PetCard({ petId }: { petId: string }) {
  const [pet, setPet] = useState(null)
  useEffect(() => { fetch(`/api/v1/pets/${petId}`).then(...) }, []) // NÃO FAÇA ISSO
  return <div>...</div>
}
```

---

## Regras de Formulários

Sempre use `react-hook-form` com `zod` resolver:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { validateCpf } from '@/shared/validators/cpf.validator'

const schema = z.object({
  cpf: z.string().refine(validateCpf, { message: 'CPF inválido' }),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})
```

---

## Regras de Testes

```typescript
// CORRETO: testa comportamento
it('should display error when CPF is invalid', async () => {
  render(<PersonForm />)
  await userEvent.type(screen.getByLabelText('CPF'), '111.111.111-11')
  await userEvent.click(screen.getByRole('button', { name: /salvar/i }))
  expect(screen.getByText('CPF inválido')).toBeInTheDocument()
})

// ERRADO: testa implementação interna
it('should call validateCpf with the input value', () => {
  // Não teste detalhes de implementação
})
```

---

## Variáveis de Ambiente

```
VITE_API_BASE_URL=http://localhost:3000
```

Nunca hardcode URLs de API. Sempre use `import.meta.env.VITE_API_BASE_URL`.

---

## Componentes Compartilhados Relevantes

| Componente | Caminho | Uso |
|-----------|---------|-----|
| `ContactGate` | `shared/components/ui/ContactGate.tsx` | Ocultar contato para não-autenticados |
| `ActingAsSelector` | `shared/components/ui/ActingAsSelector.tsx` | Seletor "Criar como: Eu / Org" nas pages de criação |
| `CreatorBadge` | `shared/components/ui/CreatorBadge.tsx` | Exibir criador (pessoa ou org) em cards |
| `CpfInput` | `shared/components/forms/CpfInput.tsx` | Input CPF com máscara |
| `CnpjInput` | `shared/components/forms/CnpjInput.tsx` | Input CNPJ com máscara |

## Hooks Compartilhados Relevantes

| Hook | Caminho | Uso |
|------|---------|-----|
| `useActingAs` | `shared/hooks/useActingAs.ts` | Contexto "agindo como" (pessoa vs. org) |
| `useAuth` | `modules/auth/hooks/useAuth.ts` | Estado de autenticação |
| `useDebounce` | `shared/hooks/useDebounce.ts` | Debounce de inputs de busca |

## O que o Claude NÃO deve fazer

- Não modifique `shared/validators/` sem atualizar também o arquivo de testes.
- Não adicione uma nova dependência sem mencionar explicitamente para o desenvolvedor instalar.
- Não use `fetch` ou `axios` diretamente em componentes ou hooks — use o api.client.
- Não crie um novo componente de input para CPF/CNPJ — use os compartilhados em `shared/components/forms/`.
- Não use `getByTestId` como primeira escolha em testes — prefira queries semânticas.
- Não implemente navegação com sidebar ou hambúrguer no mobile — use sempre BottomNav.
- Não adicione breakpoints antes de escrever o estilo mobile base.
- Não exiba dados de contato em páginas públicas sem `ContactGate` — isso vale para TODOS os módulos (adoção, achados/perdidos, serviços), não apenas adoção.
- Não use `AppShell` em páginas públicas — use `PublicLayout`.
- Não use `PublicLayout` em páginas autenticadas — use `AppShell`.
- Não implemente lógica de controle de visibilidade de ações de org sem verificar `myRole` — nunca assuma o papel.
- Não adicione `organizationId` ao payload sem usar `useActingAs` — nunca leia org context diretamente do store.

---

## Fluxo Git por Task

Ao concluir a task (todos os testes passando):
```bash
git add <arquivos específicos>
git commit -m "type(scope): descrição"
git push origin main
```

Regras:
- Commitar diretamente em `main`.
- Nunca usar feature branches ou PRs.

---

## Planejamento de Tasks

Sempre que uma nova task for planejada (adicionada ao `docs/tarefas/`), é **obrigatório** criar o item correspondente via `TaskCreate` para ambos os repositórios (backend e frontend), mesmo que a task de frontend seja dependente ou futura.

---

## Pedindo Esclarecimento

Se uma solicitação for ambígua sobre qual componente usar, como gerenciar estado, ou qual módulo um feature pertence — pergunte antes de implementar.
