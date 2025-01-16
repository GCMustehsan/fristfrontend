import { useState, useRef, Suspense, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center, OrbitControls } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { proxy } from 'valtio'
import { motion } from 'framer-motion'
import { FiUpload, FiDownload, FiVideo } from 'react-icons/fi'
import { ErrorBoundary } from 'react-error-boundary'

const state = proxy({
  color: '#ffffff', // Default white shirt
  logoDecal: 'three2',
  backgroundColor: '#000000', // Default black background
  isLoading: false,
  error: null,
  isRecording: false
})

// Error Fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">Error loading 3D content</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  )
}

function Shirt() {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF('/shirt_baked_collapsed.glb')
  const logoTexture = useTexture(snap.logoDecal ? `/${snap.logoDecal}.png` : '/placeholder.png')

  useFrame((state, delta) => {
    if (materials.lambert1) {
      easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
    }
  })

  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={1}
      dispose={null}
    >
      <Decal 
        position={[0, 0.04, 0.15]} 
        rotation={[0, 0, 0]} 
        scale={0.15} 
        map={logoTexture}
      />
    </mesh>
  )
}

function CameraRig({ children }) {
  const group = useRef()
  const snap = useSnapshot(state)
  
  useFrame((state, delta) => {
    // Horizontal rotation for video export
    if (snap.isRecording) {
      group.current.rotation.y += delta * 0.5
    }
    easing.dampE(group.current.rotation, [0, group.current.rotation.y, 0], 0.25, delta)
  })
  
  return <group ref={group}>{children}</group>
}

function Backdrop() {
  const shadows = useRef()
  const snap = useSnapshot(state)
  
  useFrame((state, delta) => {
    if (shadows.current) {
      easing.dampC(shadows.current.getMesh().material.color, snap.backgroundColor, 0.25, delta)
    }
  })
  
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={5}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight amount={4} radius={9} intensity={0.55 * Math.PI} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25 * Math.PI} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function ShirtCanvas() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 2.5], fov: 25 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5 * Math.PI} />
          <Environment preset="city" />
          <CameraRig>
            <Backdrop />
            <Center>
              <Shirt />
            </Center>
          </CameraRig>
          <OrbitControls 
            enablePan={false} 
            enableZoom={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  )
}

export default function DesignTool() {
  const snap = useSnapshot(state)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const logoInputRef = useRef(null)

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      state.isLoading = true
      state.error = null
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }
      
      if (file.size > 1024 * 1024) {
        throw new Error('Image size should be less than 1MB')
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        state.logoDecal = e.target.result
      }
      reader.readAsDataURL(file)
    } catch (error) {
      state.error = error.message
      console.error('Error uploading logo:', error)
    } finally {
      state.isLoading = false
    }
  }

  const handleExportImage = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    const link = document.createElement('a')
    link.setAttribute('download', 'shirt-design.png')
    link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
    link.click()
  }

  const handleExportVideo = async () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    try {
      state.isRecording = true
      state.isLoading = true

      const stream = canvas.captureStream(30)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      })
      
      const chunks = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'shirt-design.webm'
        link.click()
        
        state.isRecording = false
        state.isLoading = false
      }

      mediaRecorder.start()

      // Record for 5 seconds
      setTimeout(() => {
        mediaRecorder.stop()
      }, 5000)
    } catch (error) {
      state.error = 'Failed to export video'
      state.isRecording = false
      state.isLoading = false
      console.error('Error exporting video:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white p-4 flex flex-col gap-4 border-r border-gray-200 overflow-y-auto">
        <input
          type="file"
          ref={logoInputRef}
          onChange={handleLogoUpload}
          className="hidden"
          accept="image/*"
        />
        
        {snap.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{snap.error}</span>
          </div>
        )}

        <button
          onClick={() => logoInputRef.current?.click()}
          className="w-full flex items-center justify-between px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          disabled={snap.isLoading}
        >
          <span>Upload Logo</span>
          <FiUpload />
        </button>

        <div className="space-y-4">
          <div className="rounded-md border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Garment Color
            </label>
            <input 
              type="color" 
              value={snap.color}
              onChange={(e) => state.color = e.target.value}
              className="w-full h-10 cursor-pointer"
            />
          </div>

          <div className="rounded-md border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <input 
              type="color" 
              value={snap.backgroundColor}
              onChange={(e) => state.backgroundColor = e.target.value}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>

        <button 
          onClick={handleExportImage}
          className="w-full flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={snap.isLoading}
        >
          <span>Export Image</span>
          <FiDownload />
        </button>

        <button 
          onClick={handleExportVideo}
          className="w-full flex items-center justify-between px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          disabled={snap.isLoading || snap.isRecording}
        >
          <span>{snap.isRecording ? 'Recording...' : 'Export Video'}</span>
          <FiVideo />
        </button>
      </div>

      <div className="flex-1 relative">
        {(snap.isLoading || snap.isRecording) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-sm text-gray-600">
                {snap.isRecording ? 'Recording video...' : 'Loading...'}
              </p>
            </div>
          </div>
        )}
        <ShirtCanvas />
      </div>
    </div>
  )
}

