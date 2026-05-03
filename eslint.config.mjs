import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier'
import importX from 'eslint-plugin-import-x'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'public/',
      '**/*.config.js',
      '**/*.config.mjs'
    ]
  },
  ...nextCoreWebVitals,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import-x': importX,
      prettier: prettierPlugin
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: {
      next: { rootDir: '.' }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-trailing-spaces': 'error',
      'no-use-before-define': 'error',
      'prefer-spread': 'warn',
      'prefer-rest-params': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'prettier/prettier': 'error',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ]
    }
  },
  prettierConfig
]
