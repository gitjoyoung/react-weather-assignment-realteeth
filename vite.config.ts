import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          'ui-libs': ['lucide-react', 'embla-carousel-react', 'cmdk'],
          'radix-ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-slot'],
          'utils': ['axios', 'es-hangul', 'use-debounce', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          'react-query': ['@tanstack/react-query'],
        },
      },
    },
  },
})