# GitHub Copilot Instructions - Estrutura Modular Nuxt 4

⚠️ **Atenção**  
Este documento é um **guia baseado em boas práticas e na documentação oficial**.  
**Sempre siga as orientações do desenvolvedor responsável pelo projeto.**  
Não é uma regra imutável — serve como referência para manter consistência, legibilidade e escalabilidade.

---

## Estrutura de Pastas Obrigatória

SEMPRE organize o código seguindo esta estrutura modular:

### Estrutura Básica
```
my-nuxt-app/
├── app/
│   ├── modules/[nome-do-modulo]/
│   │   ├── components/              # Componentes específicos do módulo
│   │   ├── composables/             # Lógica reativa do módulo
│   │   ├── types/                   # Tipos TypeScript do módulo
│   │   ├── utils/                   # Utilitários específicos do módulo
│   │   ├── stores/                  # Stores específicos do módulo (se necessário)
│   │   └── index.ts                 # Export barrel do módulo
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/                  # Componentes base (Button, Input, Modal)
│   │   │   ├── layout/              # Header, Sidebar, Footer
│   │   │   ├── forms/               # Componentes de formulário reutilizáveis
│   │   │   ├── tables/              # Componentes de tabela reutilizáveis
│   │   │   └── common/              # LoadingSpinner, ErrorMessage
│   │   ├── composables/
│   │   │   ├── api/                 # Composables de API
│   │   │   ├── ui/                  # Composables de UI
│   │   │   └── business/            # Regras de negócio globais
│   │   ├── types/
│   │   │   ├── entities/            # Entidades principais do sistema
│   │   │   ├── api/                 # Tipos de API
│   │   │   └── ui/                  # Tipos de UI
│   │   ├── utils/                   # Utilitários globais
│   │   └── stores/                  # Stores Pinia globais
│   ├── assets/                      # fontes, ícones, imagens processadas, CSS global
│   ├── components/                  # componentes de UI (pequenos, reusáveis, sem lógica de dados)
│   ├── composables/                 # funções reativas (useX) e estados compartilhados (useState)
│   ├── layouts/                     # layouts de páginas (header/footer etc.)
│   ├── middleware/                  # middlewares de rota (auth, guards, etc.)
│   ├── pages/                       # rotas baseadas em arquivos
│   ├── plugins/                     # registros de libs (client/server), injeções de dependência
│   ├── utils/                       # funções puras e helpers sem reatividade
│   ├── app.vue                      # shell do app
│   ├── app.config.ts                # configurações do app
│   └── error.vue                    # página de erro global
├── content/                         # opcional - conteúdo estático/MD
├── public/                          # arquivos estáticos servidos como raiz (/)
├── shared/
│   ├── types/                       # tipos globais TypeScript (contratos, DTOs, entidades)
│   └── constants/                   # constantes e enums globais
├── server/
│   ├── api/                         # rotas server (ex: server/api/users.get.ts)
│   ├── middleware/                  # middlewares server-side Nitro
│   └── plugins/                     # plugins server-side
├── tailwind.config.ts               # tema e tokens de design
├── nuxt.config.ts
└── .env
```

### Estrutura para Módulos Complexos
Para módulos com mais de 15 arquivos ou funcionalidades distintas, use submódulos:

```
app/modules/[nome-do-modulo]/
├── components/
├── composables/
├── types/
├── utils/
├── stores/
├── features/                        # Submódulos por funcionalidade
│   ├── [sub-funcionalidade-1]/
│   │   ├── components/
│   │   ├── composables/
│   │   └── types/
│   └── [sub-funcionalidade-2]/
│       ├── components/
│       ├── composables/
│       └── types/
└── index.ts
```

> **Sobre `types`**  
> - **Projetos pequenos** → pode manter em `app/types`.  
> - **Projetos médios/grandes ou com backend** → prefira `shared/types` fora do `app/` para facilitar compartilhamento.

---

## Princípios de Arquitetura

1. **Componentizar ao máximo**  
   - Componentes pequenos, coesos e reusáveis.  
   - Nada de lógica de dados dentro de componentes — use **composables**.

2. **Composables para lógica de domínio**  
   - `/app/composables/useX.ts` → busca de dados, regras de negócio, orquestração.  
   - Componente apenas consome o composable.

