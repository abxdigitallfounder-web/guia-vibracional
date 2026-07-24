import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Navegadores modernos (tráfego pago é majoritariamente mobile atual)
    target: 'es2020',
    // Assets pequenos (<4kb) viram data-URI, evitando requisições extras
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    // Acelera o build; o Vercel comprime (gzip/brotli) na borda
    reportCompressedSize: false,
  },
})
