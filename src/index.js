import React from 'react';
import ReactDOM from 'react-dom/client';
import Book from './Book';
import GlowingAura from './GlowingAura';
import {Canvas, useThree} from "@react-three/fiber";
import { Text } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import './styles.css'
import {TextureProvider} from "./TextureContext";
import { BloomProvider } from './BloomContext';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const MainApp = () => {
  return (
    <TextureProvider>
    <Canvas
      camera={{
        position: [0, 0, 4],  // Camera position
        fov: 55,               // Field of view
        near: 0.1,             // Near clipping plane
        far: 1000,             // Far clipping plane
        up: [0, 1, 0],         // Camera up vector
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      {/* 3D Components */}
      <OrbitControls />
      <BloomProvider>
        <EffectComposer>
          <Bloom
            intensity={2.0}  // Adjust intensity of the bloom effect
            width={300}  // Resolution width for bloom
            height={300} // Resolution height for bloom
            kernelSize={3} // Bloom size, adjust as needed
          />
        </EffectComposer>
        <GlowingAura innerRadius={2} outerRadius={4}/>
      </BloomProvider>
      <Book/>
      <Text
        position={[0, 0, 0.3]}
        fontSize={0.2}
        color="orange"
        anchorX="center"
        anchorY="middle"
      >
        Hello Mom!!
      </Text>
    </Canvas>
    </TextureProvider>
  );
};


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <MainApp />
  </React.StrictMode>
);
