import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5000,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Vendor chunks
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'react-vendor';
                        if (id.includes('@mui') || id.includes('@emotion')) return 'mui-vendor';
                        if (id.includes('ethers')) return 'ethers-vendor';
                        if (id.includes('react-icons')) return 'icons-vendor';
                        if (id.includes('react-hot-toast')) return 'toast-utils';
                        if (id.includes('react-router')) return 'router-vendor';
                        return 'vendor-others';
                    }

                    // Source code chunks
                    if (id.includes('/components/Main/')) {
                        if (id.includes('Network') || id.includes('Wallet') || id.includes('Transaction')) {
                            return 'main-core';
                        }
                        if (id.includes('Contract') || id.includes('BytecodeAnalyzer')) {
                            return 'main-contract';
                        }
                        if (id.includes('JsonRequest') || id.includes('Utilities')) {
                            return 'main-tools';
                        }
                    }

                    if (id.includes('/components/Modals/')) return 'modals';
                    if (id.includes('/services/')) return 'services';
                    if (id.includes('/contexts/')) return 'contexts';
                    if (id.includes('/utils/')) return 'utils';
                }
            }
        },
        chunkSizeWarningLimit: 1000
    }
});
