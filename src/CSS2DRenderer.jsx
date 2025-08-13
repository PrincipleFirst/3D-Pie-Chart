import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

// CSS2DRenderer 配置组件
const CSS2DRendererProvider = ({ children }) => {
  const { scene, camera, gl } = useThree()
  const labelRendererRef = useRef()
  
  useEffect(() => {
    if (!labelRendererRef.current) {
      // 创建 CSS2DRenderer
      const labelRenderer = new CSS2DRenderer()
      labelRenderer.setSize(window.innerWidth, window.innerHeight)
      labelRenderer.domElement.style.position = 'absolute'
      labelRenderer.domElement.style.top = '0px'
      labelRenderer.domElement.style.pointerEvents = 'none'
      labelRenderer.domElement.style.zIndex = '1000'
      
      // 添加到 DOM
      document.body.appendChild(labelRenderer.domElement)
      labelRendererRef.current = labelRenderer
      
      // 存储到 three.js 场景中，供其他组件使用
      scene.userData.labelRenderer = labelRenderer
    }
    
    // 窗口大小变化处理
    const handleResize = () => {
      if (labelRendererRef.current) {
        labelRendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (labelRendererRef.current && labelRendererRef.current.domElement.parentNode) {
        labelRendererRef.current.domElement.parentNode.removeChild(labelRendererRef.current.domElement)
      }
    }
  }, [scene])
  
  // 渲染标签
  useFrame(() => {
    if (labelRendererRef.current && scene.userData.labelRenderer) {
      labelRendererRef.current.render(scene, camera)
    }
  })
  
  return children
}

export default CSS2DRendererProvider
