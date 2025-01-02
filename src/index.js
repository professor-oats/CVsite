import React from 'react';
import ReactDOM from 'react-dom/client';
import Book from './Book';
import ParticleBeams from './ParticleBeams';
import { Canvas, useThree } from "@react-three/fiber";
import { Text } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import './styles.css'
import { TextureProvider } from "./TextureContext";
import { BloomProvider } from './BloomContext';
import { EffectComposer, Bloom, Outline } from '@react-three/postprocessing';
import { animated, useSpring } from "@react-spring/three";
import {useState, useEffect} from "react";
import * as THREE from 'three';

/* Note:
 * Adding bloom effect as a post render to certain elements is a very hacky way
 * to gain a more intense emission ... One other approach could be to clump more particles
 * together to get a higher intensity thanks to density, I tested the emissiveness on
 * a standardMesh and I was kind of displeased how lame the effect was even when screwing down the
 * lighting
 */

const MainApp = () => {

  const [showParticles, setShowParticles] = useState(true);

  /* Having a general rotationSpring applied on animated.group in index.js gives less imports necessary
   * in the jsx files
   * !!! Thinking of it a second time it may end up in multiple rotation renders so I'd rather use
   * imports in each JSX file that need them ...
   */
  const rotationSpring = useSpring({
    rotation: [-Math.PI / 16, Math.PI / 8, Math.PI / 32], // Rotation: x (tilt), y (45°), z
    config: { duration: 0 }, // Static, no animation
  });

  // Access the bookRef from our Book.jsx
  const [frontCoverRef, setFrontCoverRef] = useState(null);
  const [backCoverRef, setBackCoverRef] = useState(null);

  const handleBookOpen = () => {
    console.log('Book is open')
  }

  return (
  <div>
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 1, // Ensure it's above the canvas
      }}
    >
      <button
        onClick={() => setShowParticles((prev) => !prev)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          backgroundColor: showParticles ? "#ff4d4d" : "#4caf50",
          color: "white",
          cursor: "pointer",
        }}
      >
        {showParticles ? "Disable Particles" : "Enable Particles"}
      </button>
    </div>

  <TextureProvider>
    <Canvas
      camera={{
        position: [0, 0, 8],  // Camera position
        fov: 55,               // Field of view
        near: 0.1,             // Near clipping plane
        far: 1000,             // Far clipping plane
        up: [0, 1, 0],         // Camera up vector
      }}
      style={{
        position: "absolute", // Ensure Canvas fills the container
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0}/>
      <pointLight position={[0.4, 0.5, 2]} angle={0.25} penumbra={1} decay={0} intensity={Math.PI - 1}/>
      <pointLight position={[-5, -5, -5]} decay={0} intensity={3}/>
      <pointLight position={[-4, -2, 1]} angle={0.25} penumbra={1} decay={0} intensity={2}/>

        {/* 3D Components */}
        <OrbitControls/>
        {/* Wanted to test out to have BloomProvider context to only allow bloom render of elements
        * inside this, however I opt for the solution to only have one render and EffectComposer adds
        * bloom to whole scene when used in one render. We got a good scene when turning off the
        * ambientLight */}

        {/* Ditch the Bloom as soon as we have the book open perhaps */}
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
      {showParticles && <ParticleBeams innerRadius={0.8} outerRadius={1.8}/>}
        <Book
          setFrontCoverRef={setFrontCoverRef}
          setBackCoverRef={setBackCoverRef}
          onBookOpen={handleBookOpen}
        />
      </Canvas>
    </TextureProvider>
  </div>
  );
};


const root = ReactDOM.createRoot(document.getElementById('root'));

/* Alright ... now I realised that React.StrictMode
 * affects the Render time and frames a lot due to its nature
 * so now we will have to go through the animations once again
 * when we are finished with the strict mode
 */

root.render(
  <React.StrictMode>
      <MainApp />
  </React.StrictMode>
);
