import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const requiredEnvs = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]

  requiredEnvs.forEach((key) => {
    if (!env[key]) {
      console.warn(`\n\n⚠️ ПОПЕРЕДЖЕННЯ: Змінна ${key} відсутня! Використовуються заглушки.\n`)
      process.env[key] = 'placeholder'
    }
  })

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@services': path.resolve(__dirname, './src/services')
      }
    },
    css: {
      modules: {
        localsConvention: 'camelCase'
      }
    }
  }
})