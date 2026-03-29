# TASK-FE-026 — ContactGate nas páginas de Lost & Found

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-026 |
| Módulo       | lost-found |
| Prioridade   | Alta |
| Dependências | TASK-FE-009 (módulo lost-found), TASK-BE-011 (backend) |
| Status       | Pendente |

## Objetivo
Aplicar o componente `ContactGate` nos dados de contato do `LostFoundDetailPage`, ocultando e-mail e telefone para visitantes não autenticados e exibindo link de login com `returnTo`.

## Contexto
O `ContactGate` já existe em `shared/components/ui/ContactGate.tsx` e está em uso no módulo de adoção. O padrão é:
- `value={null}` → não renderiza nada
- Autenticado → exibe o valor diretamente
- Não autenticado → exibe link `"/login?returnTo=<path atual>"`

Regra de negócio (ver `REGRAS-DE-NEGOCIO.md`, seção 7.1): visitantes veem info básica + localização, mas contato fica protegido.

## Escopo

### `src/modules/lost-found/components/LostFoundDetailPage.tsx` (ou nome real do arquivo)
Substituir exibição direta de contato por `ContactGate`:

```tsx
// Antes
<p>{report.contactEmail}</p>
<p>{report.contactPhone}</p>

// Depois
<ContactGate value={report.contactEmail} />
<ContactGate value={report.contactPhone} />
```

### Dados que devem ficar atrás do ContactGate
- E-mail de contato (`contactEmail`)
- Telefone de contato (`contactPhone`)

### Dados que permanecem públicos
- Tipo (LOST / FOUND)
- Espécie, nome do animal
- Localização / endereço (bairro, cidade)
- Data do reporte
- Foto do animal (se houver)
- Status (OPEN / RESOLVED)

## Testes
Arquivo: `src/modules/lost-found/__tests__/LostFoundDetailPage.test.tsx` (adicionar aos testes existentes)

- [ ] Teste: visitante não autenticado NÃO vê e-mail nem telefone
- [ ] Teste: visitante não autenticado vê link de login com `returnTo` correto
- [ ] Teste: usuário autenticado VÊ e-mail e telefone
- [ ] Teste: localização e status permanecem visíveis para ambos os casos
- [ ] Confirmar que os testes falham (red), implementar (green)

## Arquivos a Modificar

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/modules/lost-found/components/LostFoundDetailPage.tsx` (ou equivalente) |
| Modificar | `src/modules/lost-found/__tests__/LostFoundDetailPage.test.tsx` |

## Critérios de Aceite
- [ ] Contato oculto para visitante não autenticado
- [ ] Link de login com `?returnTo=` correto exibido no lugar do contato
- [ ] Contato visível para usuário autenticado
- [ ] Localização e status sempre visíveis
- [ ] Todos os testes existentes continuam passando