useGLTF.preload('/shirt_baked_collapsed.glb')
;['/react.png', '/three2.png', '/pmndrs.png', '/placeholder.png'].forEach(useTexture.preload)

// 'use client'

// import { useState, useRef, Suspense } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { useGLTF, useTexture, Environment, Center, OrbitControls, Decal } from '@react-three/drei'
// import { easing } from 'maath'
// import { useSnapshot } from 'valtio'
// import { proxy } from 'valtio'
// import { Upload, Type, Palette, FileIcon, Rocket } from 'lucide-react'
// import { ErrorBoundary } from 'react-error-boundary'
// import { ShirtThumbnail } from '../components/shirt-thumbnail'

// const state = proxy({
//   color: '#B05D5D',
//   logoDecal: 'three2',
//   logoPosition: 'center', // center, full, across, left, right, left-sleeve, right-sleeve
//   logoSide: 'front', // front, back
//   backgroundColor: '#ffffff',
//   isLoading: false,
//   error: null,
//   activeFeature: 'logo'
// })

// // Logo position configurations
// const LOGO_POSITIONS = {
//   'front-full': [0, 0.04, 0.15],
//   'front-center': [0, 0.04, 0.15],
//   'front-across': [0, 0.1, 0.15],
//   'front-left': [-0.15, 0.04, 0.15],
//   'front-right': [0.15, 0.04, 0.15],
//   // Updated sleeve positions with corrected coordinates
//   'front-left-sleeve': [-0.35, 0.1, 0.08],  // Moved further left and slightly forward
//   'front-right-sleeve': [0.35, 0.1, 0.08],  // Moved further right and slightly forward
//   'back-full': [0, 0.04, -0.15],
//   'back-center': [0, 0.04, -0.15],
//   'back-across': [0, 0.1, -0.15]
// }

// const LOGO_SCALES = {
//   full: 0.25,
//   center: 0.15,
//   across: [0.3, 0.1, 1],
//   left: 0.1,
//   right: 0.1,
//   // Updated sleeve scales to be smaller and better proportioned
//   'left-sleeve': 0.06,
//   'right-sleeve': 0.06
// }

// function Shirt() {
//   const snap = useSnapshot(state)
//   const { nodes, materials } = useGLTF('/shirt_baked_collapsed.glb')
//   const logoTexture = useTexture(snap.logoDecal ? `/${snap.logoDecal}.png` : '/placeholder.png')

//   useFrame((state, delta) => {
//     if (materials.lambert1) {
//       easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
//     }
//   })

//   const position = LOGO_POSITIONS[`${snap.logoSide}-${snap.logoPosition}`] || [0, 0.04, 0.15]
//   const scale = typeof LOGO_SCALES[snap.logoPosition] === 'number' 
//     ? Array(3).fill(LOGO_SCALES[snap.logoPosition])
//     : LOGO_SCALES[snap.logoPosition]

//   return (
//     <mesh
//       geometry={nodes.T_Shirt_male.geometry}
//       material={materials.lambert1}
//       material-roughness={1}
//       dispose={null}
//     >
//       <Decal 
//         position={position}
//         rotation={[0, 0, 0]}
//         scale={scale}
//         map={logoTexture}
//       />
//     </mesh>
//   )
// }

// function CameraRig({ children }) {
//   const group = useRef()
  
//   useFrame((state, delta) => {
//     easing.dampE(group.current.rotation, [0, -0.2, 0], 0.25, delta)
//   })
  
//   return <group ref={group}>{children}</group>
// }

// function Backdrop() {
//   const snap = useSnapshot(state)
  
//   return (
//     <mesh position={[0, 0, -1]} scale={[100, 100, 1]}>
//       <planeGeometry />
//       <meshBasicMaterial color={snap.backgroundColor} />
//     </mesh>
//   )
// }

