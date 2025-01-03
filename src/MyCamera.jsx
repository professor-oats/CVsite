import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MyCamera = ({ position = [0, 0, 9], lookAt = [0, 0, 0] }) => {
  const cameraRef = useRef();
  const { set } = useThree();

  useEffect(() => {
    if (cameraRef.current) {
      const camera = cameraRef.current;

      // Set camera properties
      camera.position.set(...position);
      camera.lookAt(new THREE.Vector3(...lookAt));
      camera.updateProjectionMatrix();

      // Update the default camera in the scene
      set({ camera });
    }
  }, [position, lookAt, set]);

  useEffect(() => {
    const handleResize = () => {
      const aspectratio = window.innerWidth / window.innerHeight;
      cameraRef.current.aspect = aspectratio;
      cameraRef.current.updateProjectionMatrix();
    };

    // Initial aspect ratio setup
    handleResize();

    // Update on window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Return the camera as part of the scene graph
  return <perspectiveCamera ref={cameraRef} fov={55} near={0.1} far={1000} />;
};

export default MyCamera;