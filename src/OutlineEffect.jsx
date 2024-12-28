import * as THREE from 'three';

const OutlineEffect = ({ objectRef, color = "red", scaleMultiplier = 1.05 }) => {
  return (
    objectRef?.current && (
      <mesh
        geometry={objectRef.current.geometry}
        scale={[
          scaleMultiplier,
          scaleMultiplier,
          scaleMultiplier
        ]}
        position={objectRef.current.position}
        rotation={objectRef.current.rotation}
        layers={objectRef.current.layers} // Ensure it follows the same layers (if used)
      >
        <meshBasicMaterial
          color={color}
          transparent={true}
          opacity={0.7}
          side={THREE.BackSide} // Render only the back side for the outline effect
          //depthTest={true} // Enable depth testing so the outline respects the depth buffer
          //depthWrite={false} // Don't write to the depth buffer, so it won't overwrite the cover meshes
          blending={THREE.AdditiveBlending} // Make the outline glow a bit
        />
      </mesh>
    )
  );
};

export default OutlineEffect;

