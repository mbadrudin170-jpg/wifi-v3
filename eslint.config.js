// Path: ~/wifi-v3/eslint.config.js

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = defineConfig([
  expoConfig,
  reactCompiler.configs.recommended,
  {
    // PERBAIKAN: Menambahkan semua direktori yang perlu diabaikan oleh ESLint
    ignores: ['.expo/**', 'node_modules/**', 'dist/**', 'build/**'],
  },
]);
