# TASK-FE-031 — Foto de Serviço: exibição e upload

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-031 |
| Módulo       | services-directory |
| Prioridade   | Média |
| Dependências | TASK-FE-011 (módulo services), TASK-BE-023 (endpoint de upload) |
| Status       | Pendente |

## Objetivo
Exibir foto de capa para serviços no `ServiceCard` e `ServiceDetailPage`. Adicionar input de upload no `ServiceForm` para o criador ou responsável da organização.

## Contexto
Segue o padrão de upload já implementado para pets e organizações. Foto é opcional — serviços sem foto exibem placeholder.

## Escopo

### 1. `src/modules/services-directory/components/ServiceCard.tsx`
- Adicionar imagem de capa no card: se `photoUrl` presente, exibir; senão, placeholder com cor do tipo de serviço.

### 2. `src/modules/services-directory/components/ServiceDetailPage.tsx`
- Exibir foto grande no topo.
- Para criador/OWNER/MANAGER logado: botão "Alterar foto".

### 3. `src/modules/services-directory/components/ServiceForm.tsx`
- Adicionar input de foto opcional.
- Preview antes do upload.
- Upload via `PATCH /api/v1/services/:id/photo` após salvar dados.

### 4. `src/modules/services-directory/services/services-directory.service.ts`
Adicionar:
```typescript
uploadServicePhoto(serviceId: string, file: File): Promise<{ photoUrl: string }>
```

## Testes
Arquivo: `src/modules/services-directory/__tests__/ServiceForm.test.tsx`

- [ ] Teste: input de foto presente no formulário
- [ ] Teste: preview exibido ao selecionar arquivo
- [ ] Teste: `uploadServicePhoto` chamado após salvar dados quando arquivo selecionado
- [ ] Teste: `ServiceCard` exibe imagem quando `photoUrl` presente
- [ ] Teste: `ServiceCard` exibe placeholder quando sem foto

## Arquivos a Criar / Modificar

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/modules/services-directory/components/ServiceCard.tsx` |
| Modificar | `src/modules/services-directory/components/ServiceDetailPage.tsx` |
| Modificar | `src/modules/services-directory/components/ServiceForm.tsx` |
| Modificar | `src/modules/services-directory/services/services-directory.service.ts` |
| Modificar | `src/modules/services-directory/__tests__/ServiceForm.test.tsx` |

## Critérios de Aceite
- [ ] Serviço com foto exibe imagem no card e no detalhe
- [ ] Serviço sem foto exibe placeholder com cor do tipo
- [ ] Criador ou OWNER/MANAGER da org pode fazer upload
- [ ] Preview antes do upload
- [ ] Todos os testes existentes continuam passando
