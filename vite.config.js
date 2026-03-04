import { defineConfig } from 'vite';
import { apiServerPlugin } from './server/api.js';

export default defineConfig({
    root: '.',
    plugins: [apiServerPlugin()],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
    },
});
