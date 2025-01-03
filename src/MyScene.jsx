import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const MyScene = ({ children }) => {
  const { scene } = useThree();

  // Optional: Add custom scene settings
  useEffect(() => {
    scene.background = new THREE.Color(0x000000); // Set scene background color
    // Add more scene-specific setup here
  }, [scene]);

  return <>{children}</>;
};

export default MyScene;