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
import LabelLine from './LabelLine'

const springConfig = springConfigs.wobbly

// 动态标签组件，位置与labelLine同步
const DynamicLabel = ({ 
  mid, 
  originalEnd, 
  labelLines, 
  renderRichLine, 
  isLeft, 
  labelColor, 
  labelFontFamily, 
  labelFontSize 
}) => {
  const { camera } = useThree()
  const [labelPosition, setLabelPosition] = React.useState([originalEnd[0], 0, originalEnd[2]])
  
  useFrame(() => {
    // 获取摄像机在世界坐标系中的位置和方向
    const cameraWorldPosition = new THREE.Vector3()
    camera.getWorldPosition(cameraWorldPosition)
    
    // 先定义midPoint
    const midPoint = new THREE.Vector3(mid[0], mid[1], mid[2])
    const originalEndPoint = new THREE.Vector3(originalEnd[0], originalEnd[1], originalEnd[2])
    const midToOriginalEnd = new THREE.Vector3().subVectors(originalEndPoint, midPoint)
    
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
    
    // 使用摄像机右方向来判断原始方向是向左还是向右
    const dotProduct = midToOriginalEnd.dot(cameraRight)
    const isLeftDirection = dotProduct < 0
    
    // 根据原始方向确定水平线的方向
    const horizontalOffset = isLeftDirection ? -1 : 1
    
    // 计算水平线的长度（保持与原始长度相似）
    const originalLength = Math.abs(originalEnd[0] - mid[0])
    const horizontalLength = Math.max(originalLength, 0.3) // 最小长度
    
    // 计算新的标签位置
    const newLabelX = mid[0] + horizontalDirection.x * horizontalLength * horizontalOffset
    const newLabelZ = mid[2] + horizontalDirection.z * horizontalLength * horizontalOffset
    
    setLabelPosition([newLabelX, 0, newLabelZ])
  })
  
  return (
    <Billboard>
      <group>
        {labelLines.map((line, idx) => (
          <React.Fragment key={idx}>
            {renderRichLine(line, idx, labelPosition)}
          </React.Fragment>
        ))}
      </group>
    </Billboard>
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
  const isLeft = theta > Math.PI / 2 || theta < -Math.PI / 2
  const endX = isLeft ? mid[0] - offset2 : mid[0] + offset2
  const end = [endX, 0, mid[2]]
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

  // 简单富文本解析：支持 {key|内容}，按 rich[key] 渲染不同样式
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
    return parts.map((part, i) => (
      <Text
        key={`${idx}_${i}`}
        color={part.style.color || labelColor}
        fontFamily={part.style.fontFamily || labelFontFamily}
        fontSize={part.style.fontSize || labelFontSize || 0.12}
        anchorX={isLeft ? 'right' : 'left'}
        anchorY="middle"
        outlineWidth={part.style.outlineWidth || '2.5%'}
        outlineColor={part.style.outlineColor || '#000'}
        outlineOpacity={part.style.outlineOpacity || 0.5}
        position={[position[0], position[1] - idx * 0.15, position[2]]}
        font="/fonts/阿里巴巴普惠体 2.0/Alibaba_PuHuiTi_2.0_55_Regular_55_Regular.ttf"
      >
        {part.text}
      </Text>
    ))
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
      {/* labelLine 折线 */}
      <LabelLine points={[start, mid, end]} color={lineColor} width={lineWidth} />
      {/* 动态标签，位置与labelLine同步 */}
      <DynamicLabel 
        mid={mid}
        originalEnd={end}
        labelLines={labelLines}
        renderRichLine={renderRichLine}
        isLeft={isLeft}
        labelColor={labelColor}
        labelFontFamily={labelFontFamily}
        labelFontSize={labelFontSize}
      />
    </animated.group>
  )
}

export default PieSlice
