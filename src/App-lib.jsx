import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import Pie from './Pie'
import { getConfig } from './config'
import { isFeatureEnabled } from './env'
import CSS2DRenderer from './CSS2DRenderer'

// 库版本的App组件
function ThreeDPieChartLib({ 
  containerId, 
  options = {}, 
  onSliceClick,
  onChartReady 
}) {
  const [config, setConfig] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 合并默认配置和用户配置
    const defaultConfig = getConfig()
    const mergedConfig = mergeConfig(defaultConfig, options)
    setConfig(mergedConfig)
  }, [options])

  useEffect(() => {
    if (config && !isReady) {
      setIsReady(true)
      if (onChartReady) {
        onChartReady(config)
      }
    }
  }, [config, isReady, onChartReady])

  // 处理扇区点击
  const handleSliceClick = (index, item) => {
    if (onSliceClick) {
      onSliceClick(index, item)
    }
  }

  if (!config) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ 
          background: config.style.backgroundColor,
          width: '100%',
          height: '100%'
        }}
      >
        <ambientLight intensity={config.lighting.ambientLightIntensity} />
        <spotLight
          position={[10, 15, 10]}
          angle={0.1}
          penumbra={1}
          intensity={config.lighting.spotLightIntensity}
          castShadow
        />
        
        <Pie 
          data={config.data}
          layout={config.layout}
          style={config.style}
          interaction={config.interaction}
          onSliceClick={handleSliceClick}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={config.interaction.spinSpeed > 0}
          autoRotateSpeed={config.interaction.spinSpeed}
        />
        
        <Environment path="../public/hdri/" files={config.lighting.environmentFile} />
        
        {/* CSS2D标签渲染器 */}
        <CSS2DRenderer />
      </Canvas>
    </div>
  )
}

// 配置合并函数
function mergeConfig(defaultConfig, userConfig) {
  const merged = { ...defaultConfig }
  
  for (const key in userConfig) {
    if (userConfig.hasOwnProperty(key)) {
      if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
        merged[key] = mergeConfig(merged[key] || {}, userConfig[key])
      } else {
        merged[key] = userConfig[key]
      }
    }
  }
  
  return merged
}

export default ThreeDPieChartLib
