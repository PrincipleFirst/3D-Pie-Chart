import React, { useRef, useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import * as THREE from 'three'

// 主标签组件 - 使用CSS2DRenderer
const CSS2DLabels = ({ 
  labelLines, 
  position, 
  isLeft, 
  labelStyle = {}, 
  onPositionChange,
  className = '',
  style = {}
}) => {
  const ref = useRef()
  const { scene } = useThree()
  
  // 添加详细的调试信息
  console.log('CSS2DLabels render:', { 
    labelLines, 
    position, 
    isLeft, 
    labelStyle,
    sceneUserData: scene.userData,
    hasLabelRenderer: !!scene.userData.labelRenderer
  })
  
  // 校验标记（避免在 Hooks 之前 return）
  const hasValidLabelLines = Array.isArray(labelLines) && labelLines.length > 0
  const hasValidPosition = Array.isArray(position)
  
  // 使用 useMemo 缓存 HTML 内容，避免每次重新生成
  const htmlContent = useMemo(() => {
    if (!hasValidLabelLines) return ''
    let content = ''
    
    console.log('Building HTML content from labelLines:', labelLines)
    
    labelLines.forEach((line, idx) => {
      // 如果 line 是 HTML 字符串，直接使用
      if (typeof line === 'string' && line.includes('<')) {
        console.log('Using HTML line:', line)
        content += line
      } else {
        // 否则生成普通的 span 标签
        console.log('Using text line:', line)
        const inlineStyle = labelStyle.style ? ` style="${labelStyle.style}"` : ''
        content += `<div class="label-line">
          <span class="label-text"${inlineStyle}>${line}</span>
        </div>`
      }
    })
    
    console.log('Final HTML content:', content)
    return content
  }, [hasValidLabelLines, labelLines, labelStyle.style])
  
  // 使用 useMemo 缓存样式字符串，避免每次重新计算
  const labelStyles = useMemo(() => {
    // 默认样式：无边框无背景色，宽度自适应
    const defaultStyles = `
      pointer-events: none;
      white-space: nowrap;
      font-family: 'Alibaba PuHuiTi 2.0', sans-serif;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      ${isLeft ? 'text-align: right;' : 'text-align: left;'}
      
      /* 使用flex布局控制行间距 */
      .label-line {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: ${isLeft ? 'flex-end' : 'flex-start'};
      }
    `
    
    // 动态合并用户自定义样式 - 支持任意CSS属性
    let customStyles = ''
    if (style && typeof style === 'object') {
      Object.entries(style).forEach(([property, value]) => {
        if (value !== undefined && value !== null) {
          // 将驼峰命名转换为短横线命名 (如: backgroundColor -> background-color)
          const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase()
          customStyles += `${cssProperty}: ${value};`
        }
      })
    }
    
    return defaultStyles + customStyles
  }, [isLeft, style])
  
  // 创建CSS2D元素
  useEffect(() => {
    if (!hasValidLabelLines) return
    console.log('CSS2DLabels useEffect triggered:', {
      ref: !!ref.current,
      sceneUserData: scene.userData,
      labelRenderer: scene.userData.labelRenderer
    })
    
    if (!ref.current) {
      console.warn('CSS2DLabels: ref.current is null')
      return
    }
    
    if (!scene.userData.labelRenderer) {
      console.warn('CSS2DLabels: scene.userData.labelRenderer is not available')
      return
    }
    
    try {
      // 创建标签容器
      const labelDiv = document.createElement('div')
      labelDiv.className = `css2d-label ${className}`.trim()
      labelDiv.style.cssText = labelStyles
      labelDiv.innerHTML = htmlContent
      
      // 设置z-index确保标签在最上层
      labelDiv.style.zIndex = '1000'
      
      console.log('Created label div:', labelDiv)
      
      // 创建CSS2DObject
      const labelObject = new CSS2DObject(labelDiv)
      
      // 标签位置已经在父组件中计算好了，直接设置为(0,0,0)
      // 因为position prop已经包含了所有偏移
      labelObject.position.set(0, 0, 0)
      
      // 添加到3D场景
      ref.current.add(labelObject)
      ref.current.labelObject = labelObject
      
      console.log('Successfully added label to scene:', labelObject)
      
      return () => {
        if (labelObject && ref.current) {
          ref.current.remove(labelObject)
          console.log('Removed label from scene')
        }
      }
    } catch (error) {
      console.error('Error creating CSS2D label:', error)
    }
  }, [hasValidLabelLines, htmlContent, labelStyles, scene.userData.labelRenderer])
  
  // 监听位置变化，更新标签位置
  useEffect(() => {
    if (!ref.current || !ref.current.labelObject || !onPositionChange) return
    
    // 通知位置变化
    const worldPosition = new THREE.Vector3()
    ref.current.labelObject.getWorldPosition(worldPosition)
    onPositionChange([worldPosition.x, worldPosition.y, worldPosition.z])
  }, [position, onPositionChange])
  
  // 在所有 Hooks 之后再进行条件返回
  if (!hasValidLabelLines) {
    console.warn('CSS2DLabels: No labelLines provided')
    return null
  }
  if (!hasValidPosition) {
    console.warn('CSS2DLabels: Invalid position provided:', position)
    return null
  }

  return (
    <group ref={ref} position={position}>
      {/* 空的mesh，用于定位 */}
      <mesh visible={false}>
        <boxGeometry args={[0.001, 0.001, 0.001]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

export default CSS2DLabels
