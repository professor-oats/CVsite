import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three'; // Will be used futher on
import MultiplePages from "./PagesMultiple";
import ArcSpine from "./ArcSpine";
import { useTextures } from './TextureContext';
import OutlineEffect from "./OutlineEffect";

const Book = ({setFrontCoverRef, setBackCoverRef, onBookOpen}) => {
  const bookRef = useRef(); // Reference for the entire book
  const frontCoverGroupRef = useRef(); // Reference for the front cover
  const frontCoverRef = useRef();
  const backCoverGroupRef = useRef();
  const backCoverRef = useRef();
  const centerRef = useRef();
  const spineRef = useRef();
  const textures = useTextures();

  const [isBookHovered, setIsBookHovered] = useState(false);

  // Define the hover scale multiplier
  const hoverBookScaleMultiplier = isBookHovered ? 1.4 : 1.2; // Adjust as seeing fit

  // State for book opening
  const [isOpened, setIsOpened] = useState(false);
  const [shouldRenderMiddlePages, setShouldRenderMiddlePages] = useState(true); // Lol

  const [spineColor, setSpineColor] = useState('black'); // Initial color
  const [spineOffsetZ, setSpineOffsetZ] = useState(0);
  const [backCoverOffsetZ, setBackCoverOffsetZ] = useState(0);

  const handleBookClick = () => {
    setShouldRenderMiddlePages(false);
    setIsOpened(true); // Toggle the book open state
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpineColor(isOpened ? 'beige' : 'black'); // Change color after delay
      setSpineOffsetZ(isOpened ? 0.13 : 0);  // Set offsetZ after delay
      //setBackCoverOffsetZ(isOpened ? 0.1 : 0);
    }, 300); // Delay in milliseconds (1 second in this case)

    // Cleanup timer on component unmount or when `isOpened` changes
    return () => clearTimeout(timer);
  }, [isOpened]);

  //console.log(isOpened);

  // Need to useEffect to pass refs to parent/index.js
  React.useEffect(() => {
    if (setFrontCoverRef) setFrontCoverRef(frontCoverRef);
    if (setBackCoverRef) setBackCoverRef(backCoverRef);
  }, [setFrontCoverRef, setBackCoverRef]);

  // Sleezy way of setting a static rotation but tested to have a Spring going
  // if we wanted to make some more animation.
  const bookSpring = useSpring({
    rotation: [-Math.PI / 16, Math.PI / 8, Math.PI / 32],
    config: { duration: 0 }, // Static, no animation
  });

  // Spring animations for book opening
  const { frontCoverRotation } = useSpring({
    frontCoverRotation: isOpened ? -Math.PI : 0, // Rotate the front cover to -180°
    config: { tension: 180, friction: 100 },
    onRest: () => {
      if (isOpened && onBookOpen) {
        onBookOpen(); // Notify parent when book is fully opened
        // Acts as a callback to parent so we can use this conditionally
      }
    },
  });


  // Time counter to use for animations
  const [time, setTime] = React.useState(0);

  useEffect(() => {
    const animate = () => {
      setTime((prev) => prev + 0.1);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const startingPositionY = useRef(0); // Use a ref to store the initial Y position
  const startingPositionZ = useRef(0); // This is for the backCoverZ
  const movingUp = useRef(true); // Track the movement direction
  const posMaxZ = useRef(0);


  // useFrame here for render custom defined springanim properties

  useFrame(() => {

    // Inits here
    if (bookRef.current && startingPositionY.current === 0) {
      startingPositionY.current = bookRef.current.position.y;
    }

    if (backCoverRef.current && startingPositionZ.current === 0) {
      startingPositionZ.current = backCoverRef.current.position.z;
    }

    if (bookRef.current) {

      if (movingUp.current) {
        bookRef.current.position.y += 0.0016;
        if (bookRef.current.position.y >= startingPositionY.current + 0.08) {
          movingUp.current = false; // Change direction to move down
        }
      } else {
        bookRef.current.position.y -= 0.0016;
        if (bookRef.current.position.y <= startingPositionY.current - 0.01) {
          movingUp.current = true; // Change direction to move up
        }
      }
    }

    /* Good to know:
     * useRef() is a hook in React that creates a mutable reference object.
     * Unlike state (which triggers re-renders when changed),
     * useRef() provides a way to persist values across renders
     * without causing the component to re-render when the value changes.
     */

    /* Also good to know:
     * In JavaScript, const does not make an object or array immutable.
     * Instead, const guarantees that the reference to the object (or array) cannot be reassigned.
     * This means that the variable itself cannot point to a different object,
     * but the contents of the object (or array) can still change.

     * When we check the const ref posMaxZ we check the objects current value
     * that it is holding
     */

    if (backCoverRef.current && posMaxZ.current <= 0.2 && isOpened) {
      console.log("Here MF");
      posMaxZ.current += 0.002;
      backCoverRef.current.position.z = -posMaxZ.current;
    }
  });

  /* Unless we want some fancy separate animation for pages
    * we kind of would chunk pages together with frontCoverRef,
    * as well as backCoverRef to gain a split in animations
    * and animate the front part - like opening the cover together with
    * some pages contrasting from the back page chunk */

  /* Got the front + back cover mesh groups set.
    * Question is if we would have a center space for the pages
    * that we want to target our CV render animations on and keep
    * the front a back mesh groups separated from these animation? */

  // Will we have to set a position origin for the animated group perhaps?
  // kind of abusing that the default position is [0,0,0] here
  return (
    <animated.group>

      {/* Front Cover */}
      {/* We will want to make another animated.group to parent the frontCoverGroupRef
        * so we can x-pivot the rotation-y */}
      <animated.group ref={bookRef} rotation={bookSpring.rotation} onClick={handleBookClick}>
      <animated.group ref={frontCoverGroupRef}
             onPointerOver={() => setIsBookHovered(true)} // Hover start
             onPointerOut={() => setIsBookHovered(false)} // Hover end
             position={[-0.6, 0, 0]} // pivot-x
             rotation-y={frontCoverRotation}
      >
      <animated.group position={[0.6, 0, 0]}> {/* pivot over x back from parent */}
        <mesh ref={frontCoverRef} position={[0, 0, 0.2]}>
          <boxGeometry args={[1.1, 1.5, 0.07]}/>
          <meshStandardMaterial
            color="black"  // #2d194d
            normalMap={textures.normalLeather}
            diffuseMap={textures.diffuseLeather}
            roughness={0.4}
          />
        </mesh>
        <MultiplePages z_origin={0.075} z_directed={0.015}/>
      </animated.group>
      </animated.group>

      {/* This is where the CV render will take place, like have four pages
        * to flip through with different rendered content
        * We would have to check so we can index the pages as key to
        * call specific animation on */}
        <group ref={centerRef}>
            <MultiplePages amount={4} z_origin={0.06} z_directed={-0.015}/>
        </group>

      {/* Back Cover */}
      <group ref={backCoverGroupRef}>
        <mesh ref={backCoverRef} position={[0, 0, -0.1]}>
          <boxGeometry args={[1.1, 1.5, 0.07]}/>
          <meshStandardMaterial
            color="black"
            normalMap={textures.normalLeather}
            diffuseMap={textures.diffuseLeather}
            roughness={0.4}
          />
          <MultiplePages z_origin={0.115} z_directed={-0.015}/>
        </mesh>
      </group>

        {/* spine */}
      <mesh position={[-0.503, -0.75, 0.05 - spineOffsetZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <ArcSpine spineColor={spineColor}/>
      </mesh>

        {/* Outline Effects */}
        {frontCoverRef?.current && !isOpened && (
          <OutlineEffect objectRef={frontCoverRef} color="red" time={time} scaleMultiplier={hoverBookScaleMultiplier} />
        )}

      </animated.group>


      {/* Page mesh */}
      {/*<mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.5, 0.007]} />
        <meshStandardMaterial color="beige" />
      </mesh> */}
    </animated.group>
  );
};

export default Book;