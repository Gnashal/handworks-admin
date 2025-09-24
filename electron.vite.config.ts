import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@lib': resolve('src/main/lib'),
        '@common': resolve('src/main/common')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: 'src/renderer/assets/**',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@common': resolve('src/renderer/common'),
        '@assets': resolve('src/renderer/assets'),
        '@components': resolve('src/renderer/src/components'),
        '@hooks': resolve('src/renderer/src/hooks'),
        '@utils': resolve('src/renderer/src/utils'),
        '@mocks': resolve('src/renderer/src/mocks')
      }
    },
    plugins: [react()]
  }
})
