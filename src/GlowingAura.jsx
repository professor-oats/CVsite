import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AuraGlow = ({ innerRadius, outerRadius }) => {
  const particlesRef = useRef();
  const [positions] = useState(() => {
    const posArray = [];  // Construct an array to hold the particles
    const particleCount = 500;
    for (let i = 0; i < particleCount; i++) {
      const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius);  // Set boundaries
      // by defining the min and max values for the randFloat radius in where to push a particle
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);

      // Random particle positions within a spherical volume
      posArray.push(radius * Math.sin(phi) * Math.cos(theta));
      posArray.push(radius * Math.sin(phi) * Math.sin(theta));
      posArray.push(radius * Math.cos(phi));
    }
    return new Float32Array(posArray);  // Send the array to buffer
  });

  // Create particle velocity to animate their movement
  const [velocities] = useState(() => {
    const velocityArray = [];
    const particleCount = 500;
    for (let i = 0; i < particleCount; i++) {
      // Random velocity in each direction (x, y, z)
      velocityArray.push(THREE.MathUtils.randFloat(-0.001, 0.001));
      velocityArray.push(THREE.MathUtils.randFloat(-0.001, 0.001));
      velocityArray.push(THREE.MathUtils.randFloat(-0.001, 0.001));
    }
    return new Float32Array(velocityArray);
  });

  // Use useFrame to animate the particles
  useFrame(() => {
    const positionsArray = particlesRef.current.geometry.attributes.position.array;
    const velocitiesArray = velocities;

    for (let i = 0; i < positionsArray.length; i += 3) {
      positionsArray[i] += velocitiesArray[i];  // Let the values of velocity stored in
      // our velocity array be applied to the positions on frame
      positionsArray[i + 1] += velocitiesArray[i + 1];
      positionsArray[i + 2] += velocitiesArray[i + 2];

      // If a particle reaches the outer radius, reset it to the inner radius
      const distance = Math.sqrt(
        positionsArray[i] ** 2 + positionsArray[i + 1] ** 2 + positionsArray[i + 2] ** 2
      );
      if (distance > outerRadius) {
        const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
        const phi = THREE.MathUtils.randFloat(0, Math.PI);
        const newRadius = THREE.MathUtils.randFloat(innerRadius, outerRadius);
        positionsArray[i] = newRadius * Math.sin(phi) * Math.cos(theta);
        positionsArray[i + 1] = newRadius * Math.sin(phi) * Math.sin(theta);
        positionsArray[i + 2] = newRadius * Math.cos(phi);
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true; // Update particle positions
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}  // This is the separator calc to let THREE know
          // the total length of the Float32Array since we then set the itemSize to 3 when stepping the
          // data to render on each position in the array buffer with array={positions}
          array={positions} // This is the actual data array that contains the particle positions.
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05} // Size of each particle
        color={new THREE.Color(0x5887f5)}
        roughness={0}
        emissive={new THREE.Color(0x5887f5)} // Make emissive for glow
        emissiveIntensity={0} // Intensity of glow
        transparent={false} // Set transparency true or false, go with false so far
      />
    </points>
  );
};

export default AuraGlow;