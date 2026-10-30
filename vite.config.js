import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',

    server: {
        port: 3000,
        open: true,
    },

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: 'js/[name].js',
                chunkFileNames: 'js/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'css/[name]-[hash].[ext]';
                    }
                    return 'assets/[name]-[hash].[ext]';

                },
            },
        },
    },
});
