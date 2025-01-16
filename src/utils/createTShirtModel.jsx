import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

function createTShirtModel() {
  const scene = new THREE.Scene()

  // Create a basic t-shirt shape
  const geometry = new THREE.BoxGeometry(1, 1.2, 0.2)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const tshirt = new THREE.Mesh(geometry, material)
  scene.add(tshirt)

  // Add sleeves
  const sleeveGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.2)
  const leftSleeve = new THREE.Mesh(sleeveGeometry, material)
  leftSleeve.position.set(-0.65, 0.1, 0)
  scene.add(leftSleeve)

  const rightSleeve = new THREE.Mesh(sleeveGeometry, material)
  rightSleeve.position.set(0.65, 0.1, 0)
  scene.add(rightSleeve)

  // Export the scene
  const exporter = new GLTFExporter()
  exporter.parse(
    scene,
    function (gltf) {
      const output = JSON.stringify(gltf, null, 2)
      console.log(output)
      // You would typically save this output to a file named 'tshirt.glb'
    },
    { binary: true }
  )
}

createTShirtModel()

