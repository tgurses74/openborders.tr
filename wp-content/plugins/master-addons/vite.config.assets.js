/**
 * Master Addons - Assets Vite Configuration
 *
 * This configuration handles vanilla JavaScript/TypeScript and SCSS files.
 * React apps are handled separately by vite.config.js
 *
 * Usage:
 *   npm run assets:dev         # Development build
 *   npm run assets:prod        # Production build
 *   npm run assets:watch       # Watch mode
 *   ASSET=admin-sdk npm run assets:dev  # Build specific asset
 *
 * @see vite.config.js for React apps
 */

import { defineConfig } from 'vite';
import { resolve, dirname, basename, join, normalize } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, statSync } from 'fs';
import { gzipSync } from 'zlib';
import { minify } from 'terser';
import CleanCSS from 'clean-css';
import rtlcss from 'rtlcss';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Get addon JS entries from a directory
 * @param {string} sourceDir - Source directory (e.g., 'dev/js/addons/free')
 * @param {string} outputDir - Output directory (e.g., 'assets/js/addons/free')
 * @param {string[]} exclude - Files to exclude
 */
function getAddonJsEntries(sourceDir, outputDir, exclude = []) {
  const entries = {};
  const fullSourceDir = resolve(__dirname, sourceDir);

  if (!existsSync(fullSourceDir)) {
    return entries;
  }

  const files = readdirSync(fullSourceDir).filter(
    (file) => file.endsWith('.js') && !exclude.includes(file)
  );

  for (const file of files) {
    const name = basename(file, '.js');
    entries[`${outputDir}/${name}`] = `${sourceDir}/${file}`;
  }

  return entries;
}

/**
 * Get addon SCSS entries from a directory
 * Returns array of { source, output } objects for the SCSS plugin
 * Note: Strips leading underscore from output filenames (SCSS partials convention)
 */
function getAddonScssEntries(sourceDir, outputDir) {
  const entries = [];
  const fullSourceDir = resolve(__dirname, sourceDir);

  if (!existsSync(fullSourceDir)) {
    return entries;
  }

  const files = readdirSync(fullSourceDir).filter((file) => file.endsWith('.scss'));

  for (const file of files) {
    let name = basename(file, '.scss');
    // Strip leading underscore from output filename (SCSS partial naming convention)
    if (name.startsWith('_')) {
      name = name.substring(1);
    }
    entries.push({
      source: resolve(__dirname, sourceDir, file),
      output: `${outputDir}/${name}.css`,
    });
  }

  return entries;
}

/**
 * Get a single SCSS file entry
 * @param {string} sourceFile - Source file path (e.g., 'dev/scss/common/admin-sdk.scss')
 * @param {string} outputFile - Output file path (e.g., 'assets/css/admin-sdk.css')
 */
function getSingleScssEntry(sourceFile, outputFile) {
  const fullSourcePath = resolve(__dirname, sourceFile);

  if (!existsSync(fullSourcePath)) {
    return null;
  }

  return {
    source: fullSourcePath,
    output: outputFile,
  };
}

