import React, { useState, useRef, Suspense, useEffect, forwardRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  useGLTF, 
  useTexture, 
  Environment, 
  Center, 
  AccumulativeShadows,
  RandomizedLight,
  Decal,
  OrbitControls
} from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { proxy } from 'valtio'
import { Upload, Type, Palette, FileIcon, Rocket } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { ShirtThumbnail } from '../components/shirt-thumbnail'
import * as THREE from 'three'
import bluecheck from '../assets/blue-check-texture.jpg'
import reddotted from '../assets/red-dotted-texture.jpeg'
import whiteline from '../assets/white-lines-texture.jpeg'
import linetexture from '../assets/lines-texture.jpeg'
import greyshirttexture from '../assets/grey-shirt-texture.jpeg'
import coattexture from '../assets/coat-texture.jpeg'
import checktexture from '../assets/check-texture.jpg'
import { saveAs } from 'file-saver'

const state = proxy({
  shirtColor: '#FFFFFF',
  isFullVariant: true,
  logoDecal: 'three2',
  logoPosition: 'center',
  logoSide: 'front',
  backgroundColor: '#ffffff',
  isLoading: false,
  error: null,
  activeFeature: 'logo',
  textLayers: [{
    id: 1,
    text: 'Sample',
    position: { x: 0, y: 0, z: 0.15 },
    fontSize: 100,
    fontWeight: 300,
    fontFamily: 'Arial',
    color: '#00FF00',
    side: 'front'
  }],
  activeTextLayer: 0,
  isFullTexture: true,
  shirtTexture: null,
  selectedTexture: null,
  isExporting: false,
  exportProgress: 0,
  cameraRotation: 0,
})

const LOGO_POSITIONS = {
  'front-full': [0, 0.04, 0.15],
  'front-center': [0, 0.04, 0.15],
  'front-across': [0, 0.1, 0.15],
  'front-left': [-0.15, 0.04, 0.15],
  'front-right': [0.15, 0.04, 0.15],
  'front-left-sleeve': [-0.26, 0.15, 0.1],
  'front-right-sleeve': [0.26, 0.15, 0.1],
  'back-full': [0, 0.04, -0.15],
  'back-center': [0, 0.04, -0.15],
  'back-across': [0, 0.1, -0.15],
  'back-left': [-0.15, 0.04, -0.15],
  'back-right': [0.15, 0.04, -0.15]
}

const LOGO_SCALES = {
  full: 0.25,
  center: 0.15,
  across: [0.3, 0.1, 1],
  left: 0.12,
  right: 0.12,
  'left-sleeve': 0.08,
  'right-sleeve': 0.08
}

const TEXTURES = [
  { id: 'none', name: 'No Texture', src: null },
  { id: 'plaid-blue', name: 'Blue Plaid', src: bluecheck },
  { id: 'white-line', name: 'White Line Texture', src: whiteline },
  { id: 'line', name: 'Line Texture', src: linetexture },
  { id: 'gray', name: 'Gray Shirt Texture', src: greyshirttexture },
  { id: 'coat', name: 'Coat Texture', src: coattexture },
  { id: 'red dotted', name: 'Solid Red', src: reddotted },
  { id: 'check', name: 'Check Shirt Texture', src:checktexture },
  { id: 'custom', name: 'Custom Texture', src: null },
]

function TextDecal({ layer }) {
  const canvasRef = useRef()
  const textureRef = useRef()

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = 512
    canvas.height = 512

    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = layer.color
    ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(layer.text, canvas.width / 2, canvas.height / 2)

    if (textureRef.current) {
      textureRef.current.dispose()
    }
    textureRef.current = new THREE.CanvasTexture(canvas)
    textureRef.current.needsUpdate = true

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose()
      }
    }
  }, [layer])

  return textureRef.current ? (
    <Decal 
      position={[layer.position.x, layer.position.y, layer.position.z]}
      rotation={[0, layer.side === 'back' ? Math.PI : 0, 0]}
      scale={0.15}
      map={textureRef.current}
    />
  ) : null
}

