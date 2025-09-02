# 3D Pie Chart Library

这是 3D Pie Chart 项目的库文件目录，包含了用于发布到 npm 的库代码。

## 文件结构

```
lib/
├── src/
│   └── index.jsx          # 库的入口文件，提供全局API
├── styles/
│   └── 3d-pie-chart.css   # 统一的样式文件
└── README.md              # 本文件
```

## 文件说明

### `src/index.jsx`
- **作用**: 库的入口文件
- **功能**: 
  - 提供全局API `window.init3DPieChart()`
  - 管理图表实例
  - 导出React组件供模块化使用
- **使用方式**: 类似 ECharts 的使用方式

### `styles/3d-pie-chart.css`
- **作用**: 统一的样式文件
- **特点**:
  - 合并了原来两个重复的CSS文件
  - 支持所有使用场景（开发/库）
  - 包含完整的样式系统：容器、标签、主题、响应式等
  - 支持浅色/深色主题切换

## 构建输出

构建后会在 `dist-3d-pie-chart/` 目录生成：

- `3d-pie-chart.css` - 样式文件
- `3d-pie-chart-react.mjs` - ES模块版本
- `3d-pie-chart-react.umd.js` - UMD版本
- `showcase.html` - 展示页面

## 使用方式

### 1. 全局API方式（类似ECharts）

```html
<link rel="stylesheet" href="./3d-pie-chart.css">
<script src="./3d-pie-chart-react.umd.js"></script>

<script>
const chart = window.init3DPieChart('container', {
  data: [
    { name: 'A', value: 30 },
    { name: 'B', value: 50 },
    { name: 'C', value: 20 }
  ]
});
</script>
```

### 2. 模块化引入

```javascript
import ThreeDPieChart from '3d-pie-chart';
import '3d-pie-chart/dist/3d-pie-chart.css';

// 使用React组件
<ThreeDPieChart data={data} options={options} />
```

## 优势

1. **文件组织清晰**: 库文件与开发文件分离
2. **样式统一**: 合并重复CSS，减少维护成本
3. **构建优化**: 统一的构建配置
4. **使用灵活**: 支持多种引入方式
