/**
 * 3D Pie Chart Library
 * 支持 HTML 富文本标签的 3D 饼图库
 * 类似 ECharts 的引入方式，支持在多个元素内复用
 */

class ThreeDPieChart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container
    this.options = this.mergeOptions(this.getDefaultOptions(), options)
    this.chart = null
    this.isInitialized = false
    
    this.init()
  }

  // 获取默认配置
  getDefaultOptions() {
    return {
      // 数据配置
      data: [
        {
          value: 1.5,
          color: '#ff6b6b',
          label: '产品A',
          explode: false,
          height: 0.5,
          offset: 0,
          labelLineColor: '#ff0000',
          labelLineWidth: 1,
          labelStyle: {
            labelOffset: 100,
            color: '#ffffff',
            fontSize: 0.12,
          },
          labelLineStyle: {
            labelOffset: 30,
          }
        },
        {
          value: 0.85,
          color: '#45b7d1',
          label: '产品B',
          explode: false,
          height: 0.5,
          offset: 0,
          labelLineColor: '#0000ff',
          labelLineWidth: 1,
          labelStyle: {
            labelOffset: 100,
            color: '#ffffff',
            fontSize: 0.12,
          }
        },
        {
          value: 0.6,
          color: '#ffd700',
          label: '产品C',
          explode: false,
          height: 0.5,
          offset: 0,
          labelLineColor: '#00ff00',
          labelLineWidth: 1,
          labelStyle: {
            labelOffset: 100,
            color: '#ffffff',
            fontSize: 0.12,
          }
        },
        {
          value: 0.4,
          color: '#ff9ff3',
          label: '产品D',
          explode: false,
          height: 0.5,
          offset: 0,
          labelStyle: {
            labelOffset: 100,
            color: '#ffffff',
            fontSize: 0.12,
          }
        }
      ],

      // 样式配置
      style: {
        backgroundColor: '#1f2937',
        roughness: 0.2,
        metalness: 0.0,
      },

      // 光照配置
      lighting: {
        ambientLightIntensity: 1.2,
        spotLightIntensity: 1.75,
        environmentFile: 'dikhololo_night_1k.hdr',
      },

      // 特效配置
      effects: {
        showBloom: false,
        bloomStrength: 1,
        bloomRadius: 1.5,
        bloomThreshold: 0.15,
      },

      // 交互配置
      interaction: {
        spinSpeed: 0.0,
        showValues: true,
        valuesAsPercent: true,
      },

      // 布局配置
      layout: {
        title: '3D Pie Chart',
        titleMaxWidth: 80,
        titleOffset: -30,
        innerRadius: 2,
        outerRadius: 150,
        cornerRadius: 0,
        padAngle: 0.05,
        allHeights: 0.5,
        valueLabelPosition: 0.65,
      },

      // 标签配置
      labels: {
        show: true,
        style: {
          fontSize: '14px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif'
        }
      },

      // 相机配置
      camera: {
        // 相机位置偏移（相对于默认位置的比例）
        positionOffset: {
          x: 0.3,  // 水平偏移比例
          y: 0.4,  // 垂直偏移比例
          z: 0.9   // 深度偏移比例
        },
        // 相机距离倍数
        distanceMultiplier: 2.5,
        // 相机视野角度
        fov: 50,
        // 相机近平面
        near: 0.1,
        // 相机远平面
        far: 1000,
        // 是否启用自动倾斜
        autoTilt: true
      }
    }
  }

  // 合并配置
  mergeOptions(defaultOpts, userOpts) {
    const merged = { ...defaultOpts }
    
    for (const key in userOpts) {
      if (userOpts.hasOwnProperty(key)) {
        if (typeof userOpts[key] === 'object' && userOpts[key] !== null && !Array.isArray(userOpts[key])) {
          merged[key] = this.mergeOptions(merged[key] || {}, userOpts[key])
        } else {
          merged[key] = userOpts[key]
        }
      }
    }
    
    return merged
  }

  // 初始化图表
  async init() {
    if (this.isInitialized) return

    try {
      // 检查容器
      if (!this.container) {
        throw new Error('Container element not found')
      }

      // 创建画布容器
      this.createCanvas()
      
      // 初始化 Three.js 场景
      await this.initThreeJS()
      
      // 渲染饼图
      this.render()
      
      this.isInitialized = true
      console.log('3D Pie Chart initialized successfully')
      
    } catch (error) {
      console.error('Failed to initialize 3D Pie Chart:', error)
    }
  }

  // 创建画布容器
  createCanvas() {
    // 清空容器
    this.container.innerHTML = ''
    
    // 创建画布
    this.canvas = document.createElement('canvas')
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.display = 'block'
    
    this.container.appendChild(this.canvas)
    
    // 获取容器的实际尺寸
    const rect = this.container.getBoundingClientRect()
    this.containerWidth = rect.width
    this.containerHeight = rect.height
    
    // 设置画布尺寸
    this.canvas.width = this.containerWidth
    this.canvas.height = this.containerHeight
  }

  // 初始化 Three.js
  async initThreeJS() {
    // 这里需要动态导入 Three.js 相关模块
    // 在实际使用中，这些模块应该已经通过 script 标签引入
    if (typeof THREE === 'undefined') {
      throw new Error('Three.js is not loaded. Please include three.min.js before using this library.')
    }

    // 计算合适的图表尺寸
    const containerSize = Math.min(this.containerWidth, this.containerHeight)
    const chartRadius = Math.min(containerSize * 0.35, this.options.layout.outerRadius || 150)
    
    // 更新配置中的半径
    this.options.layout.outerRadius = chartRadius
    this.options.layout.innerRadius = Math.max(2, chartRadius * 0.15)

    // 创建场景
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(this.options.style.backgroundColor)
    
    // 创建相机 - 使用配置参数
    const { camera } = this.options
    this.camera = new THREE.PerspectiveCamera(
      camera.fov, 
      this.containerWidth / this.containerHeight, 
      camera.near, 
      camera.far
    )
    
    // 设置相机位置，使用配置的偏移参数
    const baseDistance = chartRadius * camera.distanceMultiplier
    
    if (camera.autoTilt) {
      // 自动倾斜模式：使用配置的偏移比例
      this.camera.position.set(
        baseDistance * camera.positionOffset.x,  // 水平偏移
        baseDistance * camera.positionOffset.y,  // 垂直偏移
        baseDistance * camera.positionOffset.z   // 深度偏移
      )
    } else {
      // 手动模式：直接设置位置
      this.camera.position.set(
        camera.positionOffset.x * chartRadius,
        camera.positionOffset.y * chartRadius,
        camera.positionOffset.z * chartRadius
      )
    }
    
    // 相机始终看向中心点
    this.camera.lookAt(0, 0, 0)
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true,
      alpha: true 
    })
    this.renderer.setSize(this.containerWidth, this.containerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    // 添加光源
    this.addLights()
    
    // 创建饼图几何体
    this.createPieGeometry()
    
    // 添加标签
    if (this.options.labels.show) {
      this.addLabels()
    }
    
    // 添加控制器
    this.addControls()
    
    // 处理窗口大小变化
    window.addEventListener('resize', () => this.onWindowResize())
  }

  // 添加光源
  addLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, this.options.lighting.ambientLightIntensity)
    this.scene.add(ambientLight)
    
    // 聚光灯
    const spotLight = new THREE.SpotLight(0xffffff, this.options.lighting.spotLightIntensity)
    spotLight.position.set(10, 15, 10)
    spotLight.angle = 0.1
    spotLight.penumbra = 1
    spotLight.castShadow = true
    this.scene.add(spotLight)
  }

  // 创建饼图几何体
  createPieGeometry() {
    const { data, layout } = this.options
    
    // 计算总价值
    const totalValue = data.reduce((sum, item) => sum + item.value, 0)
    
    // 创建扇区
    data.forEach((item, index) => {
      const startAngle = (data.slice(0, index).reduce((sum, d) => sum + d.value, 0) / totalValue) * Math.PI * 2
      const endAngle = ((data.slice(0, index).reduce((sum, d) => sum + d.value, 0) + item.value) / totalValue) * Math.PI * 2
      
      // 获取扇区高度，确保有厚度
      const sliceHeight = item.height || layout.allHeights || 0.5
      
      // 创建扇区几何体 - 使用正确的3D圆柱体
      const geometry = new THREE.CylinderGeometry(
        layout.innerRadius,
        layout.outerRadius,
        sliceHeight,  // 使用配置的高度
        32,           // 径向分段
        1,            // 高度分段
        false,        // 不开放
        startAngle,
        endAngle - startAngle
      )
      
      // 创建材质
      const material = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: this.options.style.roughness,
        metalness: this.options.style.metalness
      })
      
      // 创建网格
      const mesh = new THREE.Mesh(geometry, material)
      
      // 旋转几何体，让饼图平躺
      mesh.rotation.x = Math.PI / 2
      
      // 设置Y轴位置，让每个扇区有不同的高度偏移
      const heightOffset = item.offset || 0
      mesh.position.y = heightOffset
      
      // 启用阴影
      mesh.castShadow = true
      mesh.receiveShadow = true
      
      // 添加点击事件
      mesh.userData = { index, item }
      mesh.addEventListener('click', (event) => this.onSliceClick(event, index))
      
      this.scene.add(mesh)
    })
  }

  // 添加标签 - 保持原有的富文本标签功能
  addLabels() {
    const { data, layout } = this.options
    
    data.forEach((item, index) => {
      if (item.label) {
        // 计算标签位置（扇区中心角度）
        const angle = (data.slice(0, index).reduce((sum, d) => sum + d.value, 0) + item.value / 2) / 
                     data.reduce((sum, d) => sum + d.value, 0) * Math.PI * 2
        
        // 计算标签在3D空间中的位置
        const labelDistance = layout.outerRadius + 80  // 增加距离，避免重叠
        const x = Math.cos(angle) * labelDistance
        const z = Math.sin(angle) * labelDistance
        
        // 将3D坐标转换为屏幕坐标
        const vector = new THREE.Vector3(x, 0, z)
        vector.project(this.camera)
        
        // 转换为屏幕像素坐标
        const screenX = (vector.x * 0.5 + 0.5) * this.containerWidth
        const screenY = (vector.y * -0.5 + 0.5) * this.containerHeight
        
        // 创建标签容器
        const labelContainer = document.createElement('div')
        labelContainer.className = 'three-d-pie-label-container'
        labelContainer.style.position = 'absolute'
        labelContainer.style.left = `${screenX}px`
        labelContainer.style.top = `${screenY}px`
        labelContainer.style.transform = 'translate(-50%, -50%)'
        labelContainer.style.pointerEvents = 'none'
        labelContainer.style.zIndex = '1000'
        
        // 创建标签内容
        const label = document.createElement('div')
        label.className = 'three-d-pie-label'
        label.innerHTML = item.label // 支持 HTML 富文本
        
        // 应用标签样式
        if (item.labelStyle) {
          Object.assign(label.style, {
            fontSize: `${item.labelStyle.fontSize || 0.12}em`,
            color: item.labelStyle.color || '#ffffff',
            textAlign: 'center'
          })
        }
        
        labelContainer.appendChild(label)
        this.container.appendChild(labelContainer)
        
        // 添加标签线（如果需要）
        if (item.labelLineColor && item.labelLineWidth) {
          // 标签线从扇区边缘开始，到标签位置结束
          this.addLabelLine(angle, layout.outerRadius, labelDistance, item.labelLineColor, item.labelLineWidth)
        }
      }
    })
  }

  // 添加标签线
  addLabelLine(angle, startRadius, endRadius, color, width) {
    // 计算标签线的起点（从扇区边缘开始）
    const startX = Math.cos(angle) * startRadius
    const startZ = Math.sin(angle) * startRadius
    
    // 计算标签线的终点（到标签位置）
    const endX = Math.cos(angle) * endRadius
    const endZ = Math.sin(angle) * endRadius
    
    // 创建标签线几何体
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(startX, 0, startZ),  // 从扇区边缘开始
      new THREE.Vector3(endX, 0, endZ)       // 到标签位置结束
    ])
    
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: color || 0xffffff,
      linewidth: width || 1
    })
    const line = new THREE.Line(lineGeometry, lineMaterial)
    
    // 确保标签线在饼图之上
    line.renderOrder = 1
    
    this.scene.add(line)
    
    // 保存引用以便后续更新
    if (!this.labelLines) this.labelLines = []
    this.labelLines.push(line)
  }

  // 添加控制器
  addControls() {
    // 改进的轨道控制器
    let isMouseDown = false
    let mouseX = 0
    let mouseY = 0
    let lastMouseX = 0
    let lastMouseY = 0
    
    // 初始相机位置
    const initialCameraPosition = this.camera.position.clone()
    const initialCameraLookAt = new THREE.Vector3(0, 0, 0)
    
    this.canvas.addEventListener('mousedown', (event) => {
      isMouseDown = true
      mouseX = event.clientX
      mouseY = event.clientY
      lastMouseX = mouseX
      lastMouseY = mouseY
      
      // 添加鼠标样式
      this.canvas.style.cursor = 'grabbing'
    })
    
    this.canvas.addEventListener('mouseup', () => {
      isMouseDown = false
      this.canvas.style.cursor = 'grab'
    })
    
    this.canvas.addEventListener('mousemove', (event) => {
      if (isMouseDown) {
        const deltaX = event.clientX - lastMouseX
        const deltaY = event.clientY - lastMouseY
        
        // 计算旋转角度
        const rotationSpeed = 0.01
        const horizontalRotation = deltaX * rotationSpeed
        const verticalRotation = deltaY * rotationSpeed
        
        // 围绕 Y 轴旋转（水平）
        const horizontalAxis = new THREE.Vector3(0, 1, 0)
        this.camera.position.applyAxisAngle(horizontalAxis, horizontalRotation)
        
        // 围绕 X 轴旋转（垂直）
        const rightVector = new THREE.Vector3()
        rightVector.crossVectors(this.camera.position, horizontalAxis).normalize()
        this.camera.position.applyAxisAngle(rightVector, verticalRotation)
        
        // 保持相机距离
        const distance = this.camera.position.length()
        this.camera.position.normalize().multiplyScalar(distance)
        
        // 相机始终看向中心点
        this.camera.lookAt(initialCameraLookAt)
        
        lastMouseX = event.clientX
        lastMouseY = event.clientY
        
        // 重新渲染
        this.render()
        
        // 更新标签位置
        if (this.options.labels.show) {
          this.updateLabels()
        }
      }
    })
    
    // 添加鼠标滚轮缩放
    this.canvas.addEventListener('wheel', (event) => {
      event.preventDefault()
      
      const zoomSpeed = 0.1
      const zoom = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed
      
      // 缩放相机距离
      this.camera.position.multiplyScalar(zoom)
      
      // 重新渲染
      this.render()
      
      // 更新标签位置
      if (this.options.labels.show) {
        this.updateLabels()
      }
    })
    
    // 设置初始鼠标样式
    this.canvas.style.cursor = 'grab'
  }

  // 渲染
  render() {
    if (!this.renderer || !this.scene || !this.camera) return
    
    this.renderer.render(this.scene, this.camera)
  }

  // 窗口大小变化处理
  onWindowResize() {
    if (!this.camera || !this.renderer) return
    
    // 重新获取容器尺寸
    const rect = this.container.getBoundingClientRect()
    this.containerWidth = rect.width
    this.containerHeight = rect.height
    
    // 更新相机
    this.camera.aspect = this.containerWidth / this.containerHeight
    this.camera.updateProjectionMatrix()
    
    // 更新渲染器
    this.renderer.setSize(this.containerWidth, this.containerHeight)
    
    // 重新计算图表尺寸
    const containerSize = Math.min(this.containerWidth, this.containerHeight)
    const chartRadius = Math.min(containerSize * 0.35, this.options.layout.outerRadius || 150)
    
    // 使用配置参数更新相机位置
    const { camera } = this.options
    const baseDistance = chartRadius * camera.distanceMultiplier
    
    if (camera.autoTilt) {
      // 自动倾斜模式：保持当前角度，调整距离
      const currentDirection = this.camera.position.clone().normalize()
      this.camera.position.copy(currentDirection.multiplyScalar(baseDistance))
    } else {
      // 手动模式：重新计算位置
      this.camera.position.set(
        camera.positionOffset.x * chartRadius,
        camera.positionOffset.y * chartRadius,
        camera.positionOffset.z * chartRadius
      )
      this.camera.lookAt(0, 0, 0)
    }
    
    // 重新渲染
    this.render()
    
    // 重新计算标签位置
    if (this.options.labels.show) {
      this.updateLabels()
    }
  }

  // 更新标签位置
  updateLabels() {
    // 移除旧的标签
    const oldLabels = this.container.querySelectorAll('.three-d-pie-label-container')
    oldLabels.forEach(label => label.remove())
    
    // 重新添加标签
    this.addLabels()
  }

  // 扇区点击事件
  onSliceClick(event, index) {
    const item = this.options.data[index]
    console.log(`Clicked slice ${index}:`, item)
    
    // 触发自定义事件
    this.container.dispatchEvent(new CustomEvent('sliceClick', {
      detail: { index, item }
    }))
  }

  // 更新配置
  setOption(options) {
    this.options = this.mergeOptions(this.options, options)
    
    if (this.isInitialized) {
      // 重新初始化
      this.dispose()
      this.init()
    }
  }

  // 更新数据
  setData(data) {
    this.options.data = data
    this.setOption({ data })
  }

  // 销毁图表
  dispose() {
    if (this.renderer) {
      this.renderer.dispose()
    }
    
    if (this.scene) {
      this.scene.clear()
    }
    
    // 移除事件监听器
    window.removeEventListener('resize', () => this.onWindowResize())
    
    this.isInitialized = false
  }
}

// 全局函数，类似 ECharts.init()
window.init3DPieChart = function(container, options) {
  return new ThreeDPieChart(container, options)
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThreeDPieChart
} else if (typeof define === 'function' && define.amd) {
  define(function() { return ThreeDPieChart })
}
