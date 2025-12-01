# GEMINI.md

## 1. Objetivo do documento e escopo da IA no projeto

Este documento define as diretrizes de atuação da IA (Gemini) no projeto **Amigo Secreto**. A função da IA é atuar como um desenvolvedor sênior, executando com precisão as solicitações do usuário, mantendo o código limpo, tipado e sustentável.

**A IA NÃO deve:**

- Tomar decisões de produto ou design fora do escopo solicitado.
- Adicionar funcionalidades não pedidas ("proatividade excessiva").
- Ignorar regras de linting ou tipagem.

## 2. Padrões de linguagem e tipagem (TypeScript)

- **TypeScript Obrigatório:** Todo código novo deve ser em TypeScript (`.ts` ou `.tsx`).
- **Proibido `any`:** Não utilize `any` sob nenhuma hipótese. Se necessário, crie interfaces ou tipos utilitários.
- **Tipagem Explícita:** Defina tipos para props, estados, retornos de funções e dados de API.
- **Null/Undefined:** Trate `null` e `undefined` de forma segura e explícita.

## 3. Qualidade de código, erros e warnings

- **Zero Erros:** O projeto deve compilar sem erros a cada entrega.
- **Zero Warnings:** Esforce-se para eliminar todos os warnings de ESLint e TypeScript.
- **Limpeza:** Remova imports, variáveis e funções não utilizadas.

## 4. Formatação e lint

- **Prettier:** Mantenha a formatação consistente (aspas simples, ponto e vírgula, etc.).
- **ESLint:** Respeite as regras configuradas no projeto.

## 5. Organização e Arquitetura

- **Estrutura de Pastas:**

  - `src/components/ui`: Componentes genéricos (Button, Input, Card).
  - `src/components/[feature]`: Componentes específicos de funcionalidade.
  - `src/pages`: Páginas da aplicação (rotas).
  - `src/store`: Gerenciamento de estado (Zustand).
  - `src/types`: Definições de tipos globais.
  - `src/hooks`: Hooks customizados.

- **Boas Práticas:**
  - Componentes pequenos e focados.
  - Separação de lógica (hooks/stores) da UI.
  - Nomes de variáveis e funções em inglês, descritivos e claros.

## 6. Comportamento da IA

- **Não Alucinar:** Se não souber, pergunte.
- **Foco no Pedido:** Execute exatamente o que foi pedido.
- **Confirmação:** Em caso de ambiguidade, peça esclarecimento antes de codar.
- **Não Inventar:** Não crie regras de negócio ou mocks complexos sem solicitação.

## 7. Interpretação de instruções

- Leia todo o contexto antes de agir.
- Priorize a intenção do usuário.
- Se houver conflito de instruções, pergunte.

## 8. Evolução futura

- Qualquer alteração futura deve seguir este documento.
- Mantenha o padrão de qualidade e tipagem.
- Atualize este documento apenas se solicitado explicitamente.

## 9. Histórico de Auditoria

- **Data:** 29/11/2025
- **Ações Realizadas:**

  - Remoção de código morto (dead code).
  - Correção de 100% dos erros e warnings de ESLint.
  - Formatação de todo o projeto com Prettier.
  - Organização de arquivos SQL em pasta `database`.
  - Implementação de limite de sessão de 24h.
  - Verificação de build (`tsc` + `vite build`) com sucesso.
  - Correção de linting específico em `Toast.tsx`, `JoinGroupPage.tsx`, `NotificationsPage.tsx` e `useNotificationStore.ts`.

- **Data:** 30/11/2025
- **Ações Realizadas:**

  - **Criptografia de Banco de Dados:** Implementação de AES-256 (pgcrypto) na coluna `email` da tabela `profiles`.
  - **Segurança Frontend:** Remoção total da dependência de emails em texto plano (convites via `@handle`).
  - **Correção de Bugs Críticos:** Tratamento de datas inválidas que causavam crash na UI (`GroupDashboardPage`).
  - **UX/UI:** Melhoria na validação de formulários (mensagens personalizadas para datas passadas/inválidas).
  - **Limpeza:** Remoção de código legado de busca por email e exclusão da pasta vazia `src/services`.
  - **Correção de Tipagem:** Remoção de referências a `email` em `ProfilePage` e `DrawAnimation` para conformidade com a interface `User`.

- **Data:** 30/11/2025 (Audit Final)
- **Ações Realizadas:**

  - **UI Mobile:** Refatoração completa de `ParticipantList` para layout vertical em tablets/mobile.
  - **Error Handling:** Implementação de páginas de erro (400-500) e rotas de fallback.
  - **Lint & Format:** Execução de `eslint --fix` e `prettier --write` em todo o projeto.
  - **Build:** Verificação de build (`tsc` + `vite build`) com sucesso. Zero erros/warnings.

- **Data:** 30/11/2025 (Refatoração Donate & QR Code)
- **Ações Realizadas:**

  - **Refatoração de Rota:** Mudança de `/support` para `/donate` (interna) e renomeação de arquivos (`DonatePage.tsx`).
  - **Limpeza:** Remoção de `AuthHeader` e rota pública `/donate`.
  - **UX/UI:** Implementação de Zoom no QR Code com Portal (foco e nitidez) e ajuste de centralização desktop (offset sidebar).
  - **Build:** Verificação de build (`tsc` + `vite build`) com sucesso.

- **Data:** 30/11/2025 (Correção de Bugs Críticos & Cleanup)
- **Ações Realizadas:**
  - **Wishlist:** Correção de título ("desejo" -> "Presente"), bloqueio de tradução e timeout de segurança (10s) para evitar loop infinito.
  - **Perfil:** Correção de texto e timeout de segurança (10s) ao salvar.
  - **Grupos:** Correção crítica de carregamento infinito (loop em `getGroup`) com timeout (15s) e tratamento de erro robusto.
  - **Lixeira:** Adição de feedback visual (loading) e timeout ao excluir itens.
  - **Global:** Bloqueio de tradução automática (`translate="no"`) em todo o app (`<body>`).
  - **Vercel:** Criação de `vercel.json` para corrigir erro 404 ao recarregar páginas (SPA routing).
  - **Lint & Format:** Execução final de `eslint` (0 erros) e `prettier` em todo o projeto.
