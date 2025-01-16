// import React, { useRef, useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import * as THREE from 'three';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { Environment, PerspectiveCamera, useGLTF, useTexture, Decal, Center } from '@react-three/drei';
// import { easing } from 'maath';
// import { useSnapshot } from 'valtio';
// import { proxy } from 'valtio';

// const state = proxy({
//   colors: ["#ccc", "#EFBD4E", "#80C670", "#726DE8", "#EF674E", "#353934"],
//   color: "#EFBD4E",
//   decal: "lion",
// });

// function Scene() {
//   const lightLeft = useRef();
//   const lightRight = useRef();
  
//   useFrame((state) => {
//     if (lightLeft.current && lightRight.current) {
//       lightLeft.current.intensity = 1 + Math.sin(state.clock.elapsedTime) * 0.2;
//       lightRight.current.intensity = 1 + Math.cos(state.clock.elapsedTime) * 0.2;
//     }
//   });

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 0, 5]} />
//       <spotLight
//         ref={lightLeft}
//         position={[-4, 2, 3]}
//         angle={0.3}
//         penumbra={1}
//         intensity={1}
//         color="#FFD700"
//         castShadow
//       />
//       <spotLight
//         ref={lightRight}
//         position={[4, 2, 3]}
//         angle={0.3}
//         penumbra={1}
//         intensity={1}
//         color="#FFD700"
//         castShadow
//       />
//       <Hanger />
//       <Stand />
//       <Center>
//         <Shirt />
//       </Center>
//     </>
//   );
// }

// function Hanger() {
//   const mesh = useRef();

//   useFrame((state) => {
//     mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
//   });

//   return (
//     <group ref={mesh}>
//       <mesh position={[0, 2, 0]}>
//         <cylinderGeometry args={[0.05, 0.05, 2, 16]} />
//         <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
//       </mesh>
//       <mesh position={[0, 2.5, 0]}>
//         <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
//         <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
//       </mesh>
//     </group>
//   );
// }

// function Stand() {
//   return (
//     <mesh position={[0, -2, 0]} receiveShadow>
//       <boxGeometry args={[3, 0.2, 1]} />
//       <meshStandardMaterial color="#444" />
//     </mesh>
//   );
// }

// function Shirt() {
//   const snap = useSnapshot(state);
//   const texture = useTexture(`/${snap.decal}.png`);
//   const { nodes, materials } = useGLTF("/shirt_baked_collapsed.glb");
//   const meshRef = useRef();

//   useFrame((state, delta) => {
//     if (meshRef.current.material) {
//       easing.dampC(meshRef.current.material.color, snap.color, 0.25, delta);
//     }
//     meshRef.current.rotation.y += 0.01;
//   });

//   return (
//     <mesh
//       ref={meshRef}
//       castShadow
//       geometry={nodes.T_Shirt_male.geometry}
//       material={materials.lambert1}
//       material-roughness={1}
//       dispose={null}
//       scale={2.5}  // Increased scale for a larger shirt
//     >
//       <meshStandardMaterial color={snap.color} />
//       <Decal
//         position={[0, 0.04, 0.15]}
//         rotation={[0, 0, 0]}
//         scale={0.15}
//         map={texture}
//       />
//     </mesh>
//   );
// }

// function Lamps() {
//   return (
//     <div className="absolute inset-0 pointer-events-none">
//       <svg width="100%" height="100%" className="absolute inset-0">
//         <defs>
//           <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
//             <stop offset="0%" stopColor="rgba(255, 215, 0, 0.3)" />
//             <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
//           </radialGradient>
//         </defs>
//         <g className="left-lamp">
//           <circle cx="20%" cy="30%" r="100" fill="url(#lampGlow)" />
//           <path
//             d="M 18 25 L 22 25 L 20 35 Z"
//             fill="#FFD700"
//             className="animate-pulse"
//           />
//         </g>
//         <g className="right-lamp">
//           <circle cx="80%" cy="30%" r="100" fill="url(#lampGlow)" />
//           <path
//             d="M 78 25 L 82 25 L 80 35 Z"
//             fill="#FFD700"
//             className="animate-pulse"
//           />
//         </g>
//       </svg>
//     </div>
//   );
// }

// function Customizer() {
//   const snap = useSnapshot(state);
//   return (
//     <div className="absolute bottom-4 left-4 right-4 flex justify-center">
//       <div className="flex space-x-2">
//         {snap.colors.map((color) => (
//           <div
//             key={color}
//             className="w-8 h-8 rounded-full cursor-pointer border-2 border-white transition-transform duration-300 hover:scale-110"
//             style={{ background: color }}
//             onClick={() => (state.color = color)}
//           ></div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function ShirtDisplaySection() {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   return (
//     <section className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//         className="absolute inset-0"
//       >
//         <Canvas shadows camera={{ position: [0, 0, 5], fov: 25 }}>
//           <Scene />
//           <Environment preset="city" />
//         </Canvas>
//       </motion.div>
      
