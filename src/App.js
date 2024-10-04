import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, AdaptiveDpr, View } from '@react-three/drei'
import { Bloom, Sepia, Scanline, Pixelation, EffectComposer, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { ViewPostProcessing, ViewEffects } from './ViewEffectsComposerWrapper.js'

export default function App() {
  return (
    <>
      <div className="container">
        <Canvas
          eventSource={document.getElementById('root')}
          gl={{ alpha: true, powerPreference: 'high-performance', outputColorSpace: 'srgb' }}
          shadows
          className="canvas"
          flat
          dpr={[1, 2]}
          performance={{ min: 0.1, max: 1 }}>
          <View.Port />
          <AdaptiveDpr />
        </Canvas>

        <div className="panel panel-1">
          <ViewPostProcessing index={1} dpr={[1, 2]}>
            <Scene zoom={2}>
              <Torus scale={0.55} />
              <ViewEffects multisampling={0} stencilBuffer={false} depthBuffer={false}>
                <Noise opacity={0.75} blendFunction={BlendFunction.OVERLAY} />
                <ChromaticAberration radialModulation={true} modulationOffset={0.4} offset={[0.01, 0.01]} />
                <Bloom mipmapBlur luminanceThreshold={1} levels={5} intensity={0.2 * 4} />
              </ViewEffects>
            </Scene>
          </ViewPostProcessing>
        </div>
        <div className="panel panel-2">
          <ViewPostProcessing
            index={2}
            dpr={0.5}
            effects={
              <>
                <Bloom mipmapBlur luminanceThreshold={1} levels={5} intensity={0.2 * 3} />
              </>
            }>
            <Scene zoom={1.6}>
              <Knot scale={0.4} />
            </Scene>
          </ViewPostProcessing>
        </div>

        <div className="panel panel-3">
          <ViewPostProcessing
            index={3}
            dpr={[0.5, 1]}
            effects={
              <>
                <Bloom mipmapBlur luminanceThreshold={1} levels={5} intensity={0.2 * 3} />
                <Scanline blendFunction={BlendFunction.OVERLAY} />
              </>
            }>
            <Scene>
              <Torus position={[-0.5, -0.5, 0]} scale={0.55} />
              <Knot position={[0.5, 0.5, 0]} scale={0.4} />
            </Scene>
          </ViewPostProcessing>
        </div>

        <div className="panel panel-4">
          <ViewPostProcessing
            index={4}
            dpr={[1, 2]}
            effects={
              <>
                <Bloom mipmapBlur luminanceThreshold={1} levels={5} intensity={0.2 * 3} />
                <Sepia />
              </>
            }>
            <Scene zoom={2.4}>
              <Torus scale={0.55} rotation={[0, -0.68, 0]} />
            </Scene>
          </ViewPostProcessing>
        </div>

        <div className="panel panel-5">
          <ViewPostProcessing
            index={5}
            dpr={[1, 2]}
            effects={
              <>
                <Bloom mipmapBlur luminanceThreshold={1} levels={5} intensity={0.2 * 4} />
                <Pixelation granularity={12} />
                <Noise opacity={0.2} blendFunction={BlendFunction.OVERLAY} />
              </>
            }>
            <Scene zoom={1.4}>
              <Center scale={1} />
            </Scene>
          </ViewPostProcessing>
        </div>
      </div>
      <div className="spacer" />
    </>
  )
}

// just a convience component to add a camera and controls
function Scene({ children, zoom = 1 }) {
  return (
    <>
      {children}
      <PerspectiveCamera makeDefault zoom={zoom} position={[0, 0, 4]} />
      <OrbitControls />
    </>
  )
}

function Center(props) {
  const mesh = useRef(null)
  const [hovered, hover] = useState(null)
  useFrame((_, delta) => {
    mesh.current.rotation.y -= delta * 0.3
    mesh.current.rotation.x -= delta * 0.15
  })
  return (
    <>
      <Environment preset="warehouse" />
      <ambientLight intensity={1} />

      <mesh ref={mesh} receiveShadow castShadow onPointerOver={(e) => hover(true)} onPointerOut={(e) => hover(false)} {...props}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={hovered ? 'hotpink' : 'orange'}
          emissive={hovered ? 'hotpink' : 'orange'}
          emissiveIntensity={hovered ? 3 : 0}
        />
      </mesh>
    </>
  )
}

function Torus(props) {
  const group = useRef(null)
  const [hovered, hover] = useState(null)
  useFrame((_, delta) => {
    group.current.rotation.x -= delta * 0.3
    group.current.rotation.y += delta * 0.3
    group.current.rotation.z -= delta * 0.3
  })
  return (
    <>
      <color attach="background" args={['#1b1a21']} />
      <Environment preset="city" />

      <group ref={group}>
        <directionalLight position={[25, 25, 25]} intensity={5.5} castShadow />
        <directionalLight position={[-25, -50, -25]} intensity={0.5} castShadow />
      </group>
      <mesh receiveShadow castShadow onPointerOver={(e) => hover(true)} onPointerOut={(e) => hover(false)} {...props}>
        <torusGeometry args={[1, 0.25, 32, 100]} />
        <meshStandardMaterial
          color={hovered ? 'hotpink' : 'orange'}
          emissive={hovered ? 'hotpink' : 'orange'}
          emissiveIntensity={hovered ? 1 : 0}
        />
      </mesh>
    </>
  )
}

function Knot(props) {
  const mesh = useRef(null)
  const [hovered, hover] = useState(null)
  useFrame((_, delta) => {
    mesh.current.rotation.y -= delta * 0.3
    mesh.current.rotation.x -= delta * 0.15
  })

  return (
    <>
      <color attach="background" args={['#221f38']} />

      <ambientLight intensity={3} />
      <Environment preset="city" />
      <mesh ref={mesh} onPointerOver={(e) => hover(true)} onPointerOut={(e) => hover(false)} {...props}>
        <torusKnotGeometry args={[1, 0.3, 128, 128, 2, 3]} />
        <meshStandardMaterial
          color={hovered ? 'hotpink' : 'orange'}
          emissive={hovered ? 'hotpink' : 'orange'}
          emissiveIntensity={hovered ? 2 : 0}
        />
      </mesh>
    </>
  )
}
