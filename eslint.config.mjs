import js from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'
import globals from 'globals'

export default [
  {
    files: ['client/**/*.{js,jsx,mjs,cjs}'],
    ignores: ['client/src/App.test.js']
  },
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  reactPlugin.configs.flat.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      'react/prop-types': 'off',
      'comma-dangle': ['error', 'only-multiline'],
      'max-len': [
        'error',
        {
          code: 145,
          tabWidth: 2
        }
      ],
      quotes: ['error', 'single', 'avoid-escape'],
      curly: ['error'],
      'no-console': 'off',
      'prettier/prettier': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-use-before-define': [
        'error',
        {
          functions: true,
          classes: true
        }
      ],
      'arrow-body-style': 'off'
    }
  }
]
