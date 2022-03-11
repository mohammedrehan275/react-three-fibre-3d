import Head from 'next/head'
import {useState, useRef} from "react"
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useSpring , animated} from '@react-spring/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import styles from '../styles/Home.module.css'


extend({OrbitControls});

  const Controls = () => {
    const orbitRef = useRef()
    const { camera, gl } = useThree();

    useFrame(() => {
      orbitRef.current.update()
    })
    return(
      <orbitControls 
        autoRotate
        maxPolarAngle={Math.PI/3}
        minPolarAngle={Math.PI/3}
        args= {[camera, gl.domElement]}
        ref={orbitRef}
      />
    )
  }

const Plane = () => (
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.5,0]} receiveShadow>
    <planeBufferGeometry attach='geometry' args={[100,100]}/>
    <meshPhysicalMaterial attach="material"  color="white"/>
  </mesh>
)

const Box = () => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const props = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1,1,1],
    color: hovered ? "hotpink" : "gray",
  })

  return (
    <animated.mesh 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={props.scale}
      castShadow
    >
      <ambientLight />
      <spotLight 
        position={[5,5,10]} 
        penumbra={1}
        castShadow
      />
      <boxBufferGeometry attach='geometry' args={[1,1,1]}/>
      <animated.meshPhysicalMaterial attach="material"  color={props.color}/>
    </animated.mesh>
  )  
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Canvas camera={{position:[0,0,5]}} onCreated={({gl}) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}>
        <fog attach="fog" args={["white", 5,15]} />
        <Controls />
        <Box />
        <Plane />
      </Canvas>
    </div>
  )
}