// function ShirtCanvas() {
//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback}>
//       <Canvas
//         gl={{ preserveDrawingBuffer: true }}
//         camera={{ position: [0, 0, 2.5], fov: 25 }}
//         className="w-full h-full min-h-[400px] aspect-square md:aspect-video"
//       >
//         <Suspense fallback={null}>
//           <ambientLight intensity={0.5 * Math.PI} />
//           <Environment preset="city" />
//           <CameraRig>
//             <Backdrop />
//             <Center>
//               <Shirt />
//             </Center>
//           </CameraRig>
//           <OrbitControls 
//             enablePan={false} 
//             enableZoom={false}
//             minPolarAngle={Math.PI / 2}
//             maxPolarAngle={Math.PI / 2}
//           />
//         </Suspense>
//       </Canvas>
//     </ErrorBoundary>
//   )
// }

// export default function DesignTool() {
//   const snap = useSnapshot(state)
//   const logoInputRef = useRef(null)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   const handleLogoUpload = async (event) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     try {
//       state.isLoading = true
//       state.error = null
      
//       if (!file.type.startsWith('image/')) {
//         throw new Error('Please upload an image file')
//       }
      
//       if (file.size > 1024 * 1024) {
//         throw new Error('Image size should be less than 1MB')
//       }

//       const reader = new FileReader()
//       reader.onload = (e) => {
//         state.logoDecal = e.target.result
//       }
//       reader.readAsDataURL(file)
//     } catch (error) {
//       state.error = error.message
//       console.error('Error uploading logo:', error)
//     } finally {
//       state.isLoading = false
//     }
//   }

//   const features = [
//     { id: 'logo', icon: Upload, label: 'Logo Customization' },
//     { id: 'text', icon: Type, label: 'Text Customization' },
//     { id: 'color', icon: Palette, label: 'Color Customization' },
//     { id: 'texture', icon: FileIcon, label: 'Texture Customization' },
//     { id: 'finish', icon: Rocket, label: 'Finsih Desiging' }
//   ]

//   const logoPositions = {
//     'Front Side': [
//       { position: 'front', marker: 'full', label: 'Full Front' },
//       { position: 'front', marker: 'center', label: 'Center Chest' },
//       { position: 'front', marker: 'across', label: 'Across Chest' }
//     ],
//     'Sleeves': [
//       { position: 'front', marker: 'left-sleeve', label: 'Left Sleeve' },
//       { position: 'front', marker: 'right-sleeve', label: 'Right Sleeve' }
//     ],
//     'Side': [
//       { position: 'front', marker: 'left', label: 'Left Side' },
//       { position: 'front', marker: 'right', label: 'Right Side' }
//     ],
//     'Back Side': [
//       { position: 'back', marker: 'full', label: 'Full Back' },
//       { position: 'back', marker: 'center', label: 'Center Back' },
//       { position: 'back', marker: 'across', label: 'Across Back' }
//     ]
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
//       {/* Mobile Menu Button */}
//       <button 
//         className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-lg"
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//         </svg>
//       </button>

//       {/* Features Panel */}
//       <div className={`
//         fixed md:static inset-0 z-40
//         w-72 bg-white border-r border-gray-200
//         transform transition-transform duration-300 ease-in-out
//         ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
//         md:translate-x-0
//       `}>
//         <h2 className="p-4 text-2xl font-bold">Features Panel</h2>
//         <div className="space-y-px">
//           {features.map(feature => (
//             <button
//               key={feature.id}
//               onClick={() => {
//                 state.activeFeature = feature.id
//                 setIsMobileMenuOpen(false)
//               }}
//               className={`flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 ${
//                 snap.activeFeature === feature.id ? 'text-green-500' : ''
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <feature.icon className={`w-5 h-5 ${snap.activeFeature === feature.id ? 'text-green-500' : ''}`} />
//                 <span>{feature.label}</span>
//               </div>
//               <span>›</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* T-Shirt Preview */}
//       <div className="flex-1 flex flex-col">
//         <h1 className="p-4 text-2xl font-bold text-center border-b">T-Shirt Sample</h1>
//         <div className="flex-1 relative">
//           {snap.isLoading && (
//             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-4 rounded-md shadow-lg">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                 <p className="mt-2 text-sm text-gray-600">Loading...</p>
//               </div>
//             </div>
//           )}
//           <div className="w-full h-full aspect-square md:aspect-video">
//             <ShirtCanvas />
//           </div>
//         </div>
//       </div>

