import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Завантажуємо змінні оточення з поточної директорії
  const env = loadEnv(mode, process.cwd(), '')

  // Список обов'язкових змінних
  const requiredEnvs = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_GEMINI_API_KEY'
  ]

  // Жорстка перевірка перед збіркою
  requiredEnvs.forEach((key) => {
    if (!env[key]) {
      throw new Error(`\n\n❌ ПЕРЕРВАНО: Змінна ${key} відсутня!\nПеревір налаштування в панелі хостингу.\n`)
    }
  })

  return {
    plugins: [react()],
    css: {
      modules: {
        localsConvention: 'camelCase'
      }
    }
  }
})