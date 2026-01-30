import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5000,
    },
    define: {
        'process.env': {},
        'global': 'globalThis',
        'Buffer': 'globalThis.Buffer'
    },
    build: {
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        minify: false
    }
});
