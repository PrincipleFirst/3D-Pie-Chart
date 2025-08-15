import { ContactShadows, Environment, OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React, { Suspense } from 'react'
import Effects from './Effects'
import Pie from './Pie'
import Turntable from './Turntable'
import useInputControls, { pieDataFromControls } from './useInputControls'
import CSS2DRendererProvider from './CSS2DRenderer'
import './richtext-animations.css'

function App() {
  const orbitControlsRef = React.useRef()
  const [controlValues, set] = useInputControls()
  const data = pieDataFromControls(controlValues)
  // 测试：为前3个扇区添加自定义 label 和 labelLine 样式
  if (data[0]) {
    data[0].labelLineColor = '#ff0000'
    data[0].labelLineWidth = 1
    data[0].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    data[0].labelLineStyle = {
      labelOffset: 30,
    }
    // 添加复杂多行 HTML 富文本标签
    data[0].label = "<div style='text-align: center;'>" +
      "<div style='color: #ff6b6b; font-size: 1.2em; font-weight: bold; text-shadow: 0 0 10px #ff6b6b; animation: glow 2s ease-in-out infinite alternate;'>🔥 产品A 热销版 🔥</div>" +
      "<div style='color: #4ecdc4; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='background: linear-gradient(45deg, #4ecdc4, #44a08d); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>✨ 全新升级 ✨</span>" +
      "</div>" +
      "<div style='color: #feca57; font-size: 0.8em; font-style: italic;'>" +
        "<span style='border: 1px solid #feca57; padding: 1px 4px; border-radius: 3px; background: rgba(254, 202, 87, 0.1);'>限时特价 8.8折</span>" +
      "</div>" +
      "</div>"
  }
  if (data[1]) {
    data[1].labelLineColor = '#0000ff'
    data[1].labelLineWidth = 1
    data[1].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 添加复杂多行 HTML 富文本标签
    data[1].label = "<div style='text-align: center;'>" +
      "<div style='color: #45b7d1; font-size: 1.1em; font-weight: bold;'>" +
        "<span style='background: linear-gradient(90deg, #45b7d1, #96ceb4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>🚀 产品B 旗舰版</span>" +
      "</div>" +
      "<div style='color: #96ceb4; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border-left: 3px solid #96ceb4; padding-left: 8px; background: rgba(150, 206, 180, 0.1);'>💎 钻石品质保证</span>" +
      "</div>" +
      "<div style='color: #feca57; font-size: 0.8em;'>" +
        "<span style='background: linear-gradient(45deg, #feca57, #ff9ff3); padding: 2px 6px; border-radius: 4px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);'>VIP 专属服务</span>" +
      "</div>" +
      "</div>"
  }
  if (data[2]) {
    data[2].labelLineColor = '#00ff00'
    data[2].labelLineWidth = 1
    data[2].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 添加复杂多行 HTML 富文本标签
    data[2].label = "<div style='text-align: center;'>" +
      "<div style='color: #ffd700; font-size: 1.1em; font-weight: bold; text-shadow: 0 0 8px #ffd700;'>" +
        "<span style='background: radial-gradient(circle, #ffd700, #ffed4e); padding: 2px 8px; border-radius: 5px; color: #333;'>⭐ 产品C 至尊版 ⭐</span>" +
      "</div>" +
      "<div style='color: #ff9ff3; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border: 2px dashed #ff9ff3; padding: 1px 6px; border-radius: 3px; background: rgba(255, 159, 243, 0.1);'>🎯 精准定位 智能推荐</span>" +
      "</div>" +
      "<div style='color: #54a0ff; font-size: 0.8em; font-style: italic;'>" +
        "<span style='background: linear-gradient(135deg, #54a0ff, #5f27cd); color: white; padding: 1px 5px; border-radius: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);'>AI 驱动 未来科技</span>" +
      "</div>" +
      "</div>"
  }
  
  // 为其他扇区添加更多样式示例
  if (data[3]) {
    data[3].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 添加复杂多行 HTML 富文本标签
    data[3].label = "<div style='text-align: center;'>" +
      "<div style='color: #ff9ff3; font-size: 1.1em; font-weight: bold;'>" +
        "<span style='background: linear-gradient(45deg, #ff9ff3, #f368e0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 15px #ff9ff3;'>🎭 产品D 艺术版</span>" +
      "</div>" +
      "<div style='color: #54a0ff; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border: 2px solid #54a0ff; border-radius: 15px; padding: 2px 8px; background: linear-gradient(135deg, rgba(84, 160, 255, 0.2), rgba(95, 39, 205, 0.2));'>🎨 创意无限 艺术无界</span>" +
      "</div>" +
      "<div style='color: #ff6b6b; font-size: 0.8em; font-style: italic;'>" +
        "<span style='background: radial-gradient(circle, #ff6b6b, #ee5a24); color: white; padding: 1px 6px; border-radius: 4px; box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);'>🔥 限时抢购 库存紧张</span>" +
      "</div>" +
      "</div>"
  }
  
  if (data[4]) {
    data[4].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 添加复杂多行 HTML 富文本标签
    data[4].label = "<div style='text-align: center;'>" +
      "<div style='color: #00d2d3; font-size: 1.1em; font-weight: bold;'>" +
        "<span style='background: linear-gradient(90deg, #00d2d3, #54a0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 12px #00d2d3;'>🌟 其他产品 探索版</span>" +
      "</div>" +
      "<div style='color: #5f27cd; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border-left: 4px solid #5f27cd; padding-left: 10px; background: linear-gradient(90deg, rgba(95, 39, 205, 0.1), rgba(84, 160, 255, 0.1));'>🔮 神秘功能 即将揭晓</span>" +
      "</div>" +
      "<div style='color: #ff9ff3; font-size: 0.8em;'>" +
        "<span style='background: linear-gradient(135deg, #ff9ff3, #f368e0); color: white; padding: 2px 8px; border-radius: 6px; box-shadow: 0 3px 10px rgba(255, 159, 243, 0.4); text-shadow: 1px 1px 2px rgba(0,0,0,0.3);'>🚀 敬请期待 惊喜不断</span>" +
      "</div>" +
      "</div>"
  }

  // 如果有更多扇区，继续添加富文本示例
  if (data[5]) {
    data[5].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 复杂的多行 HTML 富文本组合
    data[5].label = "<div style='text-align: center;'>" +
      "<div style='color: #ffd700; font-size: 1.2em; font-weight: bold;'>" +
        "<span style='background: linear-gradient(45deg, #ffd700, #ffed4e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 20px #ffd700;'>👑 高级版 VIP 专属</span>" +
      "</div>" +
      "<div style='color: #ff9ff3; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border: 3px solid #ff9ff3; border-radius: 20px; padding: 3px 10px; background: linear-gradient(135deg, rgba(255, 159, 243, 0.2), rgba(243, 104, 224, 0.2)); box-shadow: 0 4px 15px rgba(255, 159, 243, 0.3);'>💎 尊享特权 专属服务</span>" +
      "</div>" +
      "<div style='color: #54a0ff; font-size: 0.8em; font-style: italic;'>" +
        "<span style='background: radial-gradient(circle, #54a0ff, #5f27cd); color: white; padding: 2px 8px; border-radius: 5px; box-shadow: 0 3px 12px rgba(84, 160, 255, 0.4); text-shadow: 1px 1px 3px rgba(0,0,0,0.3);'>🚀 优先体验 最新功能</span>" +
      "</div>" +
      "</div>"
  }

  if (data[6]) {
    data[6].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 企业版多行富文本
    data[6].label = "<div style='text-align: center;'>" +
      "<div style='color: #ff6b6b; font-size: 1.1em; font-weight: bold;'>" +
        "<span style='background: linear-gradient(90deg, #ff6b6b, #ee5a24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 15px #ff6b6b;'>🏢 企业版 专业级</span>" +
      "</div>" +
      "<div style='color: #4caf50; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border: 2px solid #4caf50; border-radius: 12px; padding: 2px 8px; background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2)); box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);'>✅ 官方推荐 品质保证</span>" +
      "</div>" +
      "<div style='color: #2196f3; font-size: 0.8em;'>" +
        "<span style='background: linear-gradient(135deg, #2196f3, #1976d2); color: white; padding: 1px 6px; border-radius: 4px; box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4); text-shadow: 1px 1px 2px rgba(0,0,0,0.3);'>🔒 企业级安全 数据保护</span>" +
      "</div>" +
      "</div>"
  }

  if (data[7]) {
    data[7].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 旗舰版多行富文本
    data[7].label = "<div style='text-align: center;'>" +
      "<div style='color: #9c27b0; font-size: 1.2em; font-weight: bold;'>" +
        "<span style='background: linear-gradient(45deg, #9c27b0, #673ab7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 18px #9c27b0;'>🚢 旗舰版 至尊体验</span>" +
      "</div>" +
      "<div style='color: #e91e63; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border: 2px dashed #e91e63; border-radius: 15px; padding: 3px 10px; background: linear-gradient(135deg, rgba(233, 30, 99, 0.1), rgba(156, 39, 176, 0.1)); box-shadow: 0 3px 12px rgba(233, 30, 99, 0.2);'>💫 限量发售 珍藏版</span>" +
      "</div>" +
      "<div style='color: #ff9800; font-size: 0.8em; font-style: italic;'>" +
        "<span style='background: radial-gradient(circle, #ff9800, #f57c00); color: white; padding: 2px 8px; border-radius: 6px; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4); text-shadow: 1px 1px 3px rgba(0,0,0,0.3);'>🔥 抢购倒计时 仅剩 99 套</span>" +
      "</div>" +
      "</div>"
  }

  if (data[8]) {
    data[8].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 定制版多行富文本
    data[8].label = "<div style='text-align: center;'>" +
      "<div style='color: #673ab7; font-size: 1.1em; font-weight: bold;'>" +
        "<span style='background: linear-gradient(90deg, #673ab7, #3f51b5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 16px #673ab7;'>🎨 定制版 专属设计</span>" +
      "</div>" +
      "<div style='color: #00bcd4; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border: 3px solid #00bcd4; border-radius: 18px; padding: 3px 10px; background: linear-gradient(135deg, rgba(0, 188, 212, 0.2), rgba(0, 150, 136, 0.2)); box-shadow: 0 4px 16px rgba(0, 188, 212, 0.3);'>✨ 个性化定制 独一无二</span>" +
      "</div>" +
      "<div style='color: #ff5722; font-size: 0.8em;'>" +
        "<span style='background: linear-gradient(135deg, #ff5722, #e64a19); color: white; padding: 2px 8px; border-radius: 5px; box-shadow: 0 3px 12px rgba(255, 87, 34, 0.4); text-shadow: 1px 1px 3px rgba(0,0,0,0.3);'>🎯 专业团队 一对一服务</span>" +
      "</div>" +
      "</div>"
  }

  if (data[9]) {
    data[9].labelStyle = {
      labelOffset: 100,
      color: '#ffffff',
      fontSize: 0.12,
    }
    // 热门版多行富文本
    data[9].label = "<div style='text-align: center;'>" +
      "<div style='color: #ff9800; font-size: 1.2em; font-weight: bold;'>" +
        "<span style='background: linear-gradient(45deg, #ff9800, #ff5722); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 20px #ff9800;'>🔥 热门版 爆款推荐</span>" +
      "</div>" +
      "<div style='color: #e91e63; font-size: 0.9em; margin: 2px 0;'>" +
        "<span style='border: 2px solid #e91e63; border-radius: 20px; padding: 3px 10px; background: linear-gradient(135deg, rgba(233, 30, 99, 0.2), rgba(156, 39, 176, 0.2)); box-shadow: 0 4px 18px rgba(233, 30, 99, 0.3);'>💥 销量冠军 用户首选</span>" +
      "</div>" +
      "<div style='color: #4caf50; font-size: 0.8em; font-style: italic;'>" +
        "<span style='background: radial-gradient(circle, #4caf50, #388e3c); color: white; padding: 2px 8px; border-radius: 6px; box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4); text-shadow: 1px 1px 3px rgba(0,0,0,0.3);'>⚡ 闪电发货 24小时送达</span>" +
      "</div>" +
      "</div>"
  }
  const {
    innerRadius,
    outerRadius,
    cornerRadius,
    padAngle,
    environmentFile,
    spotLightIntensity,
    ambientLightIntensity,
    roughness,
    metalness,
    valueLabelPosition,
    showBloom,
    bloomStrength,
    bloomRadius,
    bloomThreshold,
    spinSpeed,
    backgroundColor,
    title,
    titleMaxWidth,
    titleOffset,
    showValues,
    valuesAsPercent,
  } = controlValues

  const addEnvironment = !!environmentFile

  return (
    <div
      id="canvas-container"
      className="w-full h-full"
      style={{ backgroundColor }}
    >
      <Leva
        collapsed={window.innerWidth < 800}
        titleBar={{ title: 'Customize Pie' }}
      />
      <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 3, 4], fov: 50 }}>
        <CSS2DRendererProvider>
          <ambientLight intensity={ambientLightIntensity} />

          <spotLight
            intensity={spotLightIntensity}
            angle={0.1}
            penumbra={1}
            position={[10, 15, 10]}
            castShadow
          />

          <Suspense fallback={null}>
            <Turntable enabled={spinSpeed > 0} speed={spinSpeed * 0.02}>
              <Pie
                data={data}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                cornerRadius={cornerRadius}
                padAngle={padAngle}
                roughness={roughness}
                metalness={metalness}
                valueLabelPosition={valueLabelPosition}
                showValues={showValues}
                valuesAsPercent={valuesAsPercent}
                onClickSlice={(i) =>
                  set({ [`explode${i}`]: !controlValues[`explode${i}`] })
                }
              />
            </Turntable>
          </Suspense>
        </CSS2DRendererProvider>
        {addEnvironment && (
          <Suspense fallback={null}>
            <Environment path="/hdri/" files={environmentFile} />
          </Suspense>
        )}
        <ContactShadows
          rotation-x={Math.PI / 2}
          position={[0, -0.4, 0]}
          opacity={0.65}
          width={30}
          height={30}
          blur={1.5}
          far={0.8}
        />
        <GizmoHelper
          alignment={'bottom-left'}
          margin={[80, 80]}
          onTarget={() => orbitControlsRef?.current?.target}
          onUpdate={() => orbitControlsRef.current?.update()}
        >
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor={'white'}
          />
        </GizmoHelper>
        <OrbitControls
          ref={orbitControlsRef}
          // minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          // enableZoom={false}
          enablePan={false}
        />
        {showBloom && (
          <Effects
            backgroundColor={backgroundColor}
            bloomStrength={bloomStrength}
            bloomThreshold={bloomThreshold}
            bloomRadius={bloomRadius}
          />
        )}
      </Canvas>
      {/* Optionally render the 2D version */}
      {/* <div className="absolute top-0 left-0">
        <SvgPie data={data} />
      </div> */}
      <div
        className="absolute w-full mx-auto text-3xl font-black text-center poxinter-events-none"
        style={{
          top: '50%',
          left: '50%',
          maxWidth: `${titleMaxWidth}vw`,
          transform: `translate(-50%, ${titleOffset}vh)`,
          textShadow: `-1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, 4px 4px 10px rgba(0,0,0,0.5)`,
        }}
      >
        {title}
      </div>
    </div>
  )
}

export default App
