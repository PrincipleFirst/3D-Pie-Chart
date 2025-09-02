import React from 'react'
import { createRoot } from 'react-dom/client'
import ThreeDPieChartLib from '../../src/App-lib'
import '../styles/3d-pie-chart.css'

// 全局图表实例管理
const chartInstances = new Map()

// 全局初始化函数，类似 ECharts.init()
window.init3DPieChart = function(container, options = {}) {
  // 获取容器元素
  const containerElement = typeof container === 'string'
    ? document.getElementById(container)
    : container

  if (!containerElement) {
    throw new Error(`Container element not found: ${container}`)
  }

  // 创建图表实例ID
  const instanceId = `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // 创建React根节点
  const root = createRoot(containerElement)

  // 创建图表组件
  const chartComponent = React.createElement(ThreeDPieChartLib, {
    containerId: instanceId,
    options: options,
    onSliceClick: (index, item) => {
      // 触发自定义事件
      containerElement.dispatchEvent(new CustomEvent('sliceClick', {
        detail: { index, item, instanceId }
      }))
    },
    onChartReady: (readyPayload) => {
      // 触发图表就绪事件（将 cameraControls 等信息直接扁平到 detail 上）
      containerElement.dispatchEvent(new CustomEvent('chartReady', {
        detail: { ...readyPayload, instanceId }
      }))
    }
  })

  // 渲染图表
  root.render(chartComponent)

  // 创建图表实例对象
  const chartInstance = {
    id: instanceId,
    container: containerElement,
    root: root,
    options: options,

    // 更新配置
    setOption: function(newOptions) {
      this.options = { ...this.options, ...newOptions }
      // 重新渲染
      this.root.render(React.createElement(ThreeDPieChartLib, {
        containerId: this.id,
        options: this.options,
        onSliceClick: (index, item) => {
          this.container.dispatchEvent(new CustomEvent('sliceClick', {
            detail: { index, item, instanceId: this.id }
          }))
        },
        onChartReady: (readyPayload) => {
          this.container.dispatchEvent(new CustomEvent('chartReady', {
            detail: { ...readyPayload, instanceId: this.id }
          }))
        }
      }))
    },

    // 更新数据
    setData: function(newData) {
      this.setOption({ data: newData })
    },

    // 销毁图表
    dispose: function() {
      this.root.unmount()
      chartInstances.delete(this.id)
    }
  }

  // 保存实例引用
  chartInstances.set(instanceId, chartInstance)

  return chartInstance
}

// 获取图表实例
window.get3DPieChart = function(instanceId) {
  return chartInstances.get(instanceId)
}

// 销毁所有图表
window.disposeAll3DPieCharts = function() {
  chartInstances.forEach(instance => instance.dispose())
  chartInstances.clear()
}

// 导出库组件（用于模块化引入）
export { ThreeDPieChartLib as default }
