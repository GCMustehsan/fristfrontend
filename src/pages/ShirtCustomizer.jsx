"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  AccumulativeShadows,
  RandomizedLight,
  Decal,
  Environment,
  Center,
} from "@react-three/drei";
import { easing } from "maath";
import { proxy } from "valtio";

const state = proxy({
  color: "#ffffff",
  decal: "shirt-logo-r",
});

function Shirt(props) {
  const texture = useTexture(`/${state.decal}.png`);
  const { nodes, materials } = useGLTF("/shirt_baked_collapsed.glb");
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={1}
      {...props}
      dispose={null}
    >
      <meshStandardMaterial color={state.color} />
      <Decal
        position={[0, 0.04, 0.15]}
        rotation={[0, 0, 0]}
        scale={0.15}
        map={texture}
      />
    </mesh>
  );
}

function Backdrop() {
  const shadows = useRef();
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
}

function ShirtCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2.5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full dark:bg-gray-900"
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <Center>
        <Shirt />
      </Center>
      <Backdrop />
    </Canvas>
  );
}

export default function ShirtCustomizer() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col md:flex-row bg-white dark:bg-black">
      <div className="w-full md:w-1/2 p-12 flex flex-col justify-center dark:bg-gray-900">
        <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
          Design your dream shirt with Frist Ox Studio!
        </h1>
        <p className="text-xl text-gray-600 mb-8 dark:text-white">
          Make every shirt a masterpiece with Frist Ox. Customize your attire to
          align with your vision, combining elegance with personal touch.Design
          shirts that are as unique as you are, blending innovative style with
          custom-fit comfort.
        </p>
      </div>
      <div className="w-full md:w-1/2 relative">
        <ShirtCanvas />
      </div>
    </div>
  );
}

useGLTF.preload("/shirt_baked_collapsed.glb");
["shirt-logo-r.png"].forEach(useTexture.preload);
