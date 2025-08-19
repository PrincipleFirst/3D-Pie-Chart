import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
    // 生产环境优化
    build: {
      // 启用代码分割
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            three: ['three', '@react-three/fiber', '@react-three/drei'],
            controls: ['leva']
          }
        }
      },
      
      // 启用压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      },
      
      // 资源内联阈值
      assetsInlineLimit: 4096,
      
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      
      // 启用源码映射（生产环境可选）
      sourcemap: !isProduction
    },
    
    // 开发服务器配置
    server: {
      port: 3000,
      open: true
    },
    
    // 预览服务器配置
    preview: {
      port: 4173,
      open: true
    },
    
    // 环境变量配置
    define: {
      __DEV__: !isProduction
    }
  }
})
