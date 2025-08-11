import {
  animated,
  config as springConfigs,
  useSpring,
} from '@react-spring/three'
import { Text } from '@react-three/drei'
import { format } from 'd3-format'
import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Billboard from './Billboard'
import { palette } from './theme'

import { Line } from '@react-three/drei'

const springConfig = springConfigs.wobbly

// 动态标签组件，位置与labelLine同步
const DynamicLabel = ({ 
  mid, 
  originalEnd, 
  labelLines, 
  renderRichLine, 
  labelLineEndPosition  // 接收 labelLine 的端点位置
}) => {
  // 直接使用 labelLine 的端点位置，不再独立计算
  const labelPosition = labelLineEndPosition || originalEnd
  
  return (
    <group>
      {labelLines.map((line, idx) => (
        <React.Fragment key={idx}>
          {/* 为每个 Text 组件单独应用 Billboard 效果 */}
          {renderRichLine(line, idx, labelPosition).map((textComponent, textIdx) => (
            <Billboard key={`${idx}_${textIdx}`}>
              {textComponent}
            </Billboard>
          ))}
        </React.Fragment>
      ))}
    </group>
  )
}

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
  const [adjustedPoints, setAdjustedPoints] = React.useState([start, mid, end])
  
  useFrame(() => {
    if (!start || !mid || !end || !calculateAdjustedPosition) return
    
    // 使用共享的定位计算函数
    const newEnd = calculateAdjustedPosition(camera)
    setAdjustedPoints([start, mid, newEnd])
    
    // 通知父组件位置变化
    if (onPositionChange) {
      onPositionChange(newEnd)
    }
  })
  
  return (
    <Line
      points={adjustedPoints}
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
  valueLabelPosition = 0.5,
  offset = 0,
  roughness = 0.2,
  metalness = 0,
  formatter = format('.0%'),
  showValue = true,
  valueAsPercent = true,
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
  const labelPosition =
    (valueLabelPosition * (outerRadius - innerRadius) + innerRadius) * 0.01
  let xText = Math.cos(theta) * labelPosition
  let zText = Math.sin(theta) * labelPosition
  const yTextOffset = 0.125
  // glorious idea for laziness
  // const percent = (arc.endAngle - arc.startAngle) / (Math.PI * 2)
  const percent = arc.value / totalValue

  const springProps = useSpring({
    // xOffset,
    // zOffset,
    height,
    position: [xOffset, height + offset, zOffset],
    config: springConfig,
  })

  const extrudeGeometryArgs = React.useMemo(() => [shape, extrudeSettings], [
    shape,
    extrudeSettings,
  ])

  // ECharts 风格 labelLineStyle 支持
  const labelLineStyle = datum.labelLineStyle || {}
  const SCALE = 0.01
  const r = outerRadius * SCALE
  const offset1 = (labelLineStyle.length !== undefined ? labelLineStyle.length * SCALE : 0.15 * outerRadius * SCALE)
  const offset2 = (labelLineStyle.length2 !== undefined ? labelLineStyle.length2 * SCALE : 0.3 * outerRadius * SCALE)

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

  // labelLine 样式
  const lineColor = labelLineStyle.color || datum.labelLineColor || color
  const lineWidth = labelLineStyle.width || datum.labelLineWidth || 2

  // ECharts 风格 labelStyle 支持
  const labelStyle = datum.labelStyle || {}
  const rich = labelStyle.rich || {}
  const labelColor = labelStyle.color || color
  const labelFontFamily = labelStyle.fontFamily
  const labelFontSize = labelStyle.fontSize

  // label 多行内容，优先用 customLabel
  const labelLines = datum.customLabel && Array.isArray(datum.customLabel) && datum.customLabel.length > 0
    ? datum.customLabel
    : [
        label,
        arc.value.toFixed(4),
        (percent * 100).toFixed(2) + '%'
      ]

  // 共享的定位计算函数 - 确保 LabelLine 和 DynamicLabel 使用相同逻辑
  const calculateAdjustedPosition = React.useCallback((camera) => {
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

  // 状态管理动态端点位置
  const [dynamicEndPosition, setDynamicEndPosition] = React.useState(end)

  // 增强的富文本解析：支持 {key|内容}，按 rich[key] 渲染不同样式
  function renderRichLine(line, idx, position = labelPos) {
    // 匹配 {key|内容}
    const parts = []
    let lastIndex = 0
    const regex = /\{(\w+)\|([^}]+)\}/g
    let match
    let keyIdx = 0
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        // 普通文本
        parts.push({ text: line.slice(lastIndex, match.index), style: {} })
      }
      const key = match[1]
      const text = match[2]
      parts.push({ text, style: rich[key] || {}, key: key + '_' + keyIdx++ })
      lastIndex = regex.lastIndex
    }
    if (lastIndex < line.length) {
      parts.push({ text: line.slice(lastIndex), style: {} })
    }
    
    // 返回数组，不用 Fragment
    return parts.map((part, i) => {
      const style = part.style
      const baseColor = style.color || labelColor
      const baseFontSize = style.fontSize || labelFontSize || 0.12
      const baseFontFamily = style.fontFamily || labelFontFamily
      
      // 支持更多样式属性
      const outlineWidth = style.outlineWidth || '2.5%'
      const outlineColor = style.outlineColor || '#000'
      const outlineOpacity = style.outlineOpacity || 0.5
      
      // 计算位置偏移（支持行内样式）
      const xOffset = style.xOffset || 0
      const yOffset = style.yOffset || 0
      const zOffset = style.zOffset || 0
      
      // 支持字体粗细
      let fontPath = "/fonts/阿里巴巴普惠体 2.0/Alibaba_PuHuiTi_2.0_55_Regular_55_Regular.ttf"
      if (baseFontFamily === 'bold') {
        fontPath = "/fonts/阿里巴巴普惠体 2.0/Alibaba_PuHuiTi_2.0_55_Regular_85_Bold.ttf"
      } else if (baseFontFamily === 'monospace') {
        fontPath = "/fonts/阿里巴巴普惠体 2.0/Alibaba_PuHuiTi_2.0_55_Regular_55_Regular.ttf"
      }
      
      return (
        <Text
          key={`${idx}_${i}`}
          color={baseColor}
          fontFamily={fontPath}
          fontSize={baseFontSize}
          anchorX={finalIsLeft ? 'right' : 'left'}
          anchorY="middle"
          outlineWidth={outlineWidth}
          outlineColor={outlineColor}
          outlineOpacity={outlineOpacity}
          position={[
            position[0] + xOffset, 
            position[1] - idx * 0.15 + yOffset, 
            position[2] + zOffset
          ]}
          font="/fonts/阿里巴巴普惠体 2.0/Alibaba_PuHuiTi_2.0_55_Regular_55_Regular.ttf"
        >
          {part.text}
        </Text>
      )
    })
  }

  return (
    <animated.group key={i} position={springProps.position}>
      <animated.mesh
        rotation={[Math.PI / 2, 0, 0]}
        scale={springProps.height.to((height) => [1, 1, height])}
        onClick={(evt) => {
          onClick?.(i)
          evt.stopPropagation(true)
        }}
        receiveShadow
        // onPointerEnter={() => setActiveSlice(i)}
        // onPointerLeave={() => setActiveSlice(undefined)}
      >
        {/* <shapeGeometry args={[shape]} /> */}
        <extrudeGeometry args={extrudeGeometryArgs} />
        {/* <cylinderGeometry args={[1, 1, 0.4, 64]} /> */}
        {/* <meshPhongMaterial color={color} /> */}
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
        {/* <meshBasicMaterial color={color} side={BackSide} /> */}
      </animated.mesh>
      {showValue && (
        <Billboard>
          <Text
            position={[xText, yTextOffset, zText]}
            castShadow
            fontSize={0.2}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign={'left'}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={1}
            color="white"
            outlineWidth={'2.5%'}
            outlineColor="#000000"
            outlineOpacity={0.2}
          >
            {valueAsPercent ? formatter(percent) : arc.value}
          </Text>
        </Billboard>
      )}
      
      {/* 动态标签，位置与labelLine同步 */}
      <DynamicLabel 
        mid={mid}
        originalEnd={end}
        labelLines={labelLines}
        renderRichLine={renderRichLine}
        labelLineEndPosition={dynamicEndPosition} // 传递 labelLine 的端点位置
      />
      
      {/* labelLine 折线 - 使用动态计算的位置 */}
      <DynamicLabelLine 
        start={start}
        mid={mid}
        end={dynamicEndPosition} // 使用动态端点位置
        color={lineColor}
        width={lineWidth}
        calculateAdjustedPosition={calculateAdjustedPosition}
        onPositionChange={setDynamicEndPosition} // 传递回调函数
      />
    </animated.group>
  )
}

export default PieSlice
