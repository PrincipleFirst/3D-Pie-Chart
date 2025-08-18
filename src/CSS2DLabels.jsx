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
  onPositionChange
}) => {
  const ref = useRef()
  const { scene } = useThree()
  
  // 使用 useMemo 缓存 HTML 内容，避免每次重新生成
  const htmlContent = useMemo(() => {
    let content = ''
    
    labelLines.forEach((line, idx) => {
      // 生成HTML，支持传入的style
      const inlineStyle = labelStyle.style ? ` style="${labelStyle.style}"` : ''
      content += `<div class="label-line">
        <span class="label-text"${inlineStyle}>${line}</span>
      </div>`
    })
    
    return content
  }, [labelLines, labelStyle.style])
  
  // 使用 useMemo 缓存样式字符串，避免每次重新计算
  const labelStyles = useMemo(() => `
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
    
  `, [isLeft])
  
  // 创建CSS2D元素
  useEffect(() => {
    if (!ref.current || !scene.userData.labelRenderer) return
    
    // 创建标签容器
    const labelDiv = document.createElement('div')
    labelDiv.className = 'css2d-label'
    labelDiv.style.cssText = labelStyles
    labelDiv.innerHTML = htmlContent
    
    // 创建CSS2DObject
    const labelObject = new CSS2DObject(labelDiv)
    
    // 标签位置已经在父组件中计算好了，直接设置为(0,0,0)
    // 因为position prop已经包含了所有偏移
    labelObject.position.set(0, 0, 0)
    
    // 添加到3D场景
    ref.current.add(labelObject)
    ref.current.labelObject = labelObject
    
    return () => {
      if (labelObject && ref.current) {
        ref.current.remove(labelObject)
      }
    }
  }, [htmlContent, labelStyles, scene.userData.labelRenderer])
  
  // 监听位置变化，更新标签位置
  useEffect(() => {
    if (!ref.current || !ref.current.labelObject || !onPositionChange) return
    
    // 通知位置变化
    const worldPosition = new THREE.Vector3()
    ref.current.labelObject.getWorldPosition(worldPosition)
    onPositionChange([worldPosition.x, worldPosition.y, worldPosition.z])
  }, [position, onPositionChange])
  
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
