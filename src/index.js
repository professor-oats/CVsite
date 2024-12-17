import React from 'react';
import ReactDOM from 'react-dom/client';
import Book from './Book';
import GlowingAura from './GlowingAura';
import ParticleBeams from './ParticleBeams';
import { Canvas, useThree } from "@react-three/fiber";
import { Text } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import './styles.css'
import { TextureProvider } from "./TextureContext";
import { BloomProvider } from './BloomContext';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { animated, useSpring } from "@react-spring/three";

/* Note:
 * Adding bloom effect as a post render to certain elements is a very hacky way
 * to gain a more intense emission ... One other approach could be to clump more particles
 * together to get a higher intensity thanks to density, I tested the emissiveness on
 * a standardMesh and I was kind of displeased how lame the effect was even when screwing down the
 * lighting
 */

const MainApp = () => {


  /* Having a general rotationSpring applied on animated.group in index.js gives less imports necessary
   * in the jsx files
   * !!! Thinking of it a second time it may end up in multiple rotation renders so I'd rather use
   * imports in each JSX file that need them ...
   */
  const rotationSpring = useSpring({
    rotation: [-Math.PI / 16, Math.PI / 8, Math.PI / 32], // Rotation: x (tilt), y (45°), z
    config: { duration: 0 }, // Static, no animation
  });

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
        <ambientLight intensity={0}/>
        <pointLight position={[1, 1, 2]} angle={0.25} penumbra={1} decay={0} intensity={Math.PI}/>
        <pointLight position={[-5, -5, -5]} decay={0} intensity={3}/>
        <pointLight position={[-5, -5, 0]} angle={0.25} penumbra={1} decay={0} intensity={2}/>

        {/* 3D Components */}
        <OrbitControls/>
        {/* Wanted to test out to have BloomProvider context to only allow bloom render of elements
        * inside this, however I opt for the solution to only have one render and EffectComposer adds
        * bloom to whole scene when used in one render. We got a good scene when turning off the
        * ambientLight */}
        <BloomProvider>
          <EffectComposer>
            <Bloom
              intensity={4.0}  // Adjust intensity of the bloom effect - - - MAX it baby
              width={500}  // Resolution width for bloom
              height={500} // Resolution height for bloom
              kernelSize={2} // Bloom size, adjust as needed
            />
          </EffectComposer>
        </BloomProvider>
        <ParticleBeams innerRadius={0.9} outerRadius={2}/>
        <Book/>
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
