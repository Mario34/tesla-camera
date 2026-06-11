import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'

const browserGlobals = {
  Blob: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  document: 'readonly',
  FileSystemDirectoryHandle: 'readonly',
  FileSystemFileHandle: 'readonly',
  FileSystemHandle: 'readonly',
  HTMLVideoElement: 'readonly',
  localStorage: 'readonly',
  navigator: 'readonly',
  Promise: 'readonly',
  setTimeout: 'readonly',
  URL: 'readonly',
  window: 'readonly',
}

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'src-tauri/target/**'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: browserGlobals,
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-no-duplicate-props': ['error', { ignoreCase: false }],
      'react/jsx-uses-vars': 'error',
      'react/no-string-refs': 'error',
      'react/no-unused-state': 'error',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/self-closing-comp': ['warn', { component: true, html: false }],
    },
    settings: {
      react: {
        version: '19.2',
      },
    },
  },
]
