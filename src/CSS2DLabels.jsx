import React, { useRef, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
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
  
  // 仅在开发需要时打开渲染期日志（避免每帧刷屏）
  // console.log('CSS2DLabels render:', { labelLines, position, isLeft })
  
  // 校验标记（避免在 Hooks 之前 return）
  const hasValidLabelLines = Array.isArray(labelLines) && labelLines.length > 0
  const hasValidPosition = Array.isArray(position)
  
  // 使用 useMemo 缓存 HTML 内容，避免每次重新生成
  const htmlContent = useMemo(() => {
    if (!hasValidLabelLines) return ''
    let content = ''
    

    labelLines.forEach((line, idx) => {
      // 如果 line 是 HTML 字符串，直接使用
      if (typeof line === 'string' && line.includes('<')) {
        content += line
      } else {
        // 否则生成普通的 span 标签
        const inlineStyle = labelStyle.style ? ` style="${labelStyle.style}"` : ''
        content += `<div class="label-line">
          <span class="label-text"${inlineStyle}>${line}</span>
        </div>`
      }
    })
    
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
    // console.log('CSS2DLabels useEffect triggered')
    
    if (!ref.current) {
      return
    }
    
    if (!scene.userData.labelRenderer) {
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
      
      // console.log('Created label div:', labelDiv)
      
      // 创建CSS2DObject
      const labelObject = new CSS2DObject(labelDiv)
      
      // 标签位置已经在父组件中计算好了，直接设置为(0,0,0)
      // 因为position prop已经包含了所有偏移
      labelObject.position.set(0, 0, 0)
      
      // 添加到3D场景
      ref.current.add(labelObject)
      ref.current.labelObject = labelObject
      
      // console.log('Successfully added label to scene:', labelObject)
      
      return () => {
        if (labelObject && ref.current) {
          ref.current.remove(labelObject)
          // console.log('Removed label from scene')
        }
      }
    } catch (error) {
      console.error('Error creating CSS2D label:', error)
    }
  }, [className, hasValidLabelLines, htmlContent, labelStyles])

  // 使用 useFrame 持续更新 three 对象的位置，避免通过 React 渲染驱动
  const targetRef = useRef(position && Array.isArray(position) ? new THREE.Vector3(...position) : new THREE.Vector3())

  // 当外部目标位置变更时，仅更新 ref，不触发重渲染
  useEffect(() => {
    if (Array.isArray(position) && position.length === 3) {
      if (!targetRef.current) targetRef.current = new THREE.Vector3()
      targetRef.current.set(position[0], position[1], position[2])
    }
  }, [position])

  // 每帧将当前 group 位置插值到目标位置
  useFrame((state, delta) => {
    if (!ref.current || !Array.isArray(position)) return
    const group = ref.current
    // 若未创建标签对象也无须更新
    // 平滑插值，系数可按需调整
    const lerpAlpha = Math.min(1, delta * 8)
    group.position.lerp(targetRef.current, lerpAlpha)

    // 可选：位置变更时回调（轻量，避免每帧昂贵计算）
    if (group.labelObject && onPositionChange) {
      const worldPosition = new THREE.Vector3()
      group.labelObject.getWorldPosition(worldPosition)
      onPositionChange([worldPosition.x, worldPosition.y, worldPosition.z])
    }
  })
  
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
    <group ref={ref}>
      {/* 空的mesh，用于定位 */}
      <mesh visible={false}>
        <boxGeometry args={[0.001, 0.001, 0.001]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

// 避免无意义重渲染：仅当关键值变更才更新
const arePropsEqual = (prev, next) => {
  // labelLines：长度与每项内容（浅比较字符串）
  const prevLines = Array.isArray(prev.labelLines) ? prev.labelLines : []
  const nextLines = Array.isArray(next.labelLines) ? next.labelLines : []
  if (prevLines.length !== nextLines.length) return false
  for (let i = 0; i < prevLines.length; i++) {
    if (prevLines[i] !== nextLines[i]) return false
  }

  // position：数值相同则认为未变（useFrame 内部处理平滑移动）
  const pPos = Array.isArray(prev.position) ? prev.position : []
  const nPos = Array.isArray(next.position) ? next.position : []
  if (pPos.length !== nPos.length) return false
  for (let i = 0; i < pPos.length; i++) {
    if (pPos[i] !== nPos[i]) return false
  }

  // isLeft、className：基本类型比较
  if (prev.isLeft !== next.isLeft) return false
  if (prev.className !== next.className) return false

  // labelStyle.style 与 style（对象）：只关心其序列化值（若很大可改为白名单）
  const prevLabelInline = prev.labelStyle?.style || ''
  const nextLabelInline = next.labelStyle?.style || ''
  if (prevLabelInline !== nextLabelInline) return false

  const prevStyleStr = JSON.stringify(prev.style || {})
  const nextStyleStr = JSON.stringify(next.style || {})
  if (prevStyleStr !== nextStyleStr) return false

  // onPositionChange：引用变化不应导致渲染（在 useFrame 内调用）
  return true
}

export default React.memo(CSS2DLabels, arePropsEqual)