// Collect all SCSS addon entries
const scssAddonEntries = [
  // common (single file entry)
  getSingleScssEntry('dev/scss/admin/master-addons-admin-sdk.scss', 'assets/css/admin/master-addons-admin-sdk.css'),
  getSingleScssEntry('dev/scss/admin/editor.scss', 'assets/css/admin/editor.css'),
  getSingleScssEntry('dev/scss/admin/master-addons-editor.scss', 'assets/css/admin/master-addons-editor.css'),
  getSingleScssEntry('dev/scss/common/base.scss', 'assets/css/common/common.css'),
  getSingleScssEntry('dev/scss/common/common-swiper-carousel.scss', 'assets/css/common/swiper-carousel.css'),
  getSingleScssEntry('dev/scss/common/_animation-effects.scss', 'assets/css/common/animations.css'),

  // Page Importer
  getSingleScssEntry('dev/scss/admin/page-importer.scss', 'assets/css/admin/page-importer.css'),

  // Addons & Modules
  ...getAddonScssEntries('dev/scss/addons/free', 'assets/css/addons'),
  ...getAddonScssEntries('dev/scss/addons/premium', 'premium/assets/css/addons'),
  ...getAddonScssEntries('dev/scss/modules/free', 'assets/css/modules'),
  ...getAddonScssEntries('dev/scss/modules/premium', 'premium/assets/css/modules'),
  // Popup Builder
  ...getAddonScssEntries('dev/scss/admin/popup-builder', 'assets/css/admin/popup-builder'),
  // Recommended Plugins
  getSingleScssEntry('dev/scss/admin/recommended-plugins.scss', 'assets/css/admin/recommended-plugins.css'),
  // Template Library
  getSingleScssEntry('dev/scss/admin/templates/library/template-library.scss', 'assets/css/admin/template-library.css'),
  // Theme Builder
  getSingleScssEntry('dev/scss/admin/theme-builder.scss', 'assets/css/admin/theme-builder.css'),
  getSingleScssEntry('dev/scss/frontend/theme-builder-comments.scss', 'assets/css/theme-builder-comments.css'),
  // Widget Builder
  getSingleScssEntry("dev/scss/admin/widget-builder.scss", "assets/css/admin/widget-builder.css"),
  // Plugin Survey (Deactivation Feedback Dialog)
  getSingleScssEntry('dev/scss/admin/plugin-survey.scss', 'assets/css/plugin-survey.css'),
].filter(Boolean); // Remove null entries from single file helpers

/**
 * Recursively delete all build artifacts (.js, .css, .map, .gz) from a directory
 * Keeps directories and non-build files intact (e.g. .DS_Store)
 */
function cleanDir(dir) {
  if (!existsSync(dir)) return 0;
  let count = 0;
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      count += cleanDir(fullPath);
    } else if (/\.(js|css|map|gz)$/.test(entry)) {
      unlinkSync(fullPath);
      count++;
    }
  }
  return count;
}

/**
 * Plugin to clean output directories before building
 * Removes all generated JS/CSS files (including .min, .rtl, .gz variants)
 * Preserves directories, images, fonts, vendor, scss
 */
function cleanOutputDirs() {
  let cleaned = false;
  return {
    name: 'clean-output-dirs',
    buildStart() {
      if (cleaned) return;
      cleaned = true;

      const dirsToClean = [
        resolve(__dirname, 'assets/js'),
        resolve(__dirname, 'assets/css'),
        resolve(__dirname, 'premium/assets/js'),
        resolve(__dirname, 'premium/assets/css'),
      ];

      console.log('\n🧹 Cleaning output directories...');
      let total = 0;
      for (const dir of dirsToClean) {
        const removed = cleanDir(dir);
        if (removed > 0) {
          console.log(`  ✓ ${dir.replace(__dirname + '/', '')} (${removed} files)`);
        }
        total += removed;
      }
      console.log(`  ${total} build artifacts removed\n`);
    },
  };
}

/**
 * Plugin to compile SCSS addon files to CSS
 * Handles SCSS files separately from the main Rollup bundle
 * Generates: name.css, name.min.css, name.rtl.css, name.rtl.min.css
 */
