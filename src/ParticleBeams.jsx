import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleBeams = ({innerRadius=1, outerRadius=2}) => {
  // Initialize positions and velocities
  const particlesRef = useRef();
  const beamCount = 10; // Number of beams
  const particlesPerBeam = 100; // Number of particles per beam
  const positions = new Float32Array(beamCount * particlesPerBeam * 3); // 3 components per particle (x, y, z)
  const velocities = new Float32Array(beamCount * particlesPerBeam * 3);

  let index = 0;
  for (let b = 0; b < beamCount; b++) {
    const angle = (b / beamCount) * Math.PI * 2; // Spread beams evenly around the circle
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);

    for (let p = 0; p < particlesPerBeam; p++) {
      const t = p / particlesPerBeam; // Progress along the beam (0 to 1)
      const radius = innerRadius + t * (outerRadius - innerRadius);

      const offsetX = (Math.random() - 0.5) * 0.1; // Randomness for position
      const offsetZ = (Math.random() - 0.5) * 0.1;

      // Set positions - - - Tinker these values to gain the beam look that we want
      // To gain a more authentic glow experience we would like to have a wider spread
      // In the start of the t value and also a higher particle density there for balance
      // We also want to manage the particle size and velocity to start gaining actual light beams

      positions[index] = radius * dirX + offsetX;   // x
      positions[index + 1] = (Math.random() - 0.5) * 0.1; // y
      positions[index + 2] = radius * dirZ + offsetZ;   // z

      // Set velocities
      const velocityScale = 0.1;
      velocities[index] = dirX * velocityScale;   // vx
      velocities[index + 1] = 0;                 // vy
      velocities[index + 2] = dirZ * velocityScale;   // vz

      index += 3;
    }
  }

  useFrame(() => {
    const timeStep = 0.01; // Adjust time step for smooth movement

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += velocities[i * 3] * timeStep;     // X
      positions[i * 3 + 1] += velocities[i * 3 + 1] * timeStep; // Y
      positions[i * 3 + 2] += velocities[i * 3 + 2] * timeStep; // Z

      // Reset if particle exceeds outer radius
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const distance = Math.sqrt(x * x + y * y + z * z);

      if (distance > outerRadius) {
        const angle = Math.atan2(z, x);
        const dirX = Math.cos(angle);
        const dirZ = Math.sin(angle);

        positions[i * 3] = innerRadius * dirX;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // Reset Y
        positions[i * 3 + 2] = innerRadius * dirZ;
      }
    }

    // Notify the buffer geometry of the position updates
    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

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
        size={0.01} // Size of each particle
        color={new THREE.Color(0xffffff)}
        roughness={0}
        transparent={false} // Set transparency true or false, go with false so far
      />
    </points>
  );
};

export default ParticleBeams;