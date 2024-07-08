import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return {
    plugins: [
      vue(),
      // VitePWA({ 
      //   registerType: 'autoUpdate',
      //   manifest:false,
      //   devOptions: {
      //     enabled: true
      //   }
      // })
    ],
    server: {
      port: 5174
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
