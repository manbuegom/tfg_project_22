import postcss from './postcss.config.cjs';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {exclude: ["svelte-routing"]},
  css:{
    postcss
  }
})