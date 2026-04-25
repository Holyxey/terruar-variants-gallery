import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tw from '@tailwindcss/vite';

const PATH = process.env.DEV
  ? 'http://localhost:3000/gallery'
  : process.env.API_PATH;

if (!PATH) throw '!process.env.API_PATH';

export default defineConfig({
  plugins: [
    vue({
      features: { customElement: true },
      style: {},
    }),
    tw({
      optimize: true,
    }),
  ],

  define: {
    'process.env': {
      API_PATH: PATH,
    },
  },

  build: {
    lib: {
      cssFileName: 'asd.css',
      entry: './src/main.ts',
      name: 'TerruarVariantsGallery',
      fileName: 'terruar-variants-gallery',

      formats: ['iife'],
    },
  },
});
