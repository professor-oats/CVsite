import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three'; // Will be used futher on
import MultiplePages from "./PagesMultiple";

const Book = () => {
  const bookRef = useRef(); // Reference for the entire book
  const frontCoverRef = useRef(); // Reference for the front cover

  const startingPositionY = useRef(0); // Use a ref to store the initial Y position
  const movingUp = useRef(true); // Track the movement direction

  // Rotate the entire book around the Y-axis
  useFrame(() => {

    if (bookRef.current && startingPositionY.current === 0) {
      startingPositionY.current = bookRef.current.position.y; // Set initial Y position
    }

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

  {/* Unless we want some fancy separate animation for pages
    * we kind of would chunk pages together with frontCoverRef,
    * as well as backCoverRef to gain a split in animations
    * and animate the front part - like opening the cover together with
    * some pages contrasting from the back page chunk */}

  return (
    <group ref={bookRef}>
      {/* Front Cover */}
      <group ref={frontCoverRef}>
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[1.1, 1.5, 0.07]}/>
          <meshStandardMaterial color="#2d194d"/>
        </mesh>
        <MultiplePages/>
      </group>

      {/* Back Cover */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[1.1, 1.5, 0.05]}/>
        <meshStandardMaterial color="#2d194d" />
      </mesh>

      {/* Page mesh */}
      {/*<mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.5, 0.007]} />
        <meshStandardMaterial color="beige" />
      </mesh> */}
    </group>
  );
};

export default Book;