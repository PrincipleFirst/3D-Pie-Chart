import React from 'react'
import { Line } from '@react-three/drei'

/**
 * points: [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3]]
 * color: 线条颜色
 * width: 线宽
 */
const LabelLine = ({ points, color = '#fff', width = 2 }) => {
  // 直接使用传入的点位置，不再动态调整
  // 位置调整逻辑现在在 PieSlice 中统一处理
  return (
    <Line
      points={points}
      color={color}
      lineWidth={width}
      dashed={false}
    />
  )
}

export default LabelLine 