3. **Responsabilidade única**  
   - Um arquivo faz **uma única coisa bem feita**. Se crescer, quebre.

4. **Tipos corretos**  
   - Sempre tipar props, emits, retornos, estados e contratos de API.  
   - Evitar `any`; preferir tipagem explícita.

5. **Sempre TypeScript**  
   - `lang="ts"` nos componentes Vue.  
   - Tipos globais no `/shared/types` ou `app/types`.

6. **Padrão de camadas**  
   - **UI (`components`)** → **Composables (`composables`)** → **Acesso a dados (`server/api` ou SDK)**.

---

## Regras de Nomenclatura

- **Componentes Vue (`/app/components`)** → **PascalCase**  
  Ex.: `UserCard.vue`, `AuthButton.vue`

- **Páginas (`/app/pages`)** → **minúsculas sem traços**, usar apenas letras e, se necessário, subpastas para organizar  
  Ex.: `login.vue`, `profile.vue`, `settings.vue`  
  Se precisar separar por contexto:  
  ```
  /app/pages/admin/dashboard.vue
  /app/pages/admin/users.vue
  ```

- **Layouts (`/app/layouts`)** → **PascalCase**  
  Ex.: `DefaultLayout.vue`, `AdminLayout.vue`

- **Composables (`/app/composables`)** → prefixo `use` + PascalCase  
  Ex.: `useAuth.ts`, `useCart.ts`

- **Middlewares (`/app/middleware`)** → camelCase  
  Ex.: `authGuard.ts`, `isAdmin.ts`

- **Utils (`/app/utils`)** → camelCase  
  Ex.: `formatDate.ts`, `calculateTotal.ts`

- **Tipos (`/shared/types` ou `app/types`)** → PascalCase para nomes de interfaces ou DTOs  
  Ex.: `UserDTO.ts`, `ProductDTO.ts`

**Sempre use imports explícitos para cada arquivo, evitando auto-imports.**

---

## Regras de Organização

1. **Módulos**: Quando criar funcionalidades relacionadas, SEMPRE criar dentro de `app/modules/[nome-modulo]/`

2. **Componentes**: 
   - Específicos do módulo → `app/modules/[nome-modulo]/components/`
   - Reutilizáveis globalmente → `app/shared/components/`
   - Pequenos e sem lógica de dados → `app/components/`

3. **Composables**: 
   - Específicos do módulo → `app/modules/[nome-modulo]/composables/`
   - Globais → `app/shared/composables/`
   - Estados compartilhados → `app/composables/`

4. **Types**: 
   - Módulo específico → `app/modules/[nome-modulo]/types/`
   - Globais → `shared/types/` ou `app/types/`

5. **Export Barrel**: Todo módulo deve ter um `index.ts` para facilitar imports

6. **DRY**: Evite duplicação - use `shared/` para recursos reutilizáveis

7. **Complexidade**: Para sistemas complexos, aplique estas regras:
   - **Módulo com +15 arquivos**: Subdivida em `features/[sub-funcionalidade]/`
   - **Shared muito grande**: Subdivida por categoria (ui/, api/, business/)
   - **Types complexos**: Organize em subpastas (entities/, api/, ui/)
   - **Relacionamentos entre módulos**: Crie composables de integração

8. **Stores**: 
   - Globais → `app/shared/stores/`
   - Específicos do módulo → `app/modules/[nome-modulo]/stores/`

9. **Integração entre módulos**: Quando um módulo precisa de dados de outro:
   - Crie composables de integração (ex: `useClientesIntegration.ts`)
   - Use stores compartilhados quando necessário
   - Evite imports diretos entre módulos

**NUNCA crie módulos sem que seja explicitamente solicitado. SEMPRE pergunte qual módulo criar quando não estiver claro.**

---

## Configuração Auto-Import

Configure o `nuxt.config.ts` assim:

```typescript
export default defineNuxtConfig({
  imports: {
    dirs: [
      'app/modules/*/composables',
      'app/modules/*/features/*/composables',  // Para submódulos
      'app/modules/*/utils',
      'app/shared/composables',
      'app/shared/composables/*',              // Para subdivisões do shared
      'app/shared/utils'
    ]
  },
  components: [
    '~/app/shared/components',
    '~/app/shared/components/*',               // Para subdivisões do shared
    '~/app/modules/*/components',
    '~/app/modules/*/features/*/components'    // Para submódulos
  ]
})
```

