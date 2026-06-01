/**
 * Master Addons - React Apps Vite Configuration
 *
 * This configuration handles React apps only.
 * For vanilla JS/SCSS assets, use vite.config.assets.js
 *
 * Usage:
 *   APP_NAME=admin-settings npm run dev:admin
 *   APP_NAME=template-library npm run build:templateLibrary
 *
 * @see vite.config.assets.js for non-React assets
 */

import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { gzipSync } from 'zlib';
import react from '@vitejs/plugin-react';
import { minify } from 'terser';
import CleanCSS from 'clean-css';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * React App configurations
 */
const apps = {
  'admin-settings': {
    entry: 'dev/js/admin/admin-settings/src/main.tsx',
    outputJs: 'js/admin/admin-settings.js',
    outputCss: 'css/admin/admin-settings.css',
  },
  'template-library': {
    entry: 'dev/js/admin/template-library/index.js',
    outputJs: 'js/admin/template-library.js',
    outputCss: 'css/admin/template-library.css',
  },
  'template-kits-app': {
    entry: 'dev/js/admin/template-kits-app/index.js',
    outputJs: 'js/admin/template-kits-app.js',
    outputCss: 'css/admin/template-kits-app.css',
  },
  'demo-importer-app': {
    entry: 'dev/js/admin/demo-importer/index.js',
    outputJs: 'js/admin/demo-importer-app.js',
    outputCss: 'css/admin/demo-importer-app.css',
  },
  'widget-builder-app': {
    entry: 'dev/js/admin/widget-builder/index.js',
    outputJs: 'js/admin/widget-builder-app.js',
    outputCss: 'css/admin/widget-builder-app.css',
  },
  'setup-wizard': {
    entry: 'dev/js/admin/setup-wizard/src/main.tsx',
    outputJs: 'js/admin/setup-wizard.js',
    outputCss: 'css/admin/setup-wizard.css',
  },
};

// Get app name from environment variable
const appName = process.env.APP_NAME || 'admin-settings';
const currentApp = apps[appName];

if (!currentApp) {
  throw new Error(`App "${appName}" not found. Available apps: ${Object.keys(apps).join(', ')}`);
}

/**
 * Custom plugin to generate minified and gzipped versions
 * Only runs in production mode
 */
