import React from 'react'
import { Line } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * points: [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3]]
 * color: 线条颜色
 * width: 线宽
 */
const LabelLine = ({ points, color = '#fff', width = 2 }) => {
  const { camera } = useThree()
  const [adjustedPoints, setAdjustedPoints] = React.useState(points)
  
  useFrame(() => {
    if (!points || points.length < 3) return
    
    const [start, mid, originalEnd] = points
    
    // 获取摄像机在世界坐标系中的位置和方向
    const cameraWorldPosition = new THREE.Vector3()
    camera.getWorldPosition(cameraWorldPosition)
    
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
    const originalLength = Math.abs(originalEnd[0] - mid[0])
    const horizontalLength = Math.max(originalLength, 0.3) // 最小长度
    
    // 计算新的终点位置
    const newEndX = mid[0] + horizontalDirection.x * horizontalLength * horizontalOffset
    const newEndZ = mid[2] + horizontalDirection.z * horizontalLength * horizontalOffset
    
    const newEnd = [newEndX, mid[1], newEndZ]
    
    setAdjustedPoints([start, mid, newEnd])
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

export default LabelLine 