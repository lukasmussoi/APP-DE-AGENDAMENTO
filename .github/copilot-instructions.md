# GitHub Copilot Instructions - Estrutura Modular Nuxt 4

## Estrutura de Pastas Obrigatória

SEMPRE organize o código seguindo esta estrutura modular dentro de `app/`:

### Estrutura Básica
```
app/
├── modules/[nome-do-modulo]/
│   ├── components/              # Componentes específicos do módulo
│   ├── composables/             # Lógica reativa do módulo
│   ├── types/                   # Tipos TypeScript do módulo
│   ├── utils/                   # Utilitários específicos do módulo
│   ├── stores/                  # Stores específicos do módulo (se necessário)
│   └── index.ts                 # Export barrel do módulo
├── shared/
│   ├── components/
│   │   ├── ui/                  # Componentes base (Button, Input, Modal)
│   │   ├── layout/              # Header, Sidebar, Footer
│   │   ├── forms/               # Componentes de formulário reutilizáveis
│   │   ├── tables/              # Componentes de tabela reutilizáveis
│   │   └── common/              # LoadingSpinner, ErrorMessage
│   ├── composables/
│   │   ├── api/                 # Composables de API
│   │   ├── ui/                  # Composables de UI
│   │   └── business/            # Regras de negócio globais
│   ├── types/
│   │   ├── entities/            # Entidades principais do sistema
│   │   ├── api/                 # Tipos de API
│   │   └── ui/                  # Tipos de UI
│   ├── utils/                   # Utilitários globais
│   └── stores/                  # Stores Pinia globais
├── pages/                       # Rotas da aplicação
├── layouts/                     # Layouts globais
├── middleware/                  # Middleware global
├── plugins/                     # Plugins globais
├── server/api/                  # API routes
└── assets/                      # Assets estáticos
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
├── features/                    # Submódulos por funcionalidade
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

## Regras de Organização

1. **Módulos**: Quando criar funcionalidades relacionadas, SEMPRE criar dentro de `app/modules/[nome-modulo]/`

2. **Componentes**: 
   - Específicos do módulo → `app/modules/[nome-modulo]/components/`
   - Reutilizáveis globalmente → `app/shared/components/`

3. **Composables**: 
   - Específicos do módulo → `app/modules/[nome-modulo]/composables/`
   - Globais → `app/shared/composables/`

4. **Types**: Sempre criar em `types/` dentro do respectivo módulo ou shared

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

## Mantenha o IMPORT EXPLÍCITO COMO PADRÃO

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

## Padrões de Nomenclatura

- Pastas: kebab-case (`user-management`, `auth-system`)
- Componentes: PascalCase (`UserCard.vue`, `LoginForm.vue`)
- Composables: camelCase com prefixo `use` (`useAuth.ts`, `useUserData.ts`)
- Types: PascalCase com sufixo `.types.ts` (`user.types.ts`)

NUNCA crie módulos sem que seja explicitamente solicitado. SEMPRE pergunte qual módulo criar quando não estiver claro.

## Exemplo de Import Explícito

Import: usar import explícito sempre (requisito do projeto).
Exemplo:
```javascript
// Importando de módulo específico
import { UserCard, UserForm } from '~/app/modules/user-management'
import { useAuth } from '~/app/modules/auth-system/composables'

// Importando de shared
import { Button, Modal } from '~/app/shared/components/ui'
import { useApi } from '~/app/shared/composables'
```

## Stack Tecnológica

- Tech Stack: `Nuxt 4` (Vue 3) + `Tailwind CSS`
- Regra principal: componentize tudo — sem HTML inline em páginas/templates
- Commits: o agente NUNCA deve executar commits/push. Todo push é feito pelo desenvolvedor via SSH

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

## Tailwind (prático)
- CSS principal: `app/assets/css/main.css` com:
  ```css
  @import "tailwindcss";
  ```
- `tailwind.config.js`: aponte `content` para `app/**/*.{vue,js,ts}` e outras pastas relevantes.

## Política Git (obrigatória)
- Agente pode sugerir mensagens, diffs e comandos, mas NÃO executar `git` automaticamente
- **EXCETO**: Quando explicitamente solicitado pelo desenvolvedor - nesse caso DEVE executar
- Desenvolvedor deve configurar remote via SSH e executar commits/push quando não solicitado ao agente:
  ```powershell
  git remote set-url origin git@github.com:<owner>/<repo>.git
  git checkout -b feature/minha-mudanca
  git add -A
  git commit -m "descrição: motivo"
  git push -u origin feature/minha-mudanca
  ```
- **Regra**: Se o usuário pedir explicitamente para executar comandos Git/GitHub, o agente DEVE fazer

## MCP Context7 (obrigatório ao perder contexto / iniciar chat)
- Fluxo obrigatório antes de mudanças de framework:
  1) `mcp_context7_resolve-library-id("nuxt")`
  2) `mcp_context7_get-library-docs("/nuxt/nuxt", topic="components" | "config" | "ssr")`

## Pontos de atenção rápidos
- Use UTC no backend; converta no frontend
- Componentes que usam browser APIs devem ser `.client.vue` ou envolver `<client-only>`
- Evite nomes duplicados de componentes (usar caminhos claros)
- Verificar `tailwind.config.js` antes de criar classes dinâmicas