function generateMinifiedVersions(isProd) {
  return {
    name: 'generate-minified-versions',
    writeBundle: async (options, bundle) => {
      // Only generate minified versions in production
      if (!isProd) return;

      const outDir = options.dir || 'assets';

      for (const [fileName, chunk] of Object.entries(bundle)) {
        // Handle JS files
        if (fileName.endsWith('.js') && !fileName.endsWith('.min.js') && chunk.type === 'chunk') {
          const code = chunk.code;
          if (code) {
            const minFileName = fileName.replace('.js', '.min.js');
            const minFilePath = resolve(outDir, minFileName);

            // Ensure directory exists
            const dir = dirname(minFilePath);
            if (!existsSync(dir)) {
              mkdirSync(dir, { recursive: true });
            }

            try {
              const minified = await minify(code, {
                compress: {
                  passes: 2,
                  drop_console: true,
                  pure_getters: true,
                  unsafe_math: true,
                },
                mangle: {
                  toplevel: true,
                },
                format: {
                  comments: false,
                },
              });
              if (minified.code) {
                writeFileSync(minFilePath, minified.code);
                console.log(`  ✓ ${minFileName}`);

                // Create gzip version of minified file
                const gzipped = gzipSync(minified.code, { level: 9 });
                writeFileSync(`${minFilePath}.gz`, gzipped);
                console.log(`  ✓ ${minFileName}.gz`);
              }
            } catch (err) {
              console.error(`Error minifying ${fileName}:`, err.message);
            }
          }
        }

        // Handle CSS files
        if (fileName.endsWith('.css') && !fileName.endsWith('.min.css') && chunk.type === 'asset') {
          const source = chunk.source;
          if (source) {
            const cssContent = typeof source === 'string' ? source : new TextDecoder().decode(source);
            const minFileName = fileName.replace('.css', '.min.css');
            const minFilePath = resolve(outDir, minFileName);

            // Ensure directory exists
            const dir = dirname(minFilePath);
            if (!existsSync(dir)) {
              mkdirSync(dir, { recursive: true });
            }

            try {
              const cleanCss = new CleanCSS({ level: 2 });
              const minified = cleanCss.minify(cssContent);
              if (minified.styles) {
                writeFileSync(minFilePath, minified.styles);
                console.log(`  ✓ ${minFileName}`);

                // Create gzip version of minified file
                const gzipped = gzipSync(minified.styles, { level: 9 });
                writeFileSync(`${minFilePath}.gz`, gzipped);
                console.log(`  ✓ ${minFileName}.gz`);
              }
            } catch (err) {
              console.error(`Error minifying ${fileName}:`, err.message);
            }
          }
        }
      }
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const isProd = mode === 'production';
  const isWatch = command === 'build' && process.argv.includes('--watch');

  console.log(`\n🚀 Building React App: ${appName}`);
  console.log(`   Mode: ${isProd ? 'production' : 'development'}\n`);

  return {
    clearScreen: false,

    plugins: [
      react({
        include: /dev\/.*\.(jsx|tsx|js)$/,
        babel: {
          presets: [
            ['@babel/preset-react', { runtime: 'automatic' }],
          ],
          parserOpts: {
            plugins: ['jsx'],
          },
        },
      }),
      // Generate .min.js, .min.css and .gz files in production
      generateMinifiedVersions(isProd),
    ],

    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      },
    },

    build: {
      outDir: 'assets',
      emptyOutDir: false,
      sourcemap: !isProd ? 'inline' : false,
      minify: isProd ? 'esbuild' : false,
      target: 'es2018',
      manifest: false,

      watch: isWatch ? {
        include: [
          'dev/**/*.tsx',
          'dev/**/*.ts',
          'dev/**/*.css',
          'dev/**/*.scss',
          'dev/**/*.js',
          'dev/**/*.jsx',
        ],
        exclude: ['assets/**', 'node_modules/**'],
      } : null,

      rollupOptions: {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
        },

        input: resolve(__dirname, currentApp.entry),

        output: {
          format: 'iife', // Use IIFE format for WordPress compatibility (no ES modules)
          name: 'JLTMA_' + appName.replace(/-/g, '_'), // Global variable name for IIFE
          entryFileNames: currentApp.outputJs,
          chunkFileNames: `js/${appName}-[name].js`,
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo.names?.[0] || '';
            if (fileName.endsWith('.css')) {
              return currentApp.outputCss;
            }
            return 'assets/[name][extname]';
          },
          manualChunks: undefined,
          inlineDynamicImports: true, // Required for IIFE format

          globals: {
            'jquery': 'jQuery',
            '@wordpress/element': 'wp.element',
            '@wordpress/i18n': 'wp.i18n',
            '@wordpress/components': 'wp.components',
            '@wordpress/api-fetch': 'wp.apiFetch',
            '@wordpress/icons': 'wp.icons',
          },
        },

        external: [
          'jquery',
          '@wordpress/element',
          '@wordpress/i18n',
          '@wordpress/components',
          '@wordpress/api-fetch',
          '@wordpress/icons',
        ],
      },

      cssCodeSplit: false,
      chunkSizeWarningLimit: 500,
    },

    esbuild: {
      jsx: 'automatic',
    },

    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
          '.ts': 'tsx',
          '.tsx': 'tsx',
        },
      },
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, 'dev'),
        '@scss': resolve(__dirname, 'assets/scss'),
        '@shared': resolve(__dirname, 'dev/js/admin/shared'),
        '@adminSettings': resolve(__dirname, 'dev/js/admin/admin-settings/src'),
        '@setupWizard': resolve(__dirname, 'dev/js/admin/setup-wizard/src'),
      },
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});