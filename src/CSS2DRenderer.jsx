import React, { useEffect, useRef, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

// CSS2DRenderer 配置组件
const CSS2DRendererProvider = ({ children }) => {
  const { scene, camera, gl } = useThree()
  const labelRendererRef = useRef()
  
  // 使用 useCallback 缓存事件处理函数
  const handleResize = useCallback(() => {
    if (labelRendererRef.current) {
      const container = gl.domElement.parentElement
      if (container) {
        const rect = container.getBoundingClientRect()
        labelRendererRef.current.setSize(rect.width, rect.height)
      }
    }
  }, [gl])
  
  useEffect(() => {
    if (!labelRendererRef.current) {
      // 创建 CSS2DRenderer
      const labelRenderer = new CSS2DRenderer()
      
      // 获取容器尺寸
      const container = gl.domElement.parentElement
      if (container) {
        const rect = container.getBoundingClientRect()
        labelRenderer.setSize(rect.width, rect.height)
      }
      
      labelRenderer.domElement.style.position = 'absolute'
      labelRenderer.domElement.style.top = '0px'
      labelRenderer.domElement.style.left = '0px'
      labelRenderer.domElement.style.pointerEvents = 'none'
      labelRenderer.domElement.style.zIndex = '1000'
      
      // 添加到容器而不是body
      if (container) {
        container.appendChild(labelRenderer.domElement)
      }
      
      labelRendererRef.current = labelRenderer
      
      // 存储到 three.js 场景中，供其他组件使用
      scene.userData.labelRenderer = labelRenderer
    }
    
    // 窗口大小变化处理
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (labelRendererRef.current && labelRendererRef.current.domElement.parentNode) {
        labelRendererRef.current.domElement.parentNode.removeChild(labelRendererRef.current.domElement)
      }
    }
  }, [scene, gl, handleResize])
  
  // 渲染标签
  useFrame(() => {
    if (labelRendererRef.current && scene.userData.labelRenderer) {
      labelRendererRef.current.render(scene, camera)
    }
  })
  
  return children
}

export default CSS2DRendererProvider
