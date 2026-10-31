import { defineConfig } from 'vite';
import { resolve } from 'path';
import glob from 'fast-glob';

export default defineConfig({
    build: {
        outDir: 'public',
        emptyOutDir: false,
        rollupOptions: {
            input: {
                ...glob.sync('public/src/css/**/*.css').reduce((entries, file) => {
                    const name = file.replace(/^public\/src\/css\/|\.css$/g, '');
                    entries[name] = resolve(__dirname, file);
                    return entries;
                }, {}),
                ...glob.sync('public/src/ts/**/*.ts').reduce((entries, file) => {
                    const name = file.replace(/^public\/src\/ts\/|\.ts$/g, '');
                    entries[name] = resolve(__dirname, file);
                    return entries;
                }, {})
            },
            output: {
                inlineDynamicImports: false,

                entryFileNames: 'dist/js/[name].js',
                chunkFileNames: 'dist/js/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'dist/css/[name].min.[ext]';
                    }
                    return 'dist/assets/[name].[ext]';
                }
            }
        }
    }
});
