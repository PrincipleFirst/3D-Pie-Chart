import {
  animated,
  config as springConfigs,
  useSpring,
} from '@react-spring/three'


import React, { useMemo, useCallback, useLayoutEffect, useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { palette } from './theme'
import CSS2DLabels from './CSS2DLabels'

import { Line } from '@react-three/drei'

const springConfig = springConfigs.wobbly





// 动态标签线组件，位置与标签完全同步
const DynamicLabelLine = ({ 
  start, 
  mid, 
  end, 
  color, 
  width,
  calculateAdjustedPosition,
  onPositionChange  // 回调函数，通知位置变化
}) => {
  const { camera } = useThree()
  
  // 使用 useFrame 每帧更新位置，实现动态效果
  useFrame(() => {
    if (!start || !mid || !end || !calculateAdjustedPosition) return
    
    // 每帧计算新的位置
    const newEnd = calculateAdjustedPosition(camera)
    
    // 更新本地状态用于线条显示
    setCurrentEnd(newEnd)
    
    // 同时通知父组件更新标签位置，确保同步
    if (onPositionChange) {
      onPositionChange(newEnd)
    }
  })
  
  // 初始渲染时使用传入的end位置
  const [currentEnd, setCurrentEnd] = useState(end)
  
  // 当end prop变化时更新当前端点
  useEffect(() => {
    setCurrentEnd(end)
  }, [end])
  
  return (
    <Line
      points={[start, mid, currentEnd]}
      color={color}
      lineWidth={width}
      dashed={false}
    />
  )
}

const PieSlice = ({
  i,
  shape,
  arcs,
  datum,
  arcGenerator,
  extrudeSettings,
  totalValue,
  height,
  onClick,

  offset = 0,
  roughness = 0.2,
  metalness = 0,

}) => {
  const arc = arcs[i]
  const label = datum.label
  const color = datum.color ?? palette[i % palette.length]
  let xOffset = 0
  let zOffset = 0
  // explode the pieces
  // 1. we need to get middle angle of the slice
  const theta = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2

  // 2. unit direction vector to offset by
  let explosionMagnitude = 0.2
  if (datum.explode) {
    xOffset = Math.cos(theta) * explosionMagnitude
    zOffset = Math.sin(theta) * explosionMagnitude
  }

  const innerRadius = arcGenerator.innerRadius()(arc)
  const outerRadius = arcGenerator.outerRadius()(arc)



  const springProps = useSpring({
    // xOffset,
    // zOffset,
    height,
    position: [xOffset, height + offset, zOffset],
    config: springConfig,
  })

  const extrudeGeometryArgs = useMemo(() => [shape, extrudeSettings], [
    shape,
    extrudeSettings,
  ])

  // ECharts 风格 labelLineStyle 支持 - 使用 useMemo 缓存计算结果
  const labelLineData = useMemo(() => {
    const labelLineStyle = datum.labelLineStyle || {}
    const SCALE = 0.01
    const r = outerRadius * SCALE
    const offset1 = (labelLineStyle.length !== undefined ? labelLineStyle.length * SCALE : 0.15 * outerRadius * SCALE)
    const offset2 = (labelLineStyle.length2 !== undefined ? labelLineStyle.length2 * SCALE : 0.3 * outerRadius * SCALE)
    
    // 支持自定义标签偏移距离
    const labelOffset = labelLineStyle.labelOffset !== undefined ? labelLineStyle.labelOffset * SCALE : 0

    const start = [Math.cos(theta) * r, 0, Math.sin(theta) * r]
    const mid = [Math.cos(theta) * (r + offset1), 0, Math.sin(theta) * (r + offset1)]
    
    // 计算从圆心到mid点的方向向量（指向圆心外）
    const centerToMid = [mid[0], 0, mid[2]] // 圆心在(0,0,0)
    const centerToMidLength = Math.sqrt(centerToMid[0] * centerToMid[0] + centerToMid[2] * centerToMid[2])
    const centerToMidNormalized = [centerToMid[0] / centerToMidLength, 0, centerToMid[2] / centerToMidLength]
    
    // 计算第一段线的方向向量（从start到mid）
    const firstLineDirection = [mid[0] - start[0], 0, mid[2] - start[2]]
    const firstLineLength = Math.sqrt(firstLineDirection[0] * firstLineDirection[0] + firstLineDirection[2] * firstLineDirection[2])
    const firstLineNormalized = [firstLineDirection[0] / firstLineLength, 0, firstLineDirection[2] / firstLineLength]
    
    // 计算水平方向的单位向量（向右）
    const horizontalDirection = [1, 0, 0]
    
    // 计算水平方向与圆心外方向的点积
    const horizontalDotCenter = horizontalDirection[0] * centerToMidNormalized[0] + horizontalDirection[2] * centerToMidNormalized[2]
    
    // 如果水平方向与圆心外方向基本一致（点积接近1），则向右延伸
    // 如果水平方向与圆心外方向相反（点积接近-1），则向左延伸
    const shouldGoRight = horizontalDotCenter > 0
    
    // 先按这个方向计算endX
    let endX = shouldGoRight ? mid[0] + offset2 : mid[0] - offset2
    
    // 计算第二段线的方向向量（从mid到end）
    const secondLineDirection = [endX - mid[0], 0, 0] // 水平线
    
    // 计算第一段线和第二段线的点积
    const dotProduct = firstLineNormalized[0] * secondLineDirection[0] + firstLineNormalized[2] * secondLineDirection[2]
    
    // 如果点积为负，说明夹角大于90度，需要调整方向
    if (dotProduct < 0) {
      endX = shouldGoRight ? mid[0] - offset2 : mid[0] + offset2
    }
    
    const end = [endX, 0, mid[2]]
    
    // 重新计算isLeft，因为endX可能已经改变方向
    const finalIsLeft = endX < mid[0]
    
    // 标签位置将根据摄像机动态调整，这里先设置一个初始位置
    const labelPos = [endX, 0, mid[2]]
    
    return { start, mid, end, finalIsLeft, labelPos, labelOffset }
  }, [datum.labelLineStyle, outerRadius, theta])
  
  // 解构计算结果
  const { start, mid, end, finalIsLeft, labelPos, labelOffset } = labelLineData

  // labelLine 样式 - 使用 useMemo 缓存
  const lineStyle = useMemo(() => {
    const labelLineStyle = datum.labelLineStyle || {}
    return {
      color: labelLineStyle.color || datum.labelLineColor || color,
      width: labelLineStyle.width || datum.labelLineWidth || 2
    }
  }, [datum.labelLineStyle, datum.labelLineColor, datum.labelLineWidth, color])

  // 标签样式配置 - 使用 useMemo 缓存
  const labelStyle = useMemo(() => {
    const baseLabelStyle = datum.labelStyle || {}
    return {
      ...baseLabelStyle,
      color: baseLabelStyle.color || color,
      fontFamily: baseLabelStyle.fontFamily,
      fontSize: baseLabelStyle.fontSize
    }
  }, [datum.labelStyle, color])

  // label 多行内容 - 使用 useMemo 缓存
  const labelLines = useMemo(() => {
    return [
      label,
      arc.value.toFixed(4)
    ]
  }, [label, arc.value])

  // 共享的定位计算函数 - 确保 LabelLine 和 DynamicLabel 使用相同逻辑
  const calculateAdjustedPosition = useCallback((camera) => {
    // 获取摄像机的右方向向量（在摄像机坐标系中）
    const cameraRight = new THREE.Vector3()
    camera.getWorldDirection(cameraRight)
    cameraRight.cross(camera.up).normalize()
    
    // 将摄像机右方向投影到XZ平面，确保水平方向
    const horizontalDirection = new THREE.Vector3(cameraRight.x, 0, cameraRight.z)
    if (horizontalDirection.length() > 0.001) {
      horizontalDirection.normalize()
    } else {
      // 如果投影后长度太小，使用默认的右方向
      horizontalDirection.set(1, 0, 0)
    }
    
    // 计算从圆心到mid点的方向向量（指向圆心外）
    const centerToMid = new THREE.Vector3(mid[0], 0, mid[2]) // 圆心在(0,0,0)
    centerToMid.normalize()
    
    // 计算水平方向与圆心外方向的点积
    const horizontalDotCenter = horizontalDirection.dot(centerToMid)
    
    // 如果水平方向与圆心外方向基本一致（点积接近1），则向右延伸
    // 如果水平方向与圆心外方向相反（点积接近-1），则向左延伸
    const shouldGoRight = horizontalDotCenter > 0
    
    // 根据这个方向确定水平线的朝向
    const horizontalOffset = shouldGoRight ? 1 : -1
    
    // 计算水平线的长度（使用3D空间中的实际距离）
    const originalLength = Math.abs(end[0] - mid[0])
    const horizontalLength = Math.max(originalLength, 0.3) // 最小长度
    
    // 计算新的位置 - 与 LabelLine 完全一致
    const newX = mid[0] + horizontalDirection.x * horizontalLength * horizontalOffset
    const newZ = mid[2] + horizontalDirection.z * horizontalLength * horizontalOffset
    
    return [newX, 0, newZ]
  }, [mid, end])

  // 状态管理动态端点位置 - 初始化为计算出的end位置
  const [dynamicEndPosition, setDynamicEndPosition] = useState(end)
  
  // 使用 useEffect 在组件挂载时设置初始位置
  useEffect(() => {
    setDynamicEndPosition(end)
  }, [end])
  
  // 优化位置更新，减少不必要的重新渲染
  const handlePositionChange = useCallback((newPosition) => {
    setDynamicEndPosition(newPosition)
  }, [])

  return (
    <animated.group key={i} position={springProps.position}>
      <animated.mesh
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, 1, height]}
        onClick={(evt) => {
          onClick?.(i)
          evt.stopPropagation(true)
        }}
        receiveShadow
      >
        <extrudeGeometry args={extrudeGeometryArgs} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </animated.mesh>

      
      {/* CSS2D标签，位置与labelLine同步 */}
      <CSS2DLabels 
        labelLines={labelLines}
        position={dynamicEndPosition}
        isLeft={finalIsLeft}
        labelStyle={labelStyle}
        labelOffset={labelOffset}
      />
      
      {/* labelLine 折线 - 使用动态计算的位置 */}
      <DynamicLabelLine 
        start={start}
        mid={mid}
        end={end} // 使用初始的end位置
        color={lineStyle.color}
        width={lineStyle.width}
        calculateAdjustedPosition={calculateAdjustedPosition}
        onPositionChange={handlePositionChange} // 使用优化的回调函数
      />
    </animated.group>
  )
}

export default PieSlice
