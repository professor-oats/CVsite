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

/* Note:
 * Adding bloom effect as a post render to certain elements is a very hacky way
 * to gain a more intense emission ... One other approach could be to clump more particles
 * together to get a higher intensity thanks to density, I tested the emissiveness on
 * a standardMesh and I was kind of displeased how lame the effect was even when screwing down the
 * lighting
 */

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
      <ambientLight intensity={0} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      {/* 3D Components */}
      <OrbitControls />
      {/* Wanted to test out to have BloomProvider context to only allow bloom render of elements
        * inside this, however I opt for the solution to only have one render and EffectComposer adds
        * bloom to whole scene when used in one render. We got a good scene when turning off the
        * ambientLight */}
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
