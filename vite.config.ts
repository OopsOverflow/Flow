import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
  }
};

export default config;
