import React, { useState, useEffect, useRef, useMemo } from 'react'
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
  
  // 添加 OrbitControls 的 ref（必须在任何使用之前声明）
  const orbitControlsRef = useRef()

  // 暴露相机控制方法给外部（useMemo 保证引用稳定）
  const cameraControls = useMemo(() => ({
    // 重置相机到初始位置
    resetCamera: () => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.reset()
      }
    },
    
    // 设置相机位置
    setCameraPosition: (x, y, z) => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.object.position.set(x, y, z)
        orbitControlsRef.current.update()
      }
    },
    
    // 设置相机目标点
    setCameraTarget: (x, y, z) => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(x, y, z)
        orbitControlsRef.current.update()
      }
    },
    
    // 控制自动旋转
    setAutoRotate: (enabled, speed = 1.0) => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.autoRotate = enabled
        orbitControlsRef.current.autoRotateSpeed = speed
      }
    },
    
    // 设置相机距离限制
    setDistanceLimits: (min, max) => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.minDistance = min
        orbitControlsRef.current.maxDistance = max
      }
    },
    
    // 设置俯仰角限制
    setPolarAngleLimits: (min, max) => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.minPolarAngle = min
        orbitControlsRef.current.maxPolarAngle = max
      }
    },
    
    // 动态更新相机配置
    updateCameraConfig: (newCameraConfig) => {
      if (orbitControlsRef.current) {
        const controls = orbitControlsRef.current
        
        // 更新目标点
        if (newCameraConfig.target) {
          controls.target.set(...newCameraConfig.target)
        }
        
        // 更新距离限制
        if (newCameraConfig.minDistance !== undefined) {
          controls.minDistance = newCameraConfig.minDistance
        }
        if (newCameraConfig.maxDistance !== undefined) {
          controls.maxDistance = newCameraConfig.maxDistance
        }
        
        // 更新俯仰角限制
        if (newCameraConfig.minPolarAngle !== undefined) {
          controls.minPolarAngle = newCameraConfig.minPolarAngle
        }
        if (newCameraConfig.maxPolarAngle !== undefined) {
          controls.maxPolarAngle = newCameraConfig.maxPolarAngle
        }
        
        // 更新阻尼设置
        if (newCameraConfig.enableDamping !== undefined) {
          controls.enableDamping = newCameraConfig.enableDamping
        }
        if (newCameraConfig.dampingFactor !== undefined) {
          controls.dampingFactor = newCameraConfig.dampingFactor
        }
        
        // 更新控制器
        controls.update()
      }
    },
    
    // 获取当前相机状态
    getCameraState: () => {
      if (orbitControlsRef.current) {
        const controls = orbitControlsRef.current
        return {
          position: controls.object.position.toArray(),
          target: controls.target.toArray(),
          distance: controls.getDistance(),
          autoRotate: controls.autoRotate,
          autoRotateSpeed: controls.autoRotateSpeed,
          minDistance: controls.minDistance,
          maxDistance: controls.maxDistance,
          minPolarAngle: controls.minPolarAngle,
          maxPolarAngle: controls.maxPolarAngle,
          enableDamping: controls.enableDamping,
          dampingFactor: controls.dampingFactor
        }
      }
      return null
    }
  }), [])

  useEffect(() => {
    // 合并默认配置和用户配置
    const defaultConfig = getConfig()
    const mergedConfig = mergeConfig(defaultConfig, options)
    setConfig(mergedConfig)
  }, [options])

  // 监听相机配置变化并自动应用
  useEffect(() => {
    if (config && orbitControlsRef.current) {
      const controls = orbitControlsRef.current
      
      // 应用相机配置
      if (config.camera) {
        // 设置目标点
        if (config.camera.target) {
          controls.target.set(...config.camera.target)
        }
        
        // 设置距离限制
        if (config.camera.minDistance !== undefined) {
          controls.minDistance = config.camera.minDistance
        }
        if (config.camera.maxDistance !== undefined) {
          controls.maxDistance = config.camera.maxDistance
        }
        
        // 设置俯仰角限制
        if (config.camera.minPolarAngle !== undefined) {
          controls.minPolarAngle = config.camera.minPolarAngle
        }
        if (config.camera.maxPolarAngle !== undefined) {
          controls.maxPolarAngle = config.camera.maxPolarAngle
        }
        
        // 设置阻尼
        if (config.camera.enableDamping !== undefined) {
          controls.enableDamping = config.camera.enableDamping
        }
        if (config.camera.dampingFactor !== undefined) {
          controls.dampingFactor = config.camera.dampingFactor
        }
        
        // 更新控制器
        controls.update()
      }
    }
  }, [config])

  useEffect(() => {
    if (config && !isReady) {
      setIsReady(true)
      if (onChartReady) {
        // 暴露配置和相机控制方法
        onChartReady({
          ...config,
          cameraControls
        })
      }
    }
  }, [config, isReady, onChartReady, cameraControls])

  // 处理扇区点击
  const handleSliceClick = (index, item) => {
    if (onSliceClick) {
      onSliceClick(index, item)
    }
  }

  

  const layout = (config && config.layout) || {}
  const canvasCfg = (config && config.canvas) || {}

  if (!config) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ 
          position: (config.camera && config.camera.position) || [0, 0, 5], 
          fov: (config.camera && config.camera.fov) || 50,
          near: (config.camera && config.camera.near) || 0.1,
          far: (config.camera && config.camera.far) || 1000,
          up: (config.camera && config.camera.up) || [0,1,0]
        }}
        style={{
          background: config.style.backgroundColor,
        }}
        dpr={[1, 2]}
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
          innerRadius={layout.innerRadius}
          outerRadius={layout.outerRadius}
          cornerRadius={layout.cornerRadius}
          padAngle={layout.padAngle}
          roughness={config.style.roughness}
          metalness={config.style.metalness}
          valueLabelPosition={layout.valueLabelPosition}
          showValues={false}
          valuesAsPercent={config.interaction.valuesAsPercent}
          onClickSlice={handleSliceClick}
        />
        
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={config.interaction.spinSpeed > 0}
          autoRotateSpeed={config.interaction.spinSpeed}
          target={config.camera?.target || [0,0,0]}
          minPolarAngle={config.camera?.minPolarAngle}
          maxPolarAngle={config.camera?.maxPolarAngle}
          minDistance={config.camera?.minDistance}
          maxDistance={config.camera?.maxDistance}
          enableDamping={config.camera?.enableDamping}
          dampingFactor={config.camera?.dampingFactor}
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
