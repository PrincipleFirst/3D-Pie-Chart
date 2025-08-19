import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 专门用于构建 React 3D Pie Chart 库的配置
export default defineConfig({
  plugins: [react()],
  
  build: {
    lib: {
      entry: 'src/3dpie-react-lib.jsx',
      name: 'ThreeDPieChartReact',
      fileName: '3dpie-react',
      formats: ['es', 'umd']
    },

    rollupOptions: {
      // 不外部化依赖，全部打包进去
      external: [],
      output: {
        globals: {},
        // 固定 CSS 资产文件名，确保稳定路径
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return '3dpie-react.css'
          }
          return assetInfo.name || '[name][extname]'
        }
      }
    },

    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },

    // 输出目录
    outDir: 'dist-react-lib',

    // 清空输出目录
    emptyOutDir: true,

    // 生成 sourcemap
    sourcemap: false
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei']
  },

  // 定义全局变量，解决process未定义问题
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    'global': 'globalThis'
  },

  // 确保所有依赖都被正确处理
  ssr: {
    noExternal: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei']
  }
})
