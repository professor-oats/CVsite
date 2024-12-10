import * as THREE from 'three';
import { useTextures } from './TextureContext'

const ArcSpine = () => {
  const spineShape = new THREE.Shape();
  const textures = useTextures();

  // Create a semi-circle for the outer edge
  spineShape.absarc(0, 0, 0.15, Math.PI / 2 + 0, Math.PI * 3 / 2, false);

  // Create a smaller semi-circle for the inner edge
  const holePath = new THREE.Path();
  holePath.absarc(0, 0, 0.08, Math.PI / 2, Math.PI * 3 / 2, false);

  // Subtract the inner from the outer to create a hollow shape
  spineShape.holes.push(holePath);

  // Extrude the shape into 3D
  const extrudeSettings = {
    depth: 1.5, // Thickness along the Z-axis
    bevelEnabled: false,
    steps: 10
  };

  return (
    <mesh>
      <extrudeGeometry args={[spineShape, extrudeSettings]} />
      <meshStandardMaterial
        color="#2d194d"
        normalMap={textures.normalLeather}
        diffuseMap={textures.diffuseLeather}
        roughness={0.6}
      />
    </mesh>
  );
};

export default ArcSpine;