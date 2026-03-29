# TASK-FE-034 — Indicador Visual de Proprietário nos Cards

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-034 |
| Módulo       | adoption, lost-found, services-directory |
| Prioridade   | Baixa |
| Dependências | TASK-FE-029 (contexto agindo como), TASK-BE-021 (backend retorna info do criador) |
| Status       | Pendente |

## Objetivo
Exibir em cada card de adoção, achado/perdido e serviço quem o publicou — pessoa física (nome) ou organização (nome + logo). Isso dá credibilidade e contexto ao visitante.

## Contexto
Com a TASK-BE-021, os endpoints de listagem passam a incluir dados do criador:
```json
{
  "createdBy": {
    "type": "person" | "org",
    "name": "Nome da Pessoa" | "Nome da Org",
    "photoUrl": null | "https://..."
  }
}
```

## Escopo

### Componente compartilhado `src/shared/components/ui/CreatorBadge.tsx`
```tsx
interface CreatorBadgeProps {
  type: 'person' | 'org'
  name: string
  photoUrl?: string | null
}

// Renders: [avatar/inicial] Nome da Pessoa
//       ou [logo da org] Nome da Org
```
- Avatar circular: foto se disponível, inicial do nome se não
- Ícone de pessoa para `type='person'`, ícone de prédio para `type='org'`
- Tamanho pequeno (24px avatar + texto xs)

### Integração nos cards

#### `AdoptionCard.tsx`
- Adicionar `<CreatorBadge />` no rodapé do card

#### `LostFoundCard.tsx`
- Adicionar `<CreatorBadge />` no rodapé do card

#### `ServiceCard.tsx`
- Adicionar `<CreatorBadge />` no rodapé do card (abaixo do badge de tipo)

### Atualização dos tipos
```typescript
// adoption/types/index.ts, lost-found/types/index.ts, services-directory/types/index.ts
export interface CreatorInfo {
  type: 'person' | 'org'
  name: string
  photoUrl?: string | null
}

// Adicionar campo em cada listing type:
createdBy?: CreatorInfo
```

## Testes
Arquivo: `src/shared/__tests__/CreatorBadge.test.tsx`

- [ ] Teste: `type='person'` exibe nome e ícone de pessoa
- [ ] Teste: `type='org'` exibe nome e ícone/logo de org
- [ ] Teste: sem `photoUrl` exibe inicial do nome
- [ ] Teste: com `photoUrl` exibe imagem

Arquivo: `src/modules/adoption/__tests__/AdoptionCard.test.tsx` (adicionar)
- [ ] Teste: card com `createdBy` exibe `CreatorBadge`
- [ ] Teste: card sem `createdBy` não quebra (campo opcional)

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Criar     | `src/shared/components/ui/CreatorBadge.tsx` |
| Criar     | `src/shared/__tests__/CreatorBadge.test.tsx` |
| Modificar | `src/modules/adoption/types/index.ts` |
| Modificar | `src/modules/adoption/components/AdoptionCard.tsx` |
| Modificar | `src/modules/lost-found/types/index.ts` |
| Modificar | `src/modules/lost-found/components/LostFoundCard.tsx` |
| Modificar | `src/modules/services-directory/types/index.ts` |
| Modificar | `src/modules/services-directory/components/ServiceCard.tsx` |

## Critérios de Aceite
- [ ] `CreatorBadge` renderiza corretamente para pessoa e organização
- [ ] Cards de adoção, achados/perdidos e serviços exibem `CreatorBadge`
- [ ] Campo `createdBy` ausente não quebra o card (graceful degradation)
- [ ] Todos os testes existentes continuam passando
