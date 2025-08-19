import { defineConfig } from 'vite'

// 专门用于构建 3D Pie Chart 库的配置
export default defineConfig({
  build: {
    lib: {
      entry: 'src/3dpie-lib.js',
      name: 'ThreeDPieChart',
      fileName: '3dpie',
      formats: ['es', 'umd']
    },
    
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE'
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
    outDir: 'dist-lib',
    
    // 清空输出目录
    emptyOutDir: true
  }
})
