import { env, isFeatureEnabled } from './env'

// 生产环境配置文件
export const defaultConfig = {
  // 饼图数据配置
  data: [
    {
      value: 1.5,
      color: '#ff6b6b',
      label: "<div style='text-align: center;'><div style='color: #ff6b6b; font-size: 1.2em; font-weight: bold; text-shadow: 0 0 10px #ff6b6b; animation: glow 2s ease-in-out infinite alternate; margin-bottom: 12px;'>🔥 产品A 热销版 🔥</div><div style='color: #4ecdc4; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='background: linear-gradient(45deg, #4ecdc4, #44a08d); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>✨ 全新升级 ✨</span></div><div style='color: #feca57; font-size: 0.8em; font-style: italic;'><span style='border: 1px solid #feca57; padding: 1px 4px; border-radius: 3px; background: rgba(254, 202, 87, 0.1);'>限时特价 8.8折</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelLineColor: '#ff0000',
      labelLineWidth: 1,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      },
      labelLineStyle: {
        labelOffset: 30,
      }
    },
    {
      value: 0.85,
      color: '#45b7d1',
      label: "<div style='text-align: center;'><div style='color: #45b7d1; font-size: 1.1em; font-weight: bold; margin-bottom: 12px;'><span style='background: linear-gradient(90deg, #45b7d1, #96ceb4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>🚀 产品B 旗舰版</span></div><div style='color: #96ceb4; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='border-left: 3px solid #96ceb4; padding-left: 8px; background: rgba(150, 206, 180, 0.1);'>💎 钻石品质保证</span></div><div style='color: #feca57; font-size: 0.8em;'><span style='background: linear-gradient(45deg, #feca57, #ff9ff3); padding: 2px 6px; border-radius: 4px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);'>VIP 专属服务</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelLineColor: '#0000ff',
      labelLineWidth: 1,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    },
    {
      value: 0.6,
      color: '#ffd700',
      label: "<div style='text-align: center;'><div style='color: #ffd700; font-size: 1.1em; font-weight: bold; text-shadow: 0 0 8px #ffd700; margin-bottom: 12px;'><span style='background: radial-gradient(circle, #ffd700, #ffed4e); padding: 2px 8px; border-radius: 5px; color: #333;'>⭐ 产品C 至尊版 ⭐</span></div><div style='color: #ff9ff3; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='border: 2px dashed #ff9ff3; padding: 1px 6px; border-radius: 3px; background: rgba(255, 159, 243, 0.1);'>🎯 精准定位 智能推荐</span></div><div style='color: #54a0ff; font-size: 0.8em; font-style: italic;'><span style='background: linear-gradient(135deg, #54a0ff, #5f27cd); color: white; padding: 1px 5px; border-radius: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);'>AI 驱动 未来科技</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelLineColor: '#00ff00',
      labelLineWidth: 1,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    },
    {
      value: 0.4,
      color: '#ff9ff3',
      label: "<div style='text-align: center;'><div style='color: #ff9ff3; font-size: 1.1em; font-weight: bold; margin-bottom: 12px;'><span style='background: linear-gradient(45deg, #ff9ff3, #f368e0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 15px #ff9ff3;'>🎭 产品D 艺术版</span></div><div style='color: #54a0ff; font-size: 0.9em; margin: 2px 0;  margin-bottom: 22px;'><span style='border: 2px solid #54a0ff; border-radius: 15px; padding: 2px 8px; background: linear-gradient(135deg, rgba(84, 160, 255, 0.2), rgba(95, 39, 205, 0.2));'>🎨 创意无限 艺术无界</span></div><div style='color: #ff6b6b; font-size: 0.8em; font-style: italic;'><span style='background: radial-gradient(circle, #ff6b6b, #ee5a24); color: white; padding: 1px 6px; border-radius: 4px; box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);'>🔥 限时抢购 库存紧张</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    },
    {
      value: 0.3,
      color: '#00d2d3',
      label: "<div style='text-align: center;'><div style='color: #00d2d3; font-size: 1.1em; font-weight: bold; margin-bottom: 12px;'><span style='background: linear-gradient(90deg, #00d2d3, #54a0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 12px #00d2d3;'>🌟 产品E 探索版</span></div><div style='color: #5f27cd; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='border-left: 4px solid #5f27cd; padding-left: 10px; background: linear-gradient(90deg, rgba(95, 39, 205, 0.1), rgba(84, 160, 255, 0.1));'>🔮 神秘功能 即将揭晓</span></div><div style='color: #ff9ff3; font-size: 0.8em;'><span style='background: linear-gradient(135deg, #ff9ff3, #f368e0); color: white; padding: 2px 8px; border-radius: 6px; box-shadow: 0 3px 10px rgba(255, 159, 243, 0.4); text-shadow: 1px 1px 2px rgba(0,0,0,0.3);'>🚀 敬请期待 惊喜不断</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    },
    {
      value: 0.25,
      color: '#ffd700',
      label: "<div style='text-align: center;'><div style='color: #ffd700; font-size: 1.2em; font-weight: bold; margin-bottom: 12px;'><span style='background: linear-gradient(45deg, #ffd700, #ffed4e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 20px #ffd700;'>👑 产品F VIP 专属</span></div><div style='color: #ff9ff3; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='border: 3px solid #ff9ff3; border-radius: 20px; padding: 3px 10px; background: linear-gradient(135deg, rgba(255, 159, 243, 0.2), rgba(243, 104, 224, 0.2)); box-shadow: 0 4px 15px rgba(255, 159, 243, 0.3);'>💎 尊享特权 专属服务</span></div><div style='color: #54a0ff; font-size: 0.8em; font-style: italic;'><span style='background: radial-gradient(circle, #54a0ff, #5f27cd); color: white; padding: 2px 8px; border-radius: 5px; box-shadow: 0 3px 12px rgba(84, 160, 255, 0.4); text-shadow: 1px 1px 3px rgba(0,0,0,0.3);'>🚀 优先体验 最新功能</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    },
    {
      value: 0.2,
      color: '#ff6b6b',
      label: "<div style='text-align: center;'><div style='color: #ff6b6b; font-size: 1.1em; font-weight: bold; margin-bottom: 12px;'><span style='background: linear-gradient(90deg, #ff6b6b, #ee5a24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 15px #ff6b6b;'>🏢 产品G 企业版</span></div><div style='color: #4caf50; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='border: 2px solid #4caf50; border-radius: 12px; padding: 2px 8px; background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2)); box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);'>✅ 官方推荐 品质保证</span></div><div style='color: #2196f3; font-size: 0.8em;'><span style='background: linear-gradient(135deg, #2196f3, #1976d2); color: white; padding: 1px 6px; border-radius: 4px; box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4); text-shadow: 1px 1px 2px rgba(0,0,0,0.3);'>🔒 企业级安全 数据保护</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    },
    {
      value: 0.15,
      color: '#9c27b0',
      label: "<div style='text-align: center;'><div style='color: #9c27b0; font-size: 1.2em; font-weight: bold; margin-bottom: 12px;'><span style='background: linear-gradient(45deg, #9c27b0, #673ab7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 18px #9c27b0;'>🚢 产品H 旗舰版</span></div><div style='color: #e91e63; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='border: 2px dashed #e91e63; border-radius: 15px; padding: 3px 10px; background: linear-gradient(135deg, rgba(233, 30, 99, 0.1), rgba(156, 39, 176, 0.1)); box-shadow: 0 3px 12px rgba(233, 30, 99, 0.2);'>💫 限量发售 珍藏版</span></div><div style='color: #ff9800; font-size: 0.8em; font-style: italic;'><span style='background: radial-gradient(circle, #ff9800, #f57c00); color: white; padding: 2px 8px; border-radius: 6px; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4); text-shadow: 1px 1px 3px rgba(0,0,0,0.3);'>🔥 抢购倒计时 仅剩 99 套</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    },
    {
      value: 0.12,
      color: '#673ab7',
      label: "<div style='text-align: center;'><div style='color: #673ab7; font-size: 1.1em; font-weight: bold; margin-bottom: 12px;'><span style='background: linear-gradient(90deg, #673ab7, #3f51b5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 16px #673ab7;'>🎨 产品I 定制版</span></div><div style='color: #00bcd4; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='border: 3px solid #00bcd4; border-radius: 18px; padding: 3px 10px; background: linear-gradient(135deg, rgba(0, 188, 212, 0.2), rgba(0, 150, 136, 0.2)); box-shadow: 0 4px 16px rgba(0, 188, 212, 0.3);'>✨ 个性化定制 独一无二</span></div><div style='color: #ff5722; font-size: 0.8em;'><span style='background: linear-gradient(135deg, #ff5722, #e64a19); color: white; padding: 2px 8px; border-radius: 5px; box-shadow: 0 3px 12px rgba(255, 87, 34, 0.4); text-shadow: 1px 1px 3px rgba(0,0,0,0.3);'>🎯 专业团队 一对一服务</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    },
    {
      value: 0.1,
      color: '#ff9800',
      label: "<div style='text-align: center;'><div style='color: #ff9800; font-size: 1.2em; font-weight: bold; margin-bottom: 12px;'><span style='background: linear-gradient(45deg, #ff9800, #ff5722); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 20px #ff9800;'>🔥 产品J 热门版</span></div><div style='color: #e91e63; font-size: 0.9em; margin: 2px 0; margin-bottom: 22px;'><span style='border: 2px solid #e91e63; border-radius: 20px; padding: 3px 10px; background: linear-gradient(135deg, rgba(233, 30, 99, 0.2), rgba(156, 39, 176, 0.2)); box-shadow: 0 4px 18px rgba(233, 30, 99, 0.3);'>💥 销量冠军 用户首选</span></div><div style='color: #4caf50; font-size: 0.8em; font-style: italic;'><span style='background: radial-gradient(circle, #4caf50, #388e3c); color: white; padding: 2px 8px; border-radius: 6px; box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4); text-shadow: 1px 1px 3px rgba(0,0,0,0.3);'>⚡ 闪电发货 24小时送达</span></div></div>",
      explode: false,
      height: 0.5,
      offset: 0,
      labelStyle: {
        labelOffset: 100,
        color: '#ffffff',
        fontSize: 0.12,
      }
    }
  ],

  // 样式配置
  style: {
    backgroundColor: '#1f2937',
    roughness: 0.2,
    metalness: 0.0,
  },

  // 光照配置
  lighting: {
    ambientLightIntensity: 1.2,
    spotLightIntensity: 1.75,
    environmentFile: 'dikhololo_night_1k.hdr',
  },

  // 摄像机配置（可通过 options 覆盖）
  camera: {
    position: [2, 1.5, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: 50,
    near: 0.1,
    far: 1000,
    // 交互限制（OrbitControls）
    minPolarAngle: 0.2,    // 约 11.5°
    maxPolarAngle: Math.PI - 0.2,
    minDistance: 2,
    maxDistance: 20,
    enableDamping: true,
    dampingFactor: 0.08
  },

  // 画布尺寸配置（容器内相对尺寸）
  dimensions: {
    width: '100%',
    height: '100%',
    pixelRatio: undefined // 默认使用浏览器 devicePixelRatio
  },

  // 特效配置
  effects: {
    showBloom: false,
    bloomStrength: 1,
    bloomRadius: 1.5,
    bloomThreshold: 0.15,
  },

  // 交互配置
  interaction: {
    spinSpeed: 0.0,
    showValues: true,
    valuesAsPercent: true,
  },

  // 布局配置
  layout: {
    title: env.appTitle,
    titleMaxWidth: 80,
    titleOffset: -30,
    innerRadius: 2,
    outerRadius: 150,
    cornerRadius: 0,
    padAngle: 0.05,
    allHeights: 0.5,
    valueLabelPosition: 0.65,
  },

  // 控制面板配置
  controls: {
    visible: isFeatureEnabled('controlPanel'),           // 是否显示控制面板
    enabled: isFeatureEnabled('controlPanel'),           // 是否启用控制功能
    urlSync: isFeatureEnabled('urlSync'),               // 是否启用 URL 同步
    features: {              // 具体功能控制
      title: true,
      dimensions: true,
      lighting: true,
      material: true,
      glow: true,
      positioning: true
    },
    defaultValues: {},       // 默认值配置
    presets: []             // 预设配置
  }
}

// 环境检测
export const isProduction = env.isProduction

// 获取配置
export function getConfig() {
  return defaultConfig
}

// 验证配置
export function validateConfig(config) {
  // 基础验证逻辑
  if (!config.data || !Array.isArray(config.data)) {
    console.warn('Invalid data configuration')
    return false
  }
  
  if (config.data.length < 2) {
    console.warn('At least 2 data items are required')
    return false
  }
  
  return true
}
