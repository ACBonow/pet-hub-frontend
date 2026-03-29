# TASK-FE-027 — ContactGate nas páginas de Services Directory

## Informações
| Campo        | Valor |
|--------------|-------|
| ID           | TASK-FE-027 |
| Módulo       | services-directory |
| Prioridade   | Alta |
| Dependências | TASK-FE-011 (módulo services), TASK-BE-013 (backend) |
| Status       | Pendente |

## Objetivo
Aplicar `ContactGate` em todos os dados de contato do `ServiceDetailPage`, garantindo que telefone, WhatsApp, e-mail, endereço completo e redes sociais sejam exibidos apenas para usuários autenticados.

## Contexto
O `ServiceDetailPage` é uma rota pública (`PublicLayout`). A nota em CLAUDE.md confirma: "ServiceDetailPage (pública): exibe contato (phone/email/address) via ContactGate — requer login para ver". Verificar se a implementação atual já faz isso ou se ainda falta.

Regra de negócio (ver `REGRAS-DE-NEGOCIO.md`, seção 8.1): visitantes veem nome, tipo e descrição; contato e localização ficam protegidos.

## Escopo

### `src/modules/services-directory/components/ServiceDetailPage.tsx`

Campos atrás do `ContactGate`:
- Telefone (`phone`)
- WhatsApp (`whatsapp`)
- E-mail (`email`)
- Endereço completo (rua, número, complemento, bairro, CEP, cidade, estado)
- Redes sociais (Instagram, Facebook, TikTok, YouTube)
- Google Maps URL / Google Business URL
- Website

Campos sempre públicos:
- Nome do serviço
- Tipo de serviço (badge colorido)
- Descrição
- Foto de capa (quando implementada)

### `src/modules/services-directory/components/ServiceCard.tsx`
O card de listagem NÃO exibe dados de contato (apenas nome, tipo, descrição + link para detalhe) — confirmar que está correto e não há dados de contato no card.

## Testes
Arquivo: `src/modules/services-directory/__tests__/ServiceDetailPage.test.tsx`

- [ ] Teste: visitante não autenticado vê nome, tipo, descrição
- [ ] Teste: visitante não autenticado NÃO vê telefone, e-mail, endereço, redes sociais
- [ ] Teste: visitante não autenticado vê links de login com `returnTo` correto
- [ ] Teste: usuário autenticado vê todos os dados de contato
- [ ] Confirmar que os testes falham (red), implementar (green)

## Arquivos a Modificar

| Ação      | Arquivo |
|-----------|---------|
| Modificar | `src/modules/services-directory/components/ServiceDetailPage.tsx` |
| Modificar | `src/modules/services-directory/__tests__/ServiceDetailPage.test.tsx` |

## Critérios de Aceite
- [ ] Contato, endereço e redes sociais ocultos para visitante
- [ ] Nome, tipo e descrição sempre visíveis
- [ ] Link de login com `?returnTo=` correto para cada ContactGate
- [ ] Usuário autenticado vê tudo
- [ ] Todos os testes existentes continuam passando
