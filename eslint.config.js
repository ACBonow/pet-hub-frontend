// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      react,
    },
    rules: {
      // Regras React Hooks (warn para não bloquear build)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Regra React (warn)
      'react/button-has-type': 'warn',
      // Permite any com comentário explicativo
      '@typescript-eslint/no-explicit-any': 'warn',
      // Variáveis não usadas como erro, exceto args prefixados com _
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Em arquivos de teste, mocks anônimos que usam hooks são um padrão válido
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', 'e2e/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Ignorar arquivos gerados e de build
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
)
