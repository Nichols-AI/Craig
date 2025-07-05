import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],

  // Path resolution
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  // Build configuration for code splitting
  build: {
    // Increase chunk size warning limit to 1500 KB
    chunkSizeWarningLimit: 1500,
    // Enable minification
    minify: 'esbuild',
    // Enable source maps for production debugging
    sourcemap: false,
    // Target modern browsers for smaller builds
    target: 'es2020',
    
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting and caching
        manualChunks: {
          // Core vendor chunks (loaded on every page)
          'react-core': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          
          // UI library chunks (lazy loaded)
          'ui-components': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-select', 
            '@radix-ui/react-tabs', 
            '@radix-ui/react-tooltip', 
            '@radix-ui/react-switch', 
            '@radix-ui/react-popover',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-label',
            '@radix-ui/react-toast'
          ],
          
          // Heavy editor dependencies (only loaded when needed)
          'editor-heavy': ['@uiw/react-md-editor', 'react-markdown', 'remark-gfm'],
          'syntax-highlighting': ['react-syntax-highlighter'],
          
          // Tauri system APIs
          'tauri-apis': [
            '@tauri-apps/api', 
            '@tauri-apps/plugin-dialog', 
            '@tauri-apps/plugin-shell',
            '@tauri-apps/plugin-opener',
            '@tauri-apps/plugin-global-shortcut'
          ],
          
          // Utility libraries
          'utilities': ['date-fns', 'clsx', 'tailwind-merge', 'ansi-to-html'],
          'data-utils': ['@tanstack/react-virtual', 'zod'],
          
          // Chart and visualization (only for usage dashboard)
          // 'charts': ['recharts'], // Removed - not used
          
          // Form handling - removed unused
          // 'forms': ['react-hook-form', '@hookform/resolvers'],
          
          // Large misc libraries
          'misc-heavy': ['diff'] // html2canvas removed
        },
        
        // Optimize chunk naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
        
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash].css';
          }
          return 'assets/[name]-[hash][extname]';
        },
        
        // Entry point naming
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
}));
