import React, { useRef, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
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
  const { camera, scene } = useThree()
  
  // 创建CSS2D元素
  useEffect(() => {
    if (!ref.current) return
    
    // 创建CSS2D元素
    const labelDiv = document.createElement('div')
    labelDiv.className = 'css2d-label'
    labelDiv.style.cssText = `
      position: absolute;
      pointer-events: none;
      white-space: nowrap;
      font-family: 'Alibaba PuHuiTi 2.0', sans-serif;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      transform: translate(-50%, -50%);
      ${isLeft ? 'text-align: right;' : 'text-align: left;'}
      z-index: 1000;
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
    
    // 添加到DOM
    document.body.appendChild(labelDiv)
    ref.current.labelDiv = labelDiv
    
    return () => {
      if (labelDiv.parentNode) {
        labelDiv.parentNode.removeChild(labelDiv)
      }
    }
  }, [labelLines, isLeft, labelStyle])
  
  // 更新位置
  useFrame(() => {
    if (!ref.current || !ref.current.labelDiv) return
    
    const labelDiv = ref.current.labelDiv
    const vector = new THREE.Vector3()
    vector.setFromMatrixPosition(ref.current.matrixWorld)
    vector.project(camera)
    
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight
    
    labelDiv.style.left = x + 'px'
    labelDiv.style.top = y + 'px'
    
    // 通知位置变化
    if (onPositionChange) {
      onPositionChange([x, y])
    }
  })
  
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
