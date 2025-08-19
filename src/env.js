// 环境配置管理
export const env = {
  // 环境检测 - 修复 Vite 环境变量检测
  isProduction: import.meta.env.PROD === true,
  isDevelopment: import.meta.env.DEV === true,
  
  // 应用配置
  appTitle: import.meta.env.VITE_APP_TITLE || '3D Pie Chart',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  
  // 功能开关
  features: {
    // 开发环境功能
    development: {
      urlSync: true,
      controlPanel: true,
      debugMode: true,
      hotReload: true
    },
    
    // 生产环境功能
    production: {
      urlSync: false,
      controlPanel: false,
      debugMode: false,
      hotReload: false
    }
  }
}

// 获取当前环境的功能配置
export function getFeatureConfig() {
  return env.isProduction ? env.features.production : env.features.development
}

// 检查功能是否启用
export function isFeatureEnabled(featureName) {
  const featureConfig = getFeatureConfig()
  return featureConfig[featureName] || false
}
