import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from 'three';

// Shader time bby - Fuzzy outline shader
// This will be the last over the top anim I will test out before
// going into the main animations. Takes time to pass the time correctly (ironic)
// and we are really hitting the wall here.

const fuzzyOutlineShader = {
  uniforms: {
    color: { value: new THREE.Color("red") },
    opacity: { value: 0.1 },
    time: { value: 0.2 },
  },
  vertexShader: `
    varying vec3 vPosition;
    uniform float time;

    void main() {
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float opacity;
    uniform float time;
    varying vec3 vPosition;

    void main() {
      // Create a "fuzzy" effect by distorting the edges based on the distance from the center
      float dist = length(vPosition.xy * 1.5);
      
      // Apply a gradient to create the fuzziness effect
      //float edgeEffect = smoothstep(0.7, 1.2, dist + sin(time * 0.4) * 10.0);
      float edgeEffect = smoothstep(0.5 + sin(0.1 * time) * 0.5, 1.0, dist); // Modify the edge threshold with time oscillation

      gl_FragColor = vec4(color, opacity * edgeEffect);
    }
  `
};

const OutlineEffect = ({ objectRef, color = "red", scaleMultiplier = 1.25, time }) => {
  const materialRef = useRef();


  // Memoize the uniforms to avoid recreating them on each render
  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(color) },
    opacity: { value: 0.4 },
    time: { value: 0.0 }, // Initial value
  }), []); // Static; does not depend on `time`

  // Dynamically update the shader material's uniforms
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time;
      console.log(materialRef.current.uniforms.time.value);
    }
  }, [time]);

  return (
    objectRef?.current && (
      <mesh
        geometry={objectRef.current.geometry}
        scale={[
          scaleMultiplier,
          scaleMultiplier,
          scaleMultiplier
        ]}
        // We will need to offset the position.z to get mid pos
        position={[objectRef.current.position.x, objectRef.current.position.y, objectRef.current.position.z + 0.5]}
        rotation={objectRef.current.rotation}
        layers={objectRef.current.layers} // Ensure it follows the same layers (if used)
      >
        <shaderMaterial
          ref={materialRef} // Attach ref to update uniforms dynamically
          uniforms={uniforms} // Pass the memoized uniforms object
          vertexShader={fuzzyOutlineShader.vertexShader}
          fragmentShader={fuzzyOutlineShader.fragmentShader}
          transparent={true}
          side={THREE.BackSide} // Render the back side to simulate the outline
        />
      </mesh>
    )
  );
};

export default OutlineEffect;

