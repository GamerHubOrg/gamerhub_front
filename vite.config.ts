import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(mode)
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return {
    plugins: [vue()],
    server: {
      port: 5174
    }
  }
})
