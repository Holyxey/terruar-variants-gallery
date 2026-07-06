import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tw from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue({ features: { customElement: true } }),
      tw({ optimize: true }),
    ],

    define: {
      'process.env.DEV': JSON.stringify(env.DEV),
      'process.env.API_PATH': JSON.stringify(env.API_PATH),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    build: {
      outDir: 'dist/',

      lib: {
        entry: './src/main.ts',
        name: 'TerruarVariantsGallery',
        fileName: 'terruar-variants-gallery',

        formats: ['iife'],
      },
    },
  };
});