function scssAddonPlugin(isProd) {
  return {
    name: 'scss-addon-plugin',
    async buildEnd() {
      if (scssAddonEntries.length === 0) return;

      const sass = await import('sass');

      console.log(`\n📦 Compiling ${scssAddonEntries.length} SCSS addon files...`);

      for (const entry of scssAddonEntries) {
        try {
          const result = sass.compile(entry.source, {
            loadPaths: [
              resolve(__dirname, 'assets/scss'),
              resolve(__dirname, 'assets/scss/common'),
              resolve(__dirname, 'dev/scss'),
              resolve(__dirname, 'dev/scss/core'),
              resolve(__dirname, 'node_modules'),
            ],
            style: 'expanded',
            sourceMap: !isProd,
            quietDeps: true,
            silenceDeprecations: ['import'],
          });

          const outputPath = resolve(__dirname, entry.output);
          const outputDirPath = dirname(outputPath);

          if (!existsSync(outputDirPath)) {
            mkdirSync(outputDirPath, { recursive: true });
          }

          // Write LTR CSS
          writeFileSync(outputPath, result.css);
          console.log(`  ✓ ${entry.output}`);

          // Generate RTL CSS
          const rtlCss = rtlcss.process(result.css);
          const rtlPath = outputPath.replace('.css', '.rtl.css');
          writeFileSync(rtlPath, rtlCss);
          console.log(`  ✓ ${entry.output.replace('.css', '.rtl.css')}`);

          // Generate minified versions in production
          if (isProd) {
            const cleanCss = new CleanCSS({ level: 2 });

            // Minified LTR
            const minified = cleanCss.minify(result.css);
            if (minified.styles) {
              const minPath = outputPath.replace('.css', '.min.css');
              writeFileSync(minPath, minified.styles);
              console.log(`  ✓ ${entry.output.replace('.css', '.min.css')}`);

              // Gzip LTR
              const gzipped = gzipSync(minified.styles, { level: 9 });
              writeFileSync(`${minPath}.gz`, gzipped);
              console.log(`  ✓ ${entry.output.replace('.css', '.min.css')}.gz`);
            }

            // Minified RTL
            const minifiedRtl = cleanCss.minify(rtlCss);
            if (minifiedRtl.styles) {
              const minRtlPath = outputPath.replace('.css', '.rtl.min.css');
              writeFileSync(minRtlPath, minifiedRtl.styles);
              console.log(`  ✓ ${entry.output.replace('.css', '.rtl.min.css')}`);

              // Gzip RTL
              const gzippedRtl = gzipSync(minifiedRtl.styles, { level: 9 });
              writeFileSync(`${minRtlPath}.gz`, gzippedRtl);
              console.log(`  ✓ ${entry.output.replace('.css', '.rtl.min.css')}.gz`);
            }
          }
        } catch (err) {
          console.error(`  ✗ Error compiling ${entry.source}:`, err.message);
        }
      }
    },
  };
}

/**
 * Asset configurations
 * Each asset can have multiple JS entries and SCSS files
 */
const assets = {
  // Admin Scripts
  'admin-settings': {
    entries: {
      'assets/js/admin/master-addons-admin-settings': 'dev/js/admin/admin-settings.js',
      'assets/js/admin/welcome-tabs' : 'dev/js/admin/welcome-tabs.js',
      // Elementor Editor
      'assets/js/admin/editor' : 'dev/js/admin/editor/editor.js',
      'assets/js/admin/module-editor' : 'dev/js/admin/editor/module-editor.js',
      'assets/js/admin/visual-select' : 'dev/js/admin/editor/visual-select.js',
      'assets/js/admin/file-select-control' : 'dev/js/admin/editor/file-select-control.js',
      'assets/js/master-addons-scripts' : 'dev/js/frontend/master-addons-scripts.js',
    },
  },
  'admin-sdk': {
    entries: {
      'assets/js/admin/master-addons-admin-sdk': 'dev/js/common/master-addons-admin-sdk.js',
    },
  },
  'recommended-plugins': {
    entries: {
      'assets/js/admin/recommended-plugins': 'dev/js/admin/recommended-plugins.js',
    },
  },

  // Page Importer
  'page-importer': {
    entries: {
      'assets/js/admin/page-importer': 'dev/js/admin/page-importer.js',
    },
  },

  // Theme Builder
  'theme-builder': {
    entries: {
      'assets/js/admin/theme-builder': 'dev/js/admin/theme-builder.js',
      // frontend
      "assets/js/theme-builder-comments": "dev/js/frontend/theme-builder-comments.js",
    },
  },
  
  // Popup Builder Scripts
  'popup-builder': {
    entries: {
      'assets/js/admin/popup-builder/elementor-editor': 'dev/js/admin/popup-builder/elementor-editor.js',
      'assets/js/admin/popup-builder/popup-admin': 'dev/js/admin/popup-builder/popup-admin.js',
      'assets/js/admin/popup-builder/modal-popup': 'dev/js/admin/popup-builder/modal-popup.js',
      'assets/js/admin/popup-builder/popup-frontend': 'dev/js/admin/popup-builder/popup-frontend.js',
      'premium/assets/js/admin/popup-builder/modal-popup-pro': 'dev/js/admin/popup-builder/modal-popup-pro.js',
    },
  },

  // Widget Builder
  'widget-builder': {
    entries: {
      'assets/js/admin/widget-admin': 'dev/js/admin/widget-builder/widget-admin.js',
    },
  },

  // Image Optimizer
  'image-optimizer': {
    entries: {
      'assets/js/admin/image-optimizer/image-optimizer-base': 'dev/js/admin/image-optimizer/image-optimizer-base.js',
      'premium/assets/js/image-optimizer/image-optimizer': 'dev/js/admin/image-optimizer/image-optimizer.js',
    },
  },

  // Icon Picker
  'icon-picker': {
    entries: {
      'assets/js/icon-picker': 'dev/js/common/icon-picker.js',
    },
  },

  // Individual Addon JS files (dev/js/addons/free -> assets/js/addons/free)
  'addon-scripts': {
    entries: {
      ...getAddonJsEntries('dev/js/addons/free', 'assets/js/addons', ['index.js', 'utils.js']),
      ...getAddonJsEntries('dev/js/addons/premium', 'premium/assets/js/addons', ['index.js', 'utils.js']),
    },
  },

  // Individual Modules/Extensions JS files (dev/js/modules/free -> assets/js/modules/free)
  'modules-scripts': {
    entries: {
      ...getAddonJsEntries('dev/js/modules/free', 'assets/js/modules', ['index.js', 'utils.js']),
      ...getAddonJsEntries('dev/js/modules/premium', 'premium/assets/js/modules', ['index.js', 'utils.js']),
    },
  },
};

