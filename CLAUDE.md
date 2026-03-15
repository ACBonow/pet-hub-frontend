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
8. **Navegação mobile é sempre BottomNav** (`shared/components/layout/BottomNav.tsx`), não menu hambúrguer.
9. **Inputs de CPF e CNPJ** devem usar os componentes compartilhados (`CpfInput.tsx`, `CnpjInput.tsx`) com `inputMode="numeric"`.
10. **Erros de validação são exibidos inline** no campo, em português, nunca como alert/toast para erros de formulário.

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

## O que o Claude NÃO deve fazer

- Não modifique `shared/validators/` sem atualizar também o arquivo de testes.
- Não adicione uma nova dependência sem mencionar explicitamente para o desenvolvedor instalar.
- Não use `fetch` ou `axios` diretamente em componentes ou hooks — use o api.client.
- Não crie um novo componente de input para CPF/CNPJ — use os compartilhados em `shared/components/forms/`.
- Não use `getByTestId` como primeira escolha em testes — prefira queries semânticas.
- Não implemente navegação com sidebar no mobile — use sempre BottomNav.
- Não adicione breakpoints antes de escrever o estilo mobile base.

---

## Fluxo Git Obrigatório por Task

Antes de iniciar qualquer task:
```bash
git checkout main && git pull origin main
git checkout -b TASK-FE-XXX
```

Ao concluir a task (todos os testes passando):
```bash
git add <arquivos específicos>
git commit -m "type(scope): descrição"
git push origin TASK-FE-XXX
gh pr create --base homologacao --title "[TASK-FE-XXX] Descrição" --body "..."
```

Regras:
- Nunca commitar diretamente em `main` ou `homologacao`.
- Sempre criar o branch a partir de `main` atualizada.
- PR target é sempre `homologacao`.

---

## Pedindo Esclarecimento

Se uma solicitação for ambígua sobre qual componente usar, como gerenciar estado, ou qual módulo um feature pertence — pergunte antes de implementar.
