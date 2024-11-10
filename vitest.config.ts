import { defineConfig, configDefaults, coverageConfigDefaults, mergeConfig } from 'vitest/config'
import viteConfig from './electron.vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['/tests/setup.ts'],
      exclude: [...configDefaults.exclude, './src/main.tsx'],
      coverage: {
        include: ['**/src/**'],
        exclude: [...coverageConfigDefaults.exclude, '**/src/main.tsx'],
        reportsDirectory: './tests/coverage'
      }
    }
  })
)
