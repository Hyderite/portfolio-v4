import { defineConfig } from 'vite';
import { resolve } from 'path';
import glob from 'fast-glob';

export default defineConfig({
    base: '/',
    build: {
        outDir: 'public/dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                ...glob.sync('public/src/ts/**/*.ts').reduce((entries, file) => {
                    const name = file.replace(/^public\/src\/ts\/|\.ts$/g, '');
                    entries[name] = resolve(__dirname, file);
                    return entries;
                }, {})
            },
            output: {
                entryFileNames: 'js/[name].js',
                chunkFileNames: 'js/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        const originalName = assetInfo.name.replace(/\.css$/, '');
                        return `css/${originalName}.min.[ext]`;
                    }
                    return 'assets/[name].[ext]';
                }
            }
        }
    }
});
