import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const Book = () => {
  const groupRef = useRef(); // Reference for the entire book
  const frontCoverRef = useRef(); // Reference for the front cover

  const startingPositionY = useRef(0); // Use a ref to store the initial Y position
  const movingUp = useRef(true); // Track the movement direction

  // Rotate the entire book around the Y-axis
  useFrame(() => {

    if (groupRef.current && startingPositionY.current === 0) {
      startingPositionY.current = groupRef.current.position.y; // Set initial Y position
    }

    if (groupRef.current) {
      if (movingUp.current) {
        groupRef.current.position.y += 0.0008;
        if (groupRef.current.position.y >= startingPositionY.current + 0.05) {
          movingUp.current = false; // Change direction to move down
        }
      } else {
        groupRef.current.position.y -= 0.0008;
        if (groupRef.current.position.y <= startingPositionY.current - 0.01) {
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

  return (
    <group ref={groupRef}>
      {/* Front Cover */}
      <mesh ref={frontCoverRef} position={[0, 0, 0.1]}>
        <boxGeometry args={[1.1, 1.5, 0.05]} />
        <meshStandardMaterial color="#2d194d" />
      </mesh>

      {/* Back Cover */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[1.1, 1.5, 0.05]} />
        <meshStandardMaterial color="#2d194d" />
      </mesh>

      {/* Pages */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.5, 0.02]} />
        <meshStandardMaterial color="beige" />
      </mesh>
    </group>
  );
};

export default Book;