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
import {useState, useEffect, useRef} from "react";
import { useFrame } from '@react-three/fiber';

/* Note:
 * Adding bloom effect as a post render to certain elements is a very hacky way
 * to gain a more intense emission ... One other approach could be to clump more particles
 * together to get a higher intensity thanks to density, I tested the emissiveness on
 * a standardMesh and I was kind of displeased how lame the effect was even when screwing down the
 * lighting
 */

const MainApp = () => {

  const [showParticles, setShowParticles] = useState(true);
  const [haveBloom, setHaveBloom] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

  // Access the bookRef from our Book.jsx
  const [frontCoverRef, setFrontCoverRef] = useState(null);
  const [backCoverRef, setBackCoverRef] = useState(null);

  const cameraRef = useRef();

  // See if these current calls will be performant enough
  useEffect(() => {
    if (cameraRef.current) {
      // Set camera properties
      cameraRef.current.fov = 55; // Field of view
      cameraRef.current.near = 0.1; // Near clipping plane
      cameraRef.current.far = 1000; // Far clipping plane
      cameraRef.current.position.set(0, 0, 10); // Initial position
      cameraRef.current.up.set(0, 1, 0); // Camera up vector
      cameraRef.current.updateProjectionMatrix(); // Apply changes
    }
  }, []);

  const handleBookOpened = () => {
    console.log('Book is opened')
    setShowParticles(false);
    setHaveBloom(false);  /* Turning this off really affects the color perceived.
    * We may have to adjust the color of the pages or tinker with the light.
    * Since light is part of index.js that can be the most simple upfront thing to do.
    */
    setIsOpened(true);
  }

  // Have to wrap useSpring() and useFrame() into a component since
  // they can only be hooked in <Canvas>

  // gsap is generally good at this but if we can go without
  // extra depend it can be coolios

  // Guess it's time to do what we should have in the beginning:
  // Defining the THREE js objects scene and camera as their own
  // separate components, things are getting bolognese here.

  // For unkown reason we hit more GPU/CPU load once we made them
  // into separate components. Gotta fiddle with that why.
  // Is it because the default Canvas camera is combating when
  // MyCamera checks for current.updates against it?

  // Checking on the options to render things outside of React and do useEffect()
  // do add things and it's really not what we would like. I want to have a good performance usage so
  // I will see what we can do:
  // Going back to using the Canvas camera to limit the current calls

  // Fun thing:
  // I realise the performance hit thanks to listening to the fans of the
  // older hardware I currently use. Can be good practice to further on
  // check this with software when I have upgraded.

  return (
    <div>
      {/* Start out with buttons */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "200px",
          zIndex: 1, // Ensure it's above the canvas
        }}
      >
        <button className={'plebButton'}
          onClick={() => setHaveBloom((prev) => !prev)}
          style={{
            backgroundColor: haveBloom ? "#ff4d4d" : "#4caf50",
          }}
        >
          {haveBloom ? "Disable Bloom" : "Enable Bloom"}
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1, // Ensure it's above the canvas
        }}
      >
        <button className={'plebButton'}
          onClick={() => setShowParticles((prev) => !prev)}
          style={{
            backgroundColor: showParticles ? "#ff4d4d" : "#4caf50",
          }}
        >
          {showParticles ? "Disable Particles" : "Enable Particles"}
        </button>
      </div>

      <TextureProvider>
        <Canvas
          style={{
            position: "absolute", // Ensure Canvas fills the container
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          camera={{ position: [0, 0, 10], fov: 55 }}
          onCreated={({ camera }) => {
            cameraRef.current = camera; // Assign Canvas camera to ref
          }}
        >
            {/* Lighting */}
            <ambientLight intensity={0}/>
            <pointLight position={[0.4, 0.5, 2]} angle={0.25} penumbra={1} decay={0} intensity={Math.PI - 1}/>
            <pointLight position={[-5, -5, -5]} decay={0} intensity={3}/>
            <pointLight position={[-4, -2, 1]} angle={0.25} penumbra={1} decay={0} intensity={2}/>

            {/* Wanted to test out to have BloomProvider context to only allow bloom render of elements
              * inside this, however, since that would take double post-renders,
              * I opt for the solution to only have one render and EffectComposer adds
              * bloom to whole scene.
              */}

            {/* Ditch the Bloom as soon as we have the book open */}
            {/* Bloom seem to be a real resource hogger, we also add button to turn it off */}
            {haveBloom && <BloomProvider>
              <EffectComposer>
                <Bloom
                  intensity={4.0}  // Adjust intensity of the bloom effect - - - MAX it baby
                  width={500}  // Resolution width for bloom
                  height={500} // Resolution height for bloom
                  kernelSize={2} // Bloom size, adjust as needed
                />
              </EffectComposer>
            </BloomProvider>}
            {showParticles && <ParticleBeams innerRadius={0.8} outerRadius={1.8}/>}
            <Book
              setFrontCoverRef={setFrontCoverRef}
              setBackCoverRef={setBackCoverRef}
              onBookOpened={handleBookOpened}
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
 *
 * Addition: This is most/only noticeable when Bloom is activated
 * */

root.render(
  <React.StrictMode>
    <MainApp/>
  </React.StrictMode>
);
