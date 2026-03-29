# TASK-FE-029 — Contexto "Agindo Como": seletor pessoal vs. organização

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-029 |
| Módulo       | shared, pet, adoption, lost-found, services-directory |
| Prioridade   | Alta |
| Dependências | TASK-FE-028 (roles UI), TASK-BE-021 (contexto agindo como no backend) |
| Status       | Pendente |

## Objetivo
Criar hook `useActingAs` e componente `ActingAsSelector` que permitem ao usuário escolher se está criando um recurso como pessoa física ou em nome de uma organização. O contexto é enviado como `organizationId` no payload da requisição quando uma org é selecionada.

## Contexto
O usuário pode ser responsável de múltiplas organizações. Ao criar pets, adoções, achados/perdidos ou serviços, deve poder escolher o "dono" do recurso. O seletor só aparece para usuários que são membros (OWNER ou MANAGER) de pelo menos uma organização.

## Escopo

### 1. `src/shared/hooks/useActingAs.ts`
```typescript
interface ActingAsContext {
  type: 'person' | 'org'
  organizationId?: string
  organizationName?: string
}

// Retorna contexto atual + lista de orgs disponíveis + setter
export function useActingAs(): {
  context: ActingAsContext
  availableOrgs: { id: string; name: string }[]
  setContext: (ctx: ActingAsContext) => void
}
```
- Busca organizações do usuário via `GET /api/v1/organizations/my` filtrando apenas onde `myRole` é OWNER ou MANAGER
- Estado persiste em Zustand (não resetar ao navegar)
- Valor padrão: `{ type: 'person' }`

### 2. `src/shared/components/ui/ActingAsSelector.tsx`
Componente de seleção:
```tsx
// Renders como:
// "Criar como: [Eu ▼]" ou "Criar como: [Nome da Org ▼]"
// Dropdown com opções: "Eu (pessoal)" + cada org onde é OWNER/MANAGER
```
- Só renderiza se `availableOrgs.length > 0`
- Mobile-first: toque abre select nativo (`<select>`)

### 3. Integrar nas páginas de criação
Adicionar `<ActingAsSelector />` nas seguintes páginas, acima do formulário:
- `PetFormPage.tsx`
- `AdoptionFormPage.tsx`
- `LostFoundFormPage.tsx`
- `ServiceFormPage.tsx`

### 4. Enviar `organizationId` no payload
Cada formulário deve incluir `organizationId: context.organizationId` no payload quando `context.type === 'org'`.

## Testes

### `src/shared/__tests__/useActingAs.test.ts`
- [ ] Retorna `{ type: 'person' }` por padrão
- [ ] Quando usuário tem orgs, `availableOrgs` é preenchido
- [ ] `setContext` atualiza o contexto
- [ ] Usuário sem orgs: `availableOrgs` vazio, seletor não renderiza

### `src/shared/__tests__/ActingAsSelector.test.tsx`
- [ ] Não renderiza quando `availableOrgs` vazio
- [ ] Renderiza dropdown com opções corretas
- [ ] Seleção de org chama `setContext` com `{ type: 'org', organizationId, organizationName }`

### `src/modules/adoption/__tests__/AdoptionFormPage.test.tsx`
- [ ] Seletor de org aparece quando usuário tem orgs
- [ ] `organizationId` incluído no payload quando org selecionada

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/shared/hooks/useActingAs.ts` |
| Criar     | `src/shared/components/ui/ActingAsSelector.tsx` |
| Criar     | `src/shared/__tests__/useActingAs.test.ts` |
| Criar     | `src/shared/__tests__/ActingAsSelector.test.tsx` |
| Modificar | `src/modules/pet/pages/PetFormPage.tsx` |
| Modificar | `src/modules/adoption/pages/AdoptionFormPage.tsx` |
| Modificar | `src/modules/lost-found/pages/LostFoundFormPage.tsx` |
| Modificar | `src/modules/services-directory/pages/ServiceFormPage.tsx` |

## Critérios de Aceite
- [ ] Seletor só aparece para usuários com OWNER/MANAGER em pelo menos 1 org
- [ ] Seleção de org inclui `organizationId` no payload enviado ao backend
- [ ] Seleção "Eu" omite `organizationId` do payload
- [ ] Contexto persiste ao navegar entre páginas (Zustand)
- [ ] Todos os testes existentes continuam passando
