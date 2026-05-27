import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MotoERP - 오토바이 매장 관리',
        short_name: 'MotoERP',
        theme_color: '#E85D24',
        display: 'standalone',
        icons: [{
          src: '/icon.png',
          sizes: '192x192',
          type: 'image/png'
        }]
      }
    })
  ]
})