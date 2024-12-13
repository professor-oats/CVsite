/* Let us make our own Bloom context
 * For this project we will use bloom to enhance our animations
 * for the lighting effects
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as THREE from 'three';

const BloomContext = createContext();

export const useBloom = () => {
  return useContext(BloomContext);
};

export const BloomProvider = ({ children, intensity = 1.5, radius = 0.4, threshold = 0.85 }) => {
  const { scene, camera, gl } = useThree();
  const [bloomEffect, setBloomEffect] = useState(null);

  useEffect(() => {
    if (!scene || !camera || !gl) return;

    // Create bloom pass only when the provider is used
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      intensity,
      radius,
      threshold
    );

    setBloomEffect(bloomPass);
  }, [scene, camera, gl, intensity, radius, threshold]);

  return (
    <BloomContext.Provider value={bloomEffect}>
      {children}
    </BloomContext.Provider>
  );
};