## Critérios para Subdivisão

**Quando criar submódulos (`features/`):**
- Módulo com mais de 15 arquivos
- Funcionalidades distintas dentro do mesmo domínio
- Equipes diferentes trabalhando no mesmo módulo

**Quando subdividir `shared/`:**
- Mais de 20 componentes na mesma pasta
- Tipos ficando difíceis de encontrar
- Composables com responsabilidades muito diferentes

**Para sistemas complexos**: Avalie automaticamente a necessidade de subdivisão baseada nos critérios acima e sugira melhorias na organização quando necessário.

---

## Padrões de Código

- **Pastas de módulos**: kebab-case (`user-management`, `auth-system`)
- **Componentes**: PascalCase (`UserCard.vue`, `LoginForm.vue`)
- **Composables**: camelCase com prefixo `use` (`useAuth.ts`, `useUserData.ts`)
- **Types**: PascalCase com sufixo `.types.ts` (`user.types.ts`)

**NUNCA crie módulos sem que seja explicitamente solicitado. SEMPRE pergunte qual módulo criar quando não estiver claro.**

---

## Stack Tecnológica

- **Nuxt 4** (Vue 3) + **Tailwind CSS**
- **Regra principal**: componentize tudo — sem HTML inline em páginas/templates
- **Commits**: o agente NUNCA deve executar commits/push sem autorização explícita do desenvolvedor

## Cabeçalho de arquivo (obrigatório)
Todos os arquivos iniciam com 3–6 linhas:
```javascript
/**
 * PROPÓSITO: resumo objetivo
 * IMPORTA: dependências principais
 * USADO_POR: onde é usado
 */
```

## Comandos essenciais
- Instalar (PowerShell):
  ```powershell
  npm install
  ```
- Dev (expor host):
  ```powershell
  npx nuxt dev --host
  ```
- Build / Preview:
  ```powershell
  npm run build
  npm run preview
  ```

## Tailwind (configuração)
- CSS principal: `app/assets/css/main.css`
- `tailwind.config.js`: aponte `content` para `app/**/*.{vue,js,ts}` e outras pastas relevantes.

## Política Git (obrigatória)
- **Regra**: Agente só executa comandos Git/GitHub quando **explicitamente solicitado pelo desenvolvedor**
- Desenvolvedor deve configurar remote via SSH e executar commits/push quando necessário:
  ```powershell
  git remote set-url origin git@github.com:<owner>/<repo>.git
  git checkout -b feature/minha-mudanca
  git add -A
  git commit -m "descrição: motivo"
  git push -u origin feature/minha-mudanca
  ```

## MCP Context7 (obrigatório ao perder contexto / iniciar chat)
- **SEMPRE** consultar documentação atualizada de TODAS as tecnologias ativas no sistema
- Fluxo obrigatório antes de implementar qualquer mudança:
  1) Identificar tecnologias ativas no projeto (package.json, nuxt.config.ts, etc.)
  2) Para cada tecnologia encontrada:
     - `mcp_context7_resolve-library-id("[tecnologia]")`
     - `mcp_context7_get-library-docs("[library-id]", topic="relevante")`
  
- **Tecnologias que SEMPRE devem ser consultadas**:
  - Nuxt 4: `mcp_context7_get-library-docs("/nuxt/nuxt", topic="components" | "config" | "ssr")`
  - Tailwind CSS: `mcp_context7_get-library-docs("/websites/tailwindcss", topic="configuration" | "components")`
  - Vue 3: `mcp_context7_get-library-docs("[vue-id]", topic="composition-api" | "components")`
  - TypeScript: `mcp_context7_get-library-docs("[typescript-id]", topic="types" | "configuration")`
  - Pinia (se encontrado): `mcp_context7_get-library-docs("[pinia-id]", topic="stores" | "composition")`

- **Regra crítica**: NUNCA implementar sem consultar Context7 - isso evita decisões baseadas em conhecimento desatualizado

## Pontos de atenção rápidos
- Use UTC no backend; converta no frontend
- Componentes que usam browser APIs devem ser `.client.vue` ou envolver `<client-only>`
- Evite nomes duplicados de componentes (usar caminhos claros)
- Verificar `tailwind.config.js` antes de criar classes dinâmicas