//       {/* Customization Panel */}
//       <div className={`
//         fixed md:static inset-0 z-40
//         w-80 bg-white border-l border-gray-200
//         transform transition-transform duration-300 ease-in-out
//         ${snap.activeFeature && isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
//         md:translate-x-0
//       `}>
//         <h2 className="p-4 text-2xl font-bold">Customization Panel</h2>
//         <div className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
//           {snap.activeFeature === 'logo' && (
//             <div className="space-y-6">
//               <h3 className="text-xl">Logo Customization</h3>
//               <input
//                 type="file"
//                 ref={logoInputRef}
//                 onChange={handleLogoUpload}
//                 className="hidden"
//                 accept="image/*"
//               />
//               <button
//                 onClick={() => logoInputRef.current?.click()}
//                 className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
//               >
//                 <Upload className="w-8 h-8 text-gray-400" />
//                 <span className="text-gray-500">Click to upload</span>
//               </button>

//               <div className="space-y-6">
//                 {Object.entries(logoPositions).map(([group, positions]) => (
//                   <div key={group}>
//                     <h4 className="font-medium mb-2">{group}</h4>
//                     <div className="grid grid-cols-3 gap-2">
//                       {positions.map(({ position, marker, label }) => (
//                         <button
//                           key={`${position}-${marker}`}
//                           onClick={() => {
//                             state.logoPosition = marker
//                             state.logoSide = position
//                           }}
//                           className="text-center"
//                         >
//                           <ShirtThumbnail
//                             position={position}
//                             markerPosition={marker}
//                             selected={snap.logoPosition === marker && snap.logoSide === position}
//                           />
//                           <span className="text-xs mt-1 block">{label}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {snap.activeFeature === 'text' && (
//             <div className="space-y-4">
//               <h3 className="text-xl">Text Customization</h3>
//               <div className="border rounded-lg p-4">
//                 <h4 className="text-sm font-medium mb-2">Text Layers</h4>
//                 <div className="bg-gray-50 rounded p-3 text-center text-gray-500">
//                   No layer is present
//                 </div>
//                 <button className="mt-4 w-10 h-10 rounded border-2 flex items-center justify-center">
//                   <span className="text-2xl">+</span>
//                 </button>
//               </div>
//             </div>
//           )}

//           {snap.activeFeature === 'color' && (
//             <div className="space-y-4">
//               <h3 className="text-xl">Color Customization</h3>
//               <div>
//                 <h4 className="text-sm mb-2">Background Color portion</h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   <button className="px-4 py-2 bg-green-500 text-white rounded-md">
//                     Full variant color
//                   </button>
//                   <button className="px-4 py-2 border border-gray-300 rounded-md">
//                     Front & Back color
//                   </button>
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-sm mb-2">Full body color</h4>
//                 <input
//                   type="color"
//                   value={snap.color}
//                   onChange={(e) => state.color = e.target.value}
//                   className="w-full h-40 cursor-pointer"
//                 />
//               </div>
//             </div>
//           )}

//           {snap.activeFeature === 'texture' && (
//             <div className="space-y-4">
//               <h3 className="text-xl">Texture Customization</h3>
//               <div>
//                 <h4 className="text-sm mb-2">Texture portion</h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   <button className="px-4 py-2 bg-green-500 text-white rounded-md">
//                     Full body texture
//                   </button>
//                   <button className="px-4 py-2 border border-gray-300 rounded-md">
//                     Front & Back texture
//                   </button>
//                 </div>
//               </div>
//               <div className="grid grid-cols-3 gap-2">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                   <div key={i} className="aspect-square rounded-full border-2 bg-gray-100"></div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {snap.activeFeature === 'finish' && (
//             <div className="space-y-4">
//               <h3 className="text-xl">Finsih Desiging</h3>
//               <div className="text-center">
//                 <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-lg"></div>
//                 <button className="w-full px-4 py-2 bg-green-500 text-white rounded-md">
//                   Submit Editing
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// function ErrorFallback({ error, resetErrorBoundary }) {
//   return (
//     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//       <h2 className="text-xl font-bold text-red-600 mb-4">Error loading 3D content</h2>
//       <p className="text-gray-600 mb-4">{error.message}</p>
//       <button
//         onClick={resetErrorBoundary}
//         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//       >
//         Try again
//       </button>
//     </div>
//   )
// }

// useGLTF.preload('/shirt_baked_collapsed.glb')
// ;['/react.png', '/three2.png', '/pmndrs.png', '/placeholder.png'].forEach(useTexture.preload)



