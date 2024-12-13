import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three'; // Will be used futher on
import MultiplePages from "./PagesMultiple";
import ArcSpine from "./ArcSpine";
import { useTextures } from './TextureContext';
import GlowingAura from './GlowingAura';

const Book = () => {
  const bookRef = useRef(); // Reference for the entire book
  const frontCoverGroupRef = useRef(); // Reference for the front cover
  const frontCoverRef = useRef();
  const backCoverGroupRef = useRef();
  const backCoverRef = useRef();
  const centerRef = useRef();
  const spineRef = useRef();
  const textures = useTextures();

  const bookSpring = useSpring({
    rotation: [-Math.PI / 16, Math.PI / 8, Math.PI / 32], // Rotation: x (tilt), y (45°), z
    config: { duration: 0 }, // Static, no animation
  });

  // Spring for adding emmisiveness/glow to mesh
  const emissiveSpring = useSpring({
    emissiveIntensity: 1.0, // Target emissive intensity
    from: { emissiveIntensity: 0 }, // Starting emissive intensity
    config: { duration: 1000 },
    loop: { reverse: true },
  });

  const [opened, setOpened] = useState(false);  // Will use this when opening book

  const startingPositionY = useRef(0); // Use a ref to store the initial Y position
  const movingUp = useRef(true); // Track the movement direction


  // useFrame here for render custom defined springanim properties

  useFrame(() => {

    // Rotate the entire book around the Y-axis + X-axis
    if (bookRef.current && startingPositionY.current === 0) {
      startingPositionY.current = bookRef.current.position.y; // Set initial Y position
    }

    /* Lerp this? */
    if (bookRef.current) {
      if (movingUp.current) {
        bookRef.current.position.y += 0.0008;
        if (bookRef.current.position.y >= startingPositionY.current + 0.05) {
          movingUp.current = false; // Change direction to move down
        }
      } else {
        bookRef.current.position.y -= 0.0008;
        if (bookRef.current.position.y <= startingPositionY.current - 0.01) {
          movingUp.current = true; // Change direction to move up
        }
      }
    }
    /* if (frontCoverRef.current) {
      // Simulate the front cover opening and closing
      const time = Date.now() * 0.001; // Use time to oscillate the rotation
      frontCoverRef.current.rotation.y = Math.sin(time) * Math.PI * 0.25; // Rotate ±45 degrees
    } */
  });

  /* Unless we want some fancy separate animation for pages
    * we kind of would chunk pages together with frontCoverRef,
    * as well as backCoverRef to gain a split in animations
    * and animate the front part - like opening the cover together with
    * some pages contrasting from the back page chunk */

  /* Got the front + back cover mesh groups set.
    * Question is if we would have a center space for the pages
    * that we want to target our CV render animations on and keep
    * the front a back mesh groups separated from these animation? */

  // Will we have to set a position origin for the animated group perhaps?
  // kind of abusing that the default position is [0,0,0] here
  return (
    <animated.group ref={bookRef} rotation={bookSpring.rotation}>
      {/* Adding glow to the group */}
      <GlowingAura innerRadius={2} outerRadius={4}/>

      {/* Front Cover */}
      <group ref={frontCoverGroupRef}>
        <mesh ref={frontCoverRef} position={[0, 0, 0.2]}>
          <boxGeometry args={[1.1, 1.5, 0.07]}/>
          <meshStandardMaterial
            color="#2d194d"
            normalMap={textures.normalLeather}
            diffuseMap={textures.diffuseLeather}
            roughness={0.4}
          />
        </mesh>
        <MultiplePages z_origin={0.075} z_directed={0.015}/>
      </group>

      {/* This is where the CV render will take place, like have four pages
        * to flip through with different rendered content
        * We would have to check so we can index the pages as key to
        * call specific animation on */}

      <group ref={centerRef}>
        <MultiplePages amount={4} z_origin={0.06} z_directed={-0.015}/>
      </group>

      {/* Back Cover */}
      <group ref={backCoverGroupRef}>
        <mesh ref={backCoverRef} position={[0, 0, -0.1]}>
          <boxGeometry args={[1.1, 1.5, 0.07]}/>
          <meshStandardMaterial
            color="#2d194d"
            normalMap={textures.normalLeather}
            diffuseMap={textures.diffuseLeather}
            roughness={0.4}
          />
          <MultiplePages z_origin={0.115} z_directed={-0.015}/>
        </mesh>
      </group>

        {/* spine */}
      <mesh position={[-0.503, -0.75, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <ArcSpine/>
      </mesh>


      {/* Page mesh */}
      {/*<mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.5, 0.007]} />
        <meshStandardMaterial color="beige" />
      </mesh> */}
    </animated.group>
  );
};

export default Book;