function Shirt() {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF('/shirt_baked_collapsed.glb')
  const logoTexture = useTexture(snap.logoDecal ? `/${snap.logoDecal}.png` : '/placeholder.png')
  
  const shirtTextureMap = useTexture(snap.shirtTexture || '/placeholder.png')
  
  const shirtMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: snap.shirtColor,
      roughness: 0.4,
      metalness: 0.1,
      map: snap.isFullTexture ? shirtTextureMap : null,
    });
    return material;
  }, [snap.shirtColor, snap.isFullTexture, shirtTextureMap]);

  useEffect(() => {
    shirtMaterial.color.set(snap.shirtColor)
    shirtMaterial.map = snap.shirtTexture ? shirtTextureMap : null
    shirtMaterial.needsUpdate = true
  }, [snap.shirtColor, snap.shirtTexture, snap.isFullTexture, shirtMaterial, shirtTextureMap])

  return (
    <group>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={shirtMaterial}
        dispose={null}
      >
        {snap.logoDecal && (
          <Decal 
            position={LOGO_POSITIONS[`${snap.logoSide}-${snap.logoPosition}`] || [0, 0.04, 0.15]}
            rotation={[0, snap.logoSide === 'back' ? Math.PI : 0, 0]}
            scale={typeof LOGO_SCALES[snap.logoPosition] === 'number' 
              ? Array(3).fill(LOGO_SCALES[snap.logoPosition])
              : LOGO_SCALES[snap.logoPosition]}
            map={logoTexture}
          />
        )}
        {snap.textLayers.map((layer, index) => (
          <TextDecal key={layer.id} layer={layer} />
        ))}
      </mesh>
    </group>
  )
}

function CameraRig({ children }) {
  const { camera } = useThree()
  const snap = useSnapshot(state)

  useFrame(() => {
    if (state.isExporting) {
      const radius = 2.5
      camera.position.x = Math.sin(snap.cameraRotation) * radius
      camera.position.z = Math.cos(snap.cameraRotation) * radius
      camera.position.y = 0.5 // Slightly elevated view
      camera.lookAt(0, 0, 0)
    }
  })

  return <group>{children}</group>
}

function Backdrop() {
  return (
    <mesh receiveShadow position={[0, 0, -0.5]} scale={[100, 100, 1]}>
      <planeGeometry />
      <meshStandardMaterial color="#f0f0f0" /> {/* Light gray background */}
    </mesh>
  )
}

