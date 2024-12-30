import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from 'three';

// Shader time bby - Fuzzy outline shader
// This will be the last over the top anim I will test out before
// going into the main animations. Takes time to pass the time correctly (ironic)
// and we are really hitting the wall here.

// I will try to performance optimise as far as possible, but I think
// we start to pass the threshold for older machines now

const fuzzyOutlineShader = {
  uniforms: {
    color: { value: new THREE.Color("red") },
    opacity: { value: 0.1 },
    time: { value: 0.0 },
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
      //float dist = length(vPosition.xy * 1.5); //- Radial shrink and growth
      
        // Transform vPosition into normalized coordinates for box geometry
      vec3 normalizedPosition = abs(vPosition); // Use absolute value for symmetry
      float maxCoord = max(max(normalizedPosition.x, normalizedPosition.y), normalizedPosition.z);

      // Apply an effect based on maxCoord to outline the box edges
      float edgeEffect = 0.5 + 0.5 * sin(15.0 * maxCoord - time * 1.0); // Frequency and speed of ripple
      // edgeEffect = smoothstep(0.4, 0.6, edgeEffect); // - If sharpening wanted
      
      
      // Edge fuzziness: fade opacity near the edges
      float edgeFuzz = smoothstep(0.5, 0.1, maxCoord); // Fade out as dist approaches 1.0 (edge)

      // Combine ripple and fuzziness
      float finalOpacity = opacity * edgeEffect * edgeFuzz;

      // Output the final color with applied opacity
      gl_FragColor = vec4(color, finalOpacity);
    }
  `
};

// Increase the scaleMultiplier later on on hover
const OutlineEffect = ({ objectRef, color = "red", scaleMultiplier = 1.2, time }) => {
  const materialRef = useRef();


  // Memoize the uniforms to avoid recreating them on each render
  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(color) },
    opacity: { value: 0.7 },
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
          scaleMultiplier + 0.30,
          scaleMultiplier + 0.6,
          scaleMultiplier
        ]}
        // We will need to offset the position.z to get mid pos
        position={[objectRef.current.position.x, objectRef.current.position.y - 0.014, objectRef.current.position.z - 0.1]}
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

