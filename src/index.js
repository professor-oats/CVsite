import React from 'react';
import ReactDOM from 'react-dom/client';
import Book from './Book';
import {Canvas} from "@react-three/fiber";
import { Text } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Canvas
      camera={{
        position: [0, 0, 3], // Camera position along the z-axis
        fov: 55,              // Field of view, adjust for better perspective
        near: 0.1,            // Near clipping plane
        far: 1000,            // Far clipping plane
        up: [0, 1, 0],          // Keep the camera upright
      }}
      //style={{ height: '100vh' }}  // Ensure the canvas fills the entire screen
    >
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <OrbitControls/>
      <Book/>
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.2}
        color="orange"
        anchorX="center"
        anchorY="middle"
      >
        Hello Mom!!
      </Text>
    </Canvas>,
  </React.StrictMode>
);
