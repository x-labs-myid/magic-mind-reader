import { defineConfig, mergeConfig, UserConfig } from 'vite';
import { typescriptConfig } from '@nativescript/vite/configuration/typescript.js';

export default defineConfig(({ mode }): UserConfig => {
  return mergeConfig(
    typescriptConfig({ mode }),
    {
      plugins: [],
      resolve: {
        alias: {},
      },
    }
  );
});
