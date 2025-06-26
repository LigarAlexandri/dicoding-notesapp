import globals from 'globals';
import { defineConfig } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';

export default defineConfig([
  daStyle, // Apply the Dicoding Academy style
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser, // Define browser globals for JS files
    },
  },
  // You can add other configurations here if needed
]);