import globals from 'globals';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest'
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      'eqeqeq': ['error', 'always'],     // Forces === instead of ==
      'no-unused-vars': ['warn'],        // Warns you about dead variables
      'prefer-const': 'error',           // Forces 'const' if variable isn't reassigned
      'no-var': 'error',                 // Bans the old 'var' keyword entirely
      'no-console': 'off',
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/no-trailing-spaces': 'error',
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/arrow-spacing': ['error', { before: true, after: true }],
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**']
  },
]);