// Get all assets or specific asset from environment
const assetName = process.env.ASSET || 'all';

/**
 * Get entries based on asset selection
 */
function getEntries() {
  if (assetName === 'all') {
    // Merge all entries
    let allEntries = {};
    for (const config of Object.values(assets)) {
      allEntries = { ...allEntries, ...config.entries };
    }
    return allEntries;
  }

  const asset = assets[assetName];
  if (!asset) {
    console.warn(`Asset "${assetName}" not found. Available: ${Object.keys(assets).join(', ')}, all`);
    return {};
  }
  return asset.entries;
}

/**
 * Custom plugin to inline shared chunks into entry points and wrap in IIFE.
 *
 * Rollup's ES module output creates shared chunks (e.g., utils-BesEACTg.js)
 * imported via `import` statements. WordPress/Elementor loads widget scripts
 * as regular <script> tags (not type="module"), causing:
 *   - "Cannot use import statement outside a module"
 *   - "Identifier 'x' has already been declared" (no module scope isolation)
 *
 * This plugin resolves chunk imports, inlines the code, removes import/export
 * statements, and wraps each entry in an IIFE for proper scoping.
 */
function inlineChunksIIFE() {
  return {
    name: 'inline-chunks-iife',
    generateBundle(options, bundle) {
      // Step 1: Collect non-entry chunks (shared modules like utils)
      const chunkCodeMap = {};
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && !chunk.isEntry) {
          let code = chunk.code;
          // Remove the export { ... } block at the end
          code = code.replace(/\nexport\s*\{[\s\S]*?\};?\s*$/m, '');
          // Remove sourcemap comment
          code = code.replace(/\/\/# sourceMappingURL=.*$/m, '');
          chunkCodeMap[normalize(fileName)] = code.trim();
        }
      }

      // Step 2: Process each entry — inline chunks and wrap in IIFE
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue;

        let code = chunk.code;
        let prependCode = '';

        // Replace import statements with inlined chunk code
        // Handles: import { x } from "path", import "path", import x from "path"
        code = code.replace(
          /import\s*(?:\{[^}]*?\}\s*from\s*|[\w$]+\s+from\s*)?["']([^"']+)["'];?\s*\n?/g,
          (match, importPath) => {
            const entryDir = dirname(fileName);
            const resolved = normalize(join(entryDir, importPath));

            if (chunkCodeMap[resolved]) {
              prependCode += chunkCodeMap[resolved] + '\n';
              return ''; // Remove the import statement
            }
            // Keep imports for truly external modules (shouldn't happen with current config)
            return match;
          }
        );

        // Remove any export statements from entry (entries are self-executing)
        code = code.replace(/\nexport\s*\{[\s\S]*?\};?\s*$/m, '');
        // Remove sourcemap comment (will be re-added if needed)
        code = code.replace(/\/\/# sourceMappingURL=.*$/m, '');

        // Combine inlined chunks + entry code, wrapped in IIFE for scope isolation
        const finalCode = (prependCode + code).trim();
        chunk.code = `(function(){\n${finalCode}\n})();\n`;

        // Clear the sourcemap since we've modified the code
        if (chunk.map) {
          chunk.map = null;
        }
      }

      // Step 3: Remove non-entry chunks from bundle (they've been inlined)
      for (const fileName of Object.keys(bundle)) {
        if (chunkCodeMap[normalize(fileName)]) {
          delete bundle[fileName];
        }
      }
    }
  };
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

      const outDir = options.dir || '.';

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
                compress: true,
                mangle: true,
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
  const entries = getEntries();

  // Convert entries to Rollup format
  const input = {};
  for (const [outputPath, sourcePath] of Object.entries(entries)) {
    input[outputPath] = resolve(__dirname, sourcePath);
  }

  if (Object.keys(input).length === 0) {
    console.error('No entries found. Check ASSET environment variable.');
    process.exit(1);
  }

  console.log(`\n📦 Building assets: ${assetName}`);
  console.log(`   Mode: ${isProd ? 'production' : 'development'}`);
  console.log(`   Entries: ${Object.keys(input).length}\n`);

  return {
    clearScreen: false,

    plugins: [
      // Clean output directories before building
      // Only clean on production builds — dev/watch mode shares output dirs with React builds
      ...(isProd ? [cleanOutputDirs()] : []),
      // Compile SCSS addon files to CSS
      scssAddonPlugin(isProd),
      // Inline shared chunks into entries and wrap in IIFE for WordPress compatibility
      inlineChunksIIFE(),
      // Generate .min.js, .min.css and .gz files in production
      generateMinifiedVersions(isProd),
    ],

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          loadPaths: [
            resolve(__dirname, 'assets/scss'),
            resolve(__dirname, 'assets/scss/common'),
            resolve(__dirname, 'dev/scss'),
            resolve(__dirname, 'dev/scss/core'),
            resolve(__dirname, 'node_modules'),
          ],
          quietDeps: true,
          silenceDeprecations: ['import'],
        },
      },
    },

    build: {
      outDir: '.', // Output to project root (paths include directories)
      emptyOutDir: false,
      sourcemap: !isProd ? 'inline' : false,
      minify: false, // Plugin creates .min versions
      target: 'es2018',
      manifest: false,

      watch: isWatch ? {
        exclude: ['assets/**/*.js', 'assets/**/*.css', 'assets/css/**', 'inc/**/*.js', 'premium/**/*.js', 'node_modules/**'],
      } : null,

      rollupOptions: {
        input,
        // Preserve exports from entry points (prevents tree-shaking of addon exports)
        preserveEntrySignatures: 'exports-only',
        // Disable tree-shaking to preserve all exports
        treeshake: false,

        output: {
          format: 'es', // ES modules - use wp_enqueue_script_module() in WordPress 6.5+
          // Preserve the directory structure from entry keys
          entryFileNames: (chunkInfo) => {
            return `${chunkInfo.name}.js`;
          },
          chunkFileNames: 'assets/js/chunks/[name].js',
          assetFileNames: (assetInfo) => {
            // Use names array (newer Rollup API)
            const fileName = assetInfo.names?.[0] || '';
            if (fileName.endsWith('.css')) {
              return fileName;
            }
            return 'assets/[name][extname]';
          },

          // WordPress externals mapping
          globals: {
            'jquery': 'jQuery',
            '@wordpress/element': 'wp.element',
            '@wordpress/i18n': 'wp.i18n',
            '@wordpress/components': 'wp.components',
            '@wordpress/api-fetch': 'wp.apiFetch',
            '@wordpress/icons': 'wp.icons',
            '@wordpress/hooks': 'wp.hooks',
            '@wordpress/data': 'wp.data',
          },
        },

        external: [
          'jquery',
          '@wordpress/element',
          '@wordpress/i18n',
          '@wordpress/components',
          '@wordpress/api-fetch',
          '@wordpress/icons',
          '@wordpress/hooks',
          '@wordpress/data',
        ],
      },

      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, 'dev'),
        '@scss': resolve(__dirname, 'dev/scss'),
        '@js': resolve(__dirname, 'dev/js'),
        '@addons': resolve(__dirname, 'dev/js/addons'),
        '@common': resolve(__dirname, 'dev/js/common'),
        '@scss-addons': resolve(__dirname, 'dev/scss/addons'),
      },
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
