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
  
  // 创建CSS2D元素
  useEffect(() => {
    if (!ref.current || !scene.userData.labelRenderer) return
    
    // 创建标签容器
    const labelDiv = document.createElement('div')
    labelDiv.className = 'css2d-label'
    labelDiv.style.cssText = `
      pointer-events: none;
      white-space: nowrap;
      font-family: 'Alibaba PuHuiTi 2.0', sans-serif;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      ${isLeft ? 'text-align: right;' : 'text-align: left;'}
    `
    
    // 生成HTML内容
    const rich = labelStyle.rich || {}
    let htmlContent = ''
    
    labelLines.forEach((line, idx) => {
      // 解析富文本格式 {key|内容}
      const parts = []
      let lastIndex = 0
      const regex = /\{(\w+)\|([^}]+)\}/g
      let match
      
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ text: line.slice(lastIndex, match.index), style: {} })
        }
        const key = match[1]
        const text = match[2]
        parts.push({ text, style: rich[key] || {} })
        lastIndex = regex.lastIndex
      }
      
      if (lastIndex < line.length) {
        parts.push({ text: line.slice(lastIndex), style: {} })
      }
      
      // 生成HTML
      htmlContent += '<div class="label-line" style="margin-bottom: 2px; line-height: 1.2;">'
      parts.forEach((part, i) => {
        const style = part.style
        const baseColor = style.color || labelStyle.color || 'white'
        const baseFontSize = style.fontSize || labelStyle.fontSize || '14px'
        const fontWeight = style.fontFamily === 'bold' ? 'bold' : 'normal'
        const textShadow = style.outlineWidth ? 
          `${style.outlineWidth} ${style.outlineWidth} ${style.outlineColor || 'black'}` : 
          '2px 2px 4px rgba(0,0,0,0.8)'
        
        htmlContent += `<span style="
          color: ${baseColor}; 
          font-size: ${baseFontSize}; 
          font-weight: ${fontWeight}; 
          margin-right: 4px; 
          text-shadow: ${textShadow};
        ">${part.text}</span>`
      })
      htmlContent += '</div>'
    })
    
    labelDiv.innerHTML = htmlContent
    
    // 创建CSS2DObject
    const labelObject = new CSS2DObject(labelDiv)
    
    // 设置标签位置偏移
    const offsetX = isLeft ? -0.5 : 0.5
    labelObject.position.set(offsetX, 0, 0)
    
    // 添加到3D场景
    ref.current.add(labelObject)
    ref.current.labelObject = labelObject
    
    // 通知位置变化
    if (onPositionChange) {
      const worldPosition = new THREE.Vector3()
      labelObject.getWorldPosition(worldPosition)
      onPositionChange([worldPosition.x, worldPosition.y, worldPosition.z])
    }
    
    return () => {
      if (labelObject && ref.current) {
        ref.current.remove(labelObject)
      }
    }
  }, [labelLines, isLeft, labelStyle, onPositionChange, scene.userData.labelRenderer])
  
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
