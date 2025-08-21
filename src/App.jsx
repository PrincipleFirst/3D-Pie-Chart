import { ContactShadows, Environment, OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React, { Suspense } from 'react'
import Effects from './Effects'
import Pie from './Pie'
import Turntable from './Turntable'
import useInputControls, { pieDataFromControls } from './useInputControls'
import CSS2DRendererProvider from './CSS2DRenderer'
import { getConfig, isProduction } from './config'
import { isFeatureEnabled } from './env'

function App() {
  const orbitControlsRef = React.useRef()
  const [controlValues, set] = useInputControls()
  
  // 获取配置
  const config = getConfig()
  
  // 强制使用配置文件中的数据，确保标签显示
  const data = config.data
  
  // 添加详细的调试信息
  console.log('App.jsx data:', { 
    controlValues: controlValues.numSlices, 
    configData: config.data, 
    finalData: data,
    firstItemLabel: data[0]?.label,
    dataLength: data.length
  })

  // 从配置或控制面板获取参数
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
  } = controlValues.numSlices ? controlValues : {
    ...config.layout,
    ...config.style,
    ...config.lighting,
    ...config.effects,
    ...config.interaction,
    title: config.layout.title,
    titleMaxWidth: config.layout.titleMaxWidth,
    titleOffset: config.layout.titleOffset,
    backgroundColor: config.style.backgroundColor,
    showValues: config.interaction.showValues,
    valuesAsPercent: config.interaction.valuesAsPercent,
  }

  const addEnvironment = !!environmentFile

  return (
    <div
      id="canvas-container"
      className="w-full h-full"
      style={{ backgroundColor }}
    >
      {/* 只在非生产环境或配置允许时显示控制面板 */}
      {isFeatureEnabled('controlPanel') && (
        <Leva
          collapsed={window.innerWidth < 800}
          titleBar={{ title: 'Customize Pie' }}
        />
      )}
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
                onClickSlice={(i) => {
                  if (controlValues.numSlices) {
                    set({ [`explode${i}`]: !controlValues[`explode${i}`] })
                  }
                }}
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