//       <Lamps />
//       <Customizer />

//       <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center">
//         <motion.div
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.5, duration: 0.8 }}
//           className="text-center"
//         >
//           <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
//             Premium Quality Shirts
//           </h2>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//             Experience our collection of meticulously crafted shirts, 
//             designed for both style and comfort. Each piece is a perfect 
//             blend of contemporary design and timeless elegance.
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="mt-8 px-8 py-3 bg-yellow-500 text-gray-900 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-colors"
//           >
//             Explore Collection
//           </motion.button>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// useGLTF.preload("/shirt_baked_collapsed.glb");
// useTexture.preload("/lion.png");

import React, { useRef, useEffect, useState, Suspense, useContext } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  PerspectiveCamera, 
  useGLTF, 
  useTexture, 
  Decal, 
  Center,
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { proxy } from 'valtio';

const ThemeContext = React.createContext();

const state = proxy({
  color: "#FFFFFF",
  decal: "lion",
});

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={25} />
      <ambientLight intensity={0.5} />
      <Environment preset="studio" />
      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </>
  );
}

function CameraRig({ children }) {
  const group = useRef();
  useFrame((state, delta) => {
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    );
  });
  return <group ref={group}>{children}</group>;
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

function Shirt() {
  const snap = useSnapshot(state);
  const texture = useTexture(`/${snap.decal}.png`);
  const { nodes, materials } = useGLTF("/shirt_baked_collapsed.glb");
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color = new THREE.Color("#FFFFFF");
    }
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={new THREE.MeshStandardMaterial({
        color: "#FFFFFF",
        roughness: 0.5,
        metalness: 0.1,
      })}
      dispose={null}
      scale={1.5}
    >
      <Decal
        position={[0, 0.04, 0.15]}
        rotation={[0, 0, 0]}
        scale={0.15}
        map={texture}
      />
    </mesh>
  );
}

function TypingText({ text }) {
  const { darkMode } = useContext(ThemeContext);
  const words = text.split(' ');
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`text-4xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 text-left`}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

function Lamps() {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={darkMode ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 215, 0, 0.3)"} />
            <stop offset="100%" stopColor={darkMode ? "rgba(255, 215, 0, 0)" : "rgba(255, 215, 0, 0)"} />
          </radialGradient>
        </defs>
        <g className="left-lamp">
          <circle cx="20%" cy="30%" r="100" fill="url(#lampGlow)" />
          <path
            d="M 18 25 L 22 25 L 20 35 Z"
            fill={darkMode ? "#B7791F" : "#FFD700"}
            className="animate-pulse"
          />
        </g>
        <g className="right-lamp">
          <circle cx="80%" cy="30%" r="100" fill="url(#lampGlow)" />
          <path
            d="M 78 25 L 82 25 L 80 35 Z"
            fill={darkMode ? "#B7791F" : "#FFD700"}
            className="animate-pulse"
          />
        </g>
      </svg>
    </div>
  );
}

export default function ShirtDisplaySection({ darkMode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      useGLTF.preload("/shirt_baked_collapsed.glb"),
      useTexture.preload("/lion.png")
    ]).then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div className={`w-full h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading...</div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      <section className={`relative w-full h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
        <Lamps />
        <div className="container mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center gap-8">
            {/* Left side - Text Content */}
            <div className="px-4 md:px-8 z-10">
              <TypingText text="Start your successful product customization with Frist Ox!" />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mb-8 text-left`}
              >
                Experience our collection of meticulously crafted shirts, 
                designed for both style and comfort. Each piece is a perfect 
                blend of contemporary design and timeless elegance.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-yellow-500 text-gray-900 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-colors"
              >
                Explore Collection
              </motion.button>
            </div>

            {/* Right side - 3D Shirt */}
            <div className="h-full w-full relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Canvas
                  shadows
                  camera={{ position: [0, 0, 2.5], fov: 25 }}
                  gl={{ preserveDrawingBuffer: true }}
                  onCreated={({ gl }) => {
                    gl.setClearColor(new THREE.Color(darkMode ? '#111827' : '#ffffff'), 0);
                  }}
                >
                  <Suspense fallback={null}>
                    <Scene />
                  </Suspense>
                </Canvas>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </ThemeContext.Provider>
  );
}



