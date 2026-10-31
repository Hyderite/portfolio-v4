import { defineConfig } from 'vite';
import { resolve } from 'path';
import glob from 'fast-glob';

export default defineConfig({
    build: {
        outDir: 'public/dist',
        treeshake: false,
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
                format: 'iife',
                name: 'window',
                extend: true,

                entryFileNames: 'js/[name].js',
                chunkFileNames: 'js/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'css/[name].min.[ext]';
                    }
                    return 'assets/[name].[ext]';
                }
            }
        }
    }
});
