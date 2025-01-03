import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animated, useSpring } from "@react-spring/three";
import { Noise } from "noisejs";

// Initialize positions and velocities
const ParticleBeams = ({innerRadius=1, outerRadius=2}) => {
  const particlesRef = useRef();
  const beamCount = 12; // Number of beams
  const particlesPerBeam = 20; // Number of particles per beam
  const positions = new Float32Array(beamCount * particlesPerBeam * 3); // 3 components per particle (x, y, z)
  const velocities = new Float32Array(beamCount * particlesPerBeam * 3);
  const noise = new Noise(Math.random());
  let radius = 1;
  let offsetX = 0.1;
  let offsetZ = 0.1;

  const beamSpring = useSpring({
    rotation: [-Math.PI / 2, -Math.PI * 0.2, Math.PI / 22], // Rotation: x (tilt), y (45°), z
    position: [0.26, 0.12, -0.2],  // Slight fronting of the anim
    config: { duration: 0 }, // Static, no animation
  });

  // Update: Ugliest particle system I have made, also the first ...
  // But we will cheat with camera angle, Tinder style

  // INITIALIZE PARTICLES

  let index = 0;
  for (let b = 0; b < beamCount; b++) {
    const angle = (b / beamCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.1; // Spread beams evenly around the circle
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);

    for (let p = 0; p < particlesPerBeam; p++) {
      const t = p / particlesPerBeam; // Progress along the beam (0 to 1)
      radius = innerRadius + t * (outerRadius - innerRadius);  // linear interpolation
      const noiseX = noise.perlin3(dirX * 0.01, angle * 0.01, radius * 0.002);
      const noiseZ = noise.perlin3(dirZ * 0.01, angle * 0.01, radius * 0.002);
      // classic P(t) = origin + t * vdir
      // Current implementation only uses a scalar as (outerRadius - innerRadius)
      // To gain some spherical spread we can turn this into vectors and generate an
      // offset to the positions

      // GET BUSY: To gain foundation for lighting beams we should assign a
      // smaller circular boundary, at innerRadius, for where the particles can take place
      // and a wider circular boundary at the outerRadius and then have them
      // translate over the radial space, we may want to add an offsetY too,
      // we'll play a little

      // Update:
      // We didn't use this bound at all, we just plebbed through randomness everywhere

      // Seems like this Math.random here can be played with to generate different flow
      // behaviour - - - default: - 0.5, generally it affects the perceived spread
      // which is good to know
      offsetX = (Math.random() - 0.5) * 0.1; // Init pos offset, affects initial beams width
      offsetZ = (Math.random() - 0.5) * 0.1;

      // NOTE: WE SHOULD actually go through the initialization since the look of it differs
      // very much from the useFrame() update, however, looks kind of cool so we can settle for now
      // took some time to differentiate between the initiliazation vs. update on frame
      // for some reason I thought the init values and it's functions persisted ... brain rot skibidi

      // Set positions - - - Tinker these values to gain the beam look that we want
      // To gain a more authentic glow experience we would like to have a wider spread
      // In the start of the t value and also a higher particle density there for balance
      // We also want to manage the particle size and velocity to start gaining actual light beams

      // Update:
      // We didn't gain any glow from this, it just added a sprinkled atmosphere
      // I wrote a shader for the glow effect instead

      // Update 18/12, not fully satisfied with init pos but think I have to settle
      // for time efficiency

      // Update:
      // Camera angle is king

      positions[index] = radius * dirX + offsetX * 2 * (Math.random() -0.5) * 100 + 1;   // x
      positions[index + 1] = (Math.random() - 0.5) * 2; // y
      positions[index + 2] = radius * dirZ + offsetZ * 2 * (Math.random() -0.5) * 100 + 1;   // z

      // Set velocities
      const velocityScale = 80;
      velocities[index] = noiseX * velocityScale * Math.random();   // vx
      velocities[index + 1] = 100 * (Math.random());                 // vy
      velocities[index + 2] = noiseZ * velocityScale * Math.random();   // vz

      index += 3;
    }
  }

  // UPDATE PARTICLE POSITIONS ON FRAME

  useFrame(() => {
    const timeStep = 0.0005; // Adjust time step for smooth movement

    // Between these we will allow additional offset boosts for X and Z
    // NOTE: Since we already work with coordinates that apply spherical/circular outwards
    // Having an extra circular bound is very redundant. It's enough to do a standard lerp over the radius
    // NOTE2: As is now the useFrame will use a static value for the radius after the initiliazation
    // so we will want to have either a useState or update it properly on the frames.
    // The particle initilization becomes less and less useful lol.

    // const smallBound = 0.5
    // const largeBound = 0.2
    // const currentBound = smallBound + radius * (largeBound - smallBound);

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += velocities[i * 3] * timeStep;     // X
      positions[i * 3 + 1] += velocities[i * 3 + 1] * timeStep; // Y
      positions[i * 3 + 2] += velocities[i * 3 + 2] * timeStep; // Z

      // Reset if particle exceeds outer radius
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const distance = Math.sqrt(x * x + y * y + z * z);

      if (distance > outerRadius * 2.2) {   // Change the value of outer radius for
        // a delayed reset effect to affect flow -> pulse
        const angle = Math.atan2(z, x);
        const dirX = Math.cos((angle) + (Math.random() * 1.5));  // This is gooche - We can settle by this for now
        const dirZ = Math.sin((angle) + (Math.random() * 1.5));

        positions[i * 3] = innerRadius * 20 * dirX * (Math.random() - 0.5);
        positions[i * 3 + 1] = (Math.random() - 0.5);
        positions[i * 3 + 2] = innerRadius * 20 * dirZ * (Math.random() - 0.5);
      }
    }

    // Notify the buffer geometry of the position updates
    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

  });

  // Alright, we have our wanted rotation. Now we just have to add a slight position
  // fronting to the Spring to go better with our scene

  return (
    <animated.group position={beamSpring.position} rotation={beamSpring.rotation}>
    <points ref={particlesRef}>
      <bufferGeometry>
        {/* As far as I understand it bufferGeometry already instances a matrix on what to render
          * on the buffer (bufferAttributes) to avoid unnecessary GPU calls. So making an extra instancing may just
          * be redundant */}
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
        size={0.026} // Size of each particle
        color={new THREE.Color(0xf24467)}  // Blend different colors for fancy light 0xff7aa7
        // or crank up the bloom more (god) to gain proper lighting when not using white color?
        roughness={0}
        transparent={false} // Set transparency true or false, go with false so far
      />
    </points>
    </animated.group>
  );
};

export default ParticleBeams;