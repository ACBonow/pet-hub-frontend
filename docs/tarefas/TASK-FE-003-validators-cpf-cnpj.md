# TASK-FE-003 — Validators CPF e CNPJ (Frontend)

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-003 |
| Módulo       | shared/validators |
| Prioridade   | Alta |
| Dependências | TASK-FE-001 |
| Status       | Pendente |

## Objetivo
Implementar validators de CPF e CNPJ no frontend com o mesmo algoritmo do backend, permitindo validação client-side antes da chamada de API.

## Contexto
- Mesmo algoritmo do backend — validação client-side reduz latência em redes móveis.
- `CpfInput.tsx` e `CnpjInput.tsx` usam esses validators com react-hook-form + zod.
- Máscara visual: CPF `000.000.000-00`, CNPJ `00.000.000/0000-00`.
- Armazenamento/envio: apenas dígitos (sem formatação).

## Checklist

### Pré-requisitos
- [ ] TASK-FE-001 concluída

### Red — Testes falhando primeiro
- [ ] Criar `src/shared/validators/__tests__/cpf.validator.test.ts` (mesmos casos de borda do backend)
- [ ] Criar `src/shared/validators/__tests__/cnpj.validator.test.ts` (mesmos casos de borda do backend)
- [ ] Criar `src/shared/components/forms/__tests__/CpfInput.test.tsx`
  - [ ] Teste: aplica máscara ao digitar
  - [ ] Teste: exibe erro "CPF inválido" para CPF inválido após blur
  - [ ] Teste: não exibe erro para CPF válido
- [ ] Criar `src/shared/components/forms/__tests__/CnpjInput.test.tsx`
  - [ ] Teste: aplica máscara ao digitar
  - [ ] Teste: exibe erro "CNPJ inválido" para CNPJ inválido após blur
- [ ] Confirmar que todos os testes falham

### Green — Implementação mínima
- [ ] Criar `src/shared/validators/cpf.validator.ts`
- [ ] Criar `src/shared/validators/cnpj.validator.ts`
- [ ] Criar `src/shared/components/forms/CpfInput.tsx` (com máscara e integração react-hook-form)
- [ ] Criar `src/shared/components/forms/CnpjInput.tsx`
- [ ] Confirmar que todos os testes passam

### Refactor
- [ ] Extrair helper de máscara para `src/shared/utils/mask.ts` reutilizável

### Finalização
- [ ] Todos os testes passando
- [ ] Coverage 100% nos validators
- [ ] PR aberto com descrição

## Arquivos a Criar / Modificar

| Ação  | Arquivo |
|-------|---------|
| Criar | `src/shared/validators/cpf.validator.ts` |
| Criar | `src/shared/validators/cnpj.validator.ts` |
| Criar | `src/shared/validators/__tests__/cpf.validator.test.ts` |
| Criar | `src/shared/validators/__tests__/cnpj.validator.test.ts` |
| Criar | `src/shared/components/forms/CpfInput.tsx` |
| Criar | `src/shared/components/forms/CnpjInput.tsx` |
| Criar | `src/shared/components/forms/__tests__/CpfInput.test.tsx` |
| Criar | `src/shared/components/forms/__tests__/CnpjInput.test.tsx` |
| Criar | `src/shared/utils/mask.ts` |

## Critérios de Aceite
- [ ] Mesmo resultado que o validator do backend para os mesmos inputs
- [ ] Máscara aplicada visualmente sem afetar o valor enviado à API
- [ ] Erro exibido inline no campo, em português
- [ ] `inputMode="numeric"` em ambos os inputs