const ShirtCanvas = forwardRef((props, ref) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Canvas
        ref={ref}
        shadows
        camera={{ position: [0, 0, 2.5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        className="w-full h-full min-h-[400px] aspect-square md:aspect-video"
        onCreated={({ gl }) => {
          gl.domElement.setAttribute('willReadFrequently', 'true');
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
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
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  )
})

function ColorCustomizationPanel() {
  const snap = useSnapshot(state)

  return (
    <div className="space-y-4">
      <h3 className="text-xl">Color Customization</h3>
      
      <div>
        <h4 className="text-sm mb-2">Shirt Color</h4>
        <input
          type="color"
          value={snap.shirtColor}
          onChange={(e) => {
            state.shirtColor = e.target.value
          }}
          className="w-full h-40 cursor-pointer"
        />
      </div>
    </div>
  )
}

function TextCustomizationPanel() {
  const snap = useSnapshot(state)
  const activeLayer = snap.textLayers[snap.activeTextLayer]

  const updateLayer = (updates) => {
    state.textLayers[snap.activeTextLayer] = {
      ...state.textLayers[snap.activeTextLayer],
      ...updates
    }
  }

  const moveText = (direction) => {
    const position = { ...activeLayer.position }
    const step = 0.02

    switch (direction) {
      case 'up':
        position.y += step
        break
      case 'down':
        position.y -= step
        break
      case 'left':
        position.x -= step
        break
      case 'right':
        position.x += step
        break
    }

    updateLayer({ position })
  }

  const addNewLayer = () => {
    const newLayer = {
      id: Date.now(),
      text: 'New Text',
      position: { x: 0, y: 0.04, z: 0.15 },
      fontSize: 100,
      fontWeight: 300,
      fontFamily: 'Arial',
      color: '#000000',
      side: 'front'
    }
    state.textLayers.push(newLayer)
    state.activeTextLayer = state.textLayers.length - 1
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl">Text Customization</h3>
      
      <div className="border rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2 dark:text-white dark:bg-gray-900">Text Layers</h4>
        <div className="space-y-2">
          {snap.textLayers.map((layer, index) => (
            <div 
              key={layer.id}
              className={`p-2 border rounded flex items-center justify-between ${
                index === snap.activeTextLayer ? 'border-green-500 bg-green-50' : ''
              }`}
              onClick={() => state.activeTextLayer = index}
            >
              <span className="truncate dark:text-black">{layer.text}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  state.textLayers = state.textLayers.filter((_, i) => i !== index)
                  if (snap.activeTextLayer >= index) {
                    state.activeTextLayer = Math.max(0, snap.activeTextLayer - 1)
                  }
                }}
                className="text-red-500 hover:text-red-700 "
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={addNewLayer}
          className="mt-2 w-full p-2 border-2 border-dashed rounded hover:bg-gray-50 dark:hover:bg-gray-500 dark:hover:text-white"
        >
          + Add Text Layer
        </button>
      </div>

      {activeLayer && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Text</label>
            <input
              type="text"
              value={activeLayer.text}
              onChange={(e) => updateLayer({ text: e.target.value })}
              className="w-full p-2 border rounded dark:text-white dark:bg-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Text Position</label>
            <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
              <button onClick={() => moveText('up')} className="p-2 border rounded">↑</button>
              <button onClick={() => moveText('down')} className="p-2 border rounded">↓</button>
              <button onClick={() => moveText('left')} className="p-2 border rounded">←</button>
              <button onClick={() => moveText('right')} className="p-2 border rounded">→</button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium ">Font Size</label>
              <input
                type="number"
                value={activeLayer.fontSize}
                onChange={(e) => updateLayer({ fontSize: parseInt(e.target.value) })}
                className="w-full p-2 border rounded dark:text-white dark:bg-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Font Weight</label>
              <select
                value={activeLayer.fontWeight}
                onChange={(e) => updateLayer({ fontWeight: parseInt(e.target.value) })}
                className="w-full p-2 border rounded dark:text-white dark:bg-gray-900"
              >
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="700">Bold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Font Family</label>
              <select
                value={activeLayer.fontFamily}
                onChange={(e) => updateLayer({ fontFamily: e.target.value })}
                className="w-full p-2 border rounded dark:text-white dark:bg-gray-900"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium ">Font Color</label>
              <input
                type="color"
                value={activeLayer.color}
                onChange={(e) => updateLayer({ color: e.target.value })}
                className="w-full h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium ">Side</label>
              <select
                value={activeLayer.side}
                onChange={(e) => updateLayer({ 
                  side: e.target.value,
                  position: {
                    ...activeLayer.position,
                    z: e.target.value === 'back' ? -0.15 : 0.15
                  }
                })}
                className="w-full p-2 border rounded dark:text-white dark:bg-gray-900"
              >
                <option value="front">Front</option>
                <option value="back">Back</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

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

function TextureCustomizationPanel() {
  const snap = useSnapshot(state)
  const textureInputRef = useRef(null)

  const handleTextureUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      state.isLoading = true
      state.error = null
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }
      
      if (file.size > 1024 * 1024) {
        throw new Error('Image size should be less than 1MB')
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        state.shirtTexture = e.target.result
      }
      reader.readAsDataURL(file)
    } catch (error) {
      state.error = error.message
      console.error('Error uploading texture:', error)
    } finally {
      state.isLoading = false
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl">Texture Customization</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {TEXTURES.map((texture) => (
          <button
            key={texture.id}
            onClick={() => {
              if (texture.id === 'custom') {
                textureInputRef.current?.click()
                return
              }
              
              state.shirtTexture = texture.src
            }}
            className={`aspect-square rounded-lg border-2 overflow-hidden ${
              snap.shirtTexture === texture.src
                ? 'border-green-500'
                : 'border-gray-200'
            }`}
          >
            {texture.id === 'none' ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ) : texture.id === 'custom' ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            ) : (
              <img 
                src={texture.src} 
                alt={texture.name}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* <input
        type="file"
        ref={textureInputRef}
        onChange={handleTextureUpload}
        className="hidden"
        accept="image/*"
      /> */}
    </div>
  )
}

function FinishDesigningPanel() {
  const snap = useSnapshot(state)
  const canvasRef = useRef()

  const exportAsImage = async () => {
    if (!canvasRef.current) return

    try {
      const canvas = canvasRef.current
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'shirt-design.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error exporting image:', error)
    }
  }

  const exportAsVideo = async () => {
    if (!canvasRef.current) return

    try {
      state.isExporting = true
      state.exportProgress = 0

      const canvas = canvasRef.current
      const stream = canvas.captureStream(80) 
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: 8000000 
      })

      const chunks = []
      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        saveAs(blob, 'shirt-design-360.webm')
        state.isExporting = false
        state.exportProgress = 0
      }

      recorder.start()

      const totalFrames = 180
      for (let i = 0; i < totalFrames; i++) {
        state.cameraRotation = (i / totalFrames) * Math.PI * 2
        await new Promise(resolve => requestAnimationFrame(resolve))
        state.exportProgress = (i + 1) / totalFrames
      }

      state.cameraRotation = 0
      recorder.stop()

    } catch (error) {
      console.error('Error exporting video:', error)
      state.isExporting = false
      state.exportProgress = 0
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl">Finish Designing</h3>
      <div className="text-center">
        <div className="w-48 h-48 mx-auto mb-4 dark:bg-gray-900 rounded-lg overflow-hidden">
          <ShirtCanvas ref={canvasRef} />
        </div>
        <div className="space-y-2">
          <button 
            onClick={exportAsImage}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Export as Image
          </button>
          <button 
            onClick={exportAsVideo}
            disabled={snap.isExporting}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:bg-gray-400"
          >
            {snap.isExporting ? 'Exporting...' : 'Export as 360° Video'}
          </button>
        </div>
        {snap.isExporting && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${snap.exportProgress * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Exporting: {Math.round(snap.exportProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DesignTool() {
  const snap = useSnapshot(state)
  const logoInputRef = useRef(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      state.isLoading = true
      state.error = null
      
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

  const features = [
    { id: 'logo', icon: Upload, label: 'Logo' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'color', icon: Palette, label: 'Color' },
    { id: 'texture', icon: FileIcon, label: 'Texture' },
    { id: 'finish', icon: Rocket, label: 'Finish' }
  ]

  const logoPositions = {
    'Front Side': [
      { position: 'front', marker: 'full', label: 'Full Front' },
      { position: 'front', marker: 'center', label: 'Center Chest' },
      { position: 'front', marker: 'across', label: 'Across Chest' }
    ],
    'Side': [
      { position: 'front', marker: 'left', label: 'Left Side' },
      { position: 'front', marker: 'right', label: 'Right Side' }
    ],
    'Back Side': [
      { position: 'back', marker: 'full', label: 'Full Back' },
      { position: 'back', marker: 'center', label: 'Center Back' },
      { position: 'back', marker: 'across', label: 'Across Back' }
    ]
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen dark:bg-gray-900">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-32 left-14 z-50 p-2 bg-white rounded-md shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Mobile customization panel toggle */}
      <button 
        className="md:hidden fixed top-32 right-4 z-50 p-2 bg-white rounded-md shadow-lg"
        onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {/* Features panel */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 mt-16 dark:bg-gray-900 dark:text-white
        w-30 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <h2 className="p-4 text-2xl font-bold">Features</h2>
        <div className="flex flex-col">
          {features.map(feature => (
            <button
              key={feature.id}
              onClick={() => {
                state.activeFeature = feature.id;
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center  md:justify-start w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-black ${
                snap.activeFeature === feature.id ? 'text-green-500' : ''
              }`}
            >
              <feature.icon className={`w-5 h-5 ${snap.activeFeature === feature.id ? 'text-green-500' : ''}`} />
              <span className="hidden md:inline ml-3">{feature.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col dark:text-white dark:bg-gray-900">
        <h1 className="p-4 text-2xl font-bold text-center border-b">T-Shirt Sample</h1>
        <div className="flex-1 relative">
          {snap.isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}
          <div className="w-full h-full aspect-square md:aspect-video">
            <ShirtCanvas />
          </div>
        </div>
      </div>

      {/* Customization panel */}
      <div className={`
        fixed md:static inset-y-0 right-0 z-40 mt-16 dark:bg-gray-900 dark:text-white
        w-80 bg-white border-l border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isCustomizationOpen ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0
      `}>
        <h2 className="p-4 text-2xl font-bold">Customization</h2>
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {snap.activeFeature === 'logo' && (
            <div className="space-y-6">
              <h3 className="text-xl">Logo Customization</h3>
              {/* <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-gray-500">Click to upload</span>
              </button> */}

              <div className="space-y-6">
                {Object.entries(logoPositions).map(([group, positions]) => (
                  <div key={group}>
                    <h4 className="font-medium mb-2">{group}</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {positions.map(({ position, marker, label }) => (
                        <button
                          key={`${position}-${marker}`}
                          onClick={() => {
                            state.logoPosition = marker
                            state.logoSide = position
                          }}
                          className="text-center"
                        >
                          <ShirtThumbnail
                            position={position}
                            markerPosition={marker}
                            selected={snap.logoPosition === marker && snap.logoSide === position}
                          />
                          <span className="text-xs mt-1 block">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {snap.activeFeature === 'text' && <TextCustomizationPanel />}
          {snap.activeFeature === 'color' && <ColorCustomizationPanel />}
          {snap.activeFeature === 'texture' && <TextureCustomizationPanel />}
          {snap.activeFeature === 'finish' && <FinishDesigningPanel />}
        </div>
      </div>
    </div>
  )
}

useGLTF.preload('/shirt_baked_collapsed.glb')
;['/react.png', '/three2.png', '/pmndrs.png', '/placeholder.png', '/textures/plaidpng','/textures/plaid-blue.png', '/textures/plaid-red.png', '/textures/knit.png', '/textures/gray.png', '/textures/plaid-red.png', '/textures/knit.png', '/textures/gray.png', '/textures/stripes.png', '/textures/red.png','/textures/cream.png'].forEach(useTexture.preload)

