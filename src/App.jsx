import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React, { Suspense } from 'react'
import Effects from './Effects'
import Pie from './Pie'
import Turntable from './Turntable'
import useInputControls, { pieDataFromControls } from './useInputControls'

function App() {
  const orbitControlsRef = React.useRef()
  const [controlValues, set] = useInputControls()
  const data = pieDataFromControls(controlValues)
  // 测试：为前3个扇区添加自定义 label 和 labelLine 样式
  if (data[0]) {
    data[0].customLabel = [
      '{title|自定义A}', 
      '{subtitle|测试123}', 
      '{highlight|红色线3px}'
    ]
    data[0].labelLineColor = '#ff0000'
    data[0].labelLineWidth = 1
    data[0].labelStyle = {
      color: '#ffffff',
      fontSize: 0.12,
      rich: {
        title: {
          color: '#ff6b6b',
          fontSize: 0.14,
          fontFamily: 'bold',
          outlineWidth: '3%',
          outlineColor: '#000'
        },
        subtitle: {
          color: '#4ecdc4',
          fontSize: 0.10,
          outlineWidth: '2%'
        },
        highlight: {
          color: '#ff0000',
          fontSize: 0.11,
          outlineWidth: '4%',
          outlineColor: '#fff'
        }
      }
    }
  }
  if (data[1]) {
    data[1].customLabel = [
      '{title|自定义B}', 
      '{info|蓝色线1px}',
      '{value|34.00%}'
    ]
    data[1].labelLineColor = '#0000ff'
    data[1].labelLineWidth = 1
    data[1].labelStyle = {
      color: '#ffffff',
      fontSize: 0.12,
      rich: {
        title: {
          color: '#4dabf7',
          fontSize: 0.15,
          fontFamily: 'bold',
          outlineWidth: '3%',
          outlineColor: '#000'
        },
        info: {
          color: '#74c0fc',
          fontSize: 0.10,
          outlineWidth: '2%'
        },
        value: {
          color: '#339af0',
          fontSize: 0.13,
          fontFamily: 'bold',
          outlineWidth: '3%',
          outlineColor: '#fff'
        }
      }
    }
  }
  if (data[2]) {
    data[2].customLabel = [
      '{title|自定义C}', 
      '{data|0.4800}',
      '{config|绿色线5px}',
      '{percent|10.74%}'
    ]
    data[2].labelLineColor = '#00ff00'
    data[2].labelLineWidth = 1
    data[2].labelStyle = {
      color: '#ffffff',
      fontSize: 0.12,
      rich: {
        title: {
          color: '#51cf66',
          fontSize: 0.14,
          fontFamily: 'bold',
          outlineWidth: '3%',
          outlineColor: '#000'
        },
        data: {
          color: '#69db7c',
          fontSize: 0.11,
          fontFamily: 'monospace',
          outlineWidth: '2%'
        },
        config: {
          color: '#8ce99a',
          fontSize: 0.10,
          outlineWidth: '2%'
        },
        percent: {
          color: '#40c057',
          fontSize: 0.12,
          fontFamily: 'bold',
          outlineWidth: '3%',
          outlineColor: '#fff'
        }
      }
    }
  }
  
  // 为其他扇区添加更多样式示例
  if (data[3]) {
    data[3].customLabel = [
      '{header|数据统计}',
      '{metric|14.00%}',
      '{detail|增长趋势}'
    ]
    data[3].labelStyle = {
      color: '#ffffff',
      fontSize: 0.12,
      rich: {
        header: {
          color: '#ffd43b',
          fontSize: 0.13,
          fontFamily: 'bold',
          outlineWidth: '3%',
          outlineColor: '#000',
          xOffset: 0.05
        },
        metric: {
          color: '#fcc419',
          fontSize: 0.15,
          fontFamily: 'bold',
          outlineWidth: '4%',
          outlineColor: '#fff',
          yOffset: -0.02
        },
        detail: {
          color: '#ffe066',
          fontSize: 0.10,
          outlineWidth: '2%',
          xOffset: -0.03
        }
      }
    }
  }
  
  if (data[4]) {
    data[4].customLabel = [
      '{icon|📊}',
      '{label|分析报告}',
      '{value|11.00%}'
    ]
    data[4].labelStyle = {
      color: '#ffffff',
      fontSize: 0.12,
      rich: {
        icon: {
          color: '#20c997',
          fontSize: 0.16,
          outlineWidth: '3%',
          outlineColor: '#000'
        },
        label: {
          color: '#38d9a9',
          fontSize: 0.12,
          fontFamily: 'bold',
          outlineWidth: '2%'
        },
        value: {
          color: '#63e6be',
          fontSize: 0.14,
          fontFamily: 'bold',
          outlineWidth: '3%',
          outlineColor: '#fff'
        }
      }
    }
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
        {/* <GizmoHelper
          alignment={'bottom-left'}
          margin={[80, 80]}
          onTarget={() => orbitControlsRef?.current?.target}
          onUpdate={() => orbitControlsRef.current?.update()}
        >
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor={'white'}
          />
        </GizmoHelper> */}
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
      <div className="absolute bottom-0 p-2 text-xs text-gray-500">
        Made with 😈&nbsp; by{' '}
        <a
          href="https://peterbeshai.com"
          className="font-semibold hover:underline"
        >
          Peter Beshai
        </a>
        <a
          href="https://github.com/pbeshai/3dpie"
          className="ml-2 font-medium hover:underline"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

export default App
