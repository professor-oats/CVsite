import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three'; // Will be used futher on
import MultiplePages from "./PagesMultiple";
import ArcSpine from "./ArcSpine";
import { useTextures } from './TextureContext';
import OutlineEffect from "./OutlineEffect";
import {Text, Image} from '@react-three/drei';
import winside from './assets/fonts/winsideuz.regular.ttf';

// Any good book has references you know ...
const Book = ({setFrontCoverRef, setBackCoverRef, onBookOpen, onBookOpened}) => {
  const bookRef = useRef();
  const frontCoverGroupRef = useRef();
  const frontCoverRef = useRef();
  const backCoverGroupRef = useRef();
  const backCoverRef = useRef();
  const centerRef = useRef();
  const spineRef = useRef();
  const profileImageRef = useRef();
  const callbackOpenTriggered = useRef(false);
  const callbackOpenedTriggered = useRef(false);
  const textures = useTextures();

  const [isBookHovered, setIsBookHovered] = useState(false);

  // Define the hover scale multiplier passed to the custom glow shader
  const hoverBookScaleMultiplier = isBookHovered ? 1.4 : 1.2; // Adjust as seeing fit

  // State for book opening
  const [isOpened, setIsOpened] = useState(false);
  //const [isOpenedOpened, setIsOpenedOpened] = useState(false);
  const [shouldRenderMiddlePages, setShouldRenderMiddlePages] = useState(true);

  const [spineColor, setSpineColor] = useState('black'); // Initial color
  const [spineOffsetZ, setSpineOffsetZ] = useState(0);
  const [spineOffsetX, setSpineOffsetX] = useState(0);


  const handleBookClick = () => {
    setShouldRenderMiddlePages(false);
    setIsOpened(true); // Toggle the book open state
    if (isOpened && onBookOpen && !callbackOpenTriggered.current) {
      callbackOpenTriggered.current = true;
      onBookOpen(); // Notify parent when book is clicked/about to open
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpineColor(isOpened ? 'beige' : 'black'); // Change color after delay
      setSpineOffsetZ(isOpened ? 0.13 : 0);  // Set offsetZ after delay
      setSpineOffsetX(isOpened ? 0.07 : 0);
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
  // This anim right now works as helper values for the camera anim ...
  // Thankfully project will be done before complete lasagna
  // MMMMM LASAGNA, gotta love the realtime update on this one
  const bookSpring = useSpring({
    rotation: isOpened ? [-Math.PI / 16 - 0.2, Math.PI / 8, Math.PI / 32 + 0.078] : [-Math.PI / 16, Math.PI / 8, Math.PI / 32] ,
    config: { tension: 180, friction: 100 }, // Static, no animation
  });

  // Spring animations for book opening
  const { frontCoverRotation, backCoverRotation, spineRotation } = useSpring({
    frontCoverRotation: isOpened ? -Math.PI + 0.22 : 0, // Rotate the front cover to -Pi ish
    backCoverRotation: isOpened ? -0.062 : 0,
    spineRotation: isOpened ? -Math.PI / 2 + 0.08 : 0,
    config: (key) =>
      key === 'frontCoverRotation'
        ? { tension: 180, friction: 100 }
        : { tension: 280, friction: 60 },
    onRest: () => {
      if (isOpened && onBookOpened && !callbackOpenedTriggered.current) {
        callbackOpenedTriggered.current = true;
        setShouldRenderMiddlePages(false);
        onBookOpened(); // Notify parent when book is fully opened
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
  const movingUp = useRef(true); // Track the movement direction
  const posMaxZ = useRef(0);


  // useFrame here for render custom defined springanim properties

  useFrame(() => {

    // Inits here
    if (bookRef.current && startingPositionY.current === 0) {
      startingPositionY.current = bookRef.current.position.y;
    }

    // Using bool shouldRenderMiddlePages since it's eqvivalent to onRest opened
    if (bookRef.current && shouldRenderMiddlePages) {

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

     * Funny how we test to animate with useFrame() and also useSpring()
     * and we still go back to useFrame() ... The Spring wouldn't work,
     * alas not needed.
     */

    // After some animation bugs this just works, code is like piña colada
    // with semantic error, but hey, if it works it works
    if (backCoverRef.current && posMaxZ.current <= 0.18 && isOpened) {
      posMaxZ.current += 0.002;
      backCoverRef.current.position.z = -posMaxZ.current;
      centerRef.current.position.z = -posMaxZ.current;
      if (spineRef.current && posMaxZ.current <= 0.1) {
        spineRef.current.position.z = -posMaxZ.current;
      }
      if (frontCoverGroupRef.current && posMaxZ.current <= 0.032) {
        frontCoverGroupRef.current.position.z = -posMaxZ.current;
      }
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
    <animated.group position={[-0.18, 0, 0]}> {/* Mini adjust to align with particles better */}

      {/* Some needed notes here:
        * When fiddling with Spring animations and useFrame() animation there seem
        * to be a competition in position of their objects, thankfully they align
        * painfully well together and if we want to be a good programmer we shall
        * find the culprit of this.
        * If this was done to a proper client
        * we would have to.
      */}

      {/* Front Cover */}
      {/* We will want to make another animated.group to parent the frontCoverGroupRef
        * so we can x-pivot the rotation-y */}
      <animated.group ref={bookRef} rotation={bookSpring.rotation} onClick={handleBookClick}>
      <animated.group ref={frontCoverGroupRef}
             onPointerOver={() => setIsBookHovered(true)} // Hover start
             onPointerOut={() => setIsBookHovered(false)} // Hover end
             position={[-0.57, 0, 0]} // pivot-x
             rotation-y={frontCoverRotation}
      >
      <animated.group position={[0.57, 0, 0]}> {/* pivot over x back from parent */}
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
        <Text
              font={winside}
              rotation={[0, Math.PI, 0]} // For the ladies
              position={[0, 0.6, 0]}
              fontSize={0.1}
              color="black"
        >
          Greetings Traveler🌟🦄
        </Text>
        <Image
          ref={profileImageRef}
          url="./assets/images/DSC00060.JPG"
          rotation={[0, Math.PI, 0]}
          position={[0, 0.2, 0.01]}
          scale={[0.6, 0.6, 0.6]}
        />
      </animated.group>
      </animated.group>

        {/* Bulk of center pages, first thought to bring more animation base
          * but opted out */}
        <group ref={centerRef}>
          {shouldRenderMiddlePages && <MultiplePages amount={4} z_origin={0.06} z_directed={-0.015}/>}
        </group>

      {/* Back Cover */}
      <animated.group ref={backCoverGroupRef} rotation-y={backCoverRotation}>
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
      </animated.group>

        {/* spine */}
      <animated.mesh
        ref={spineRef}
        position={[-0.503 -spineOffsetX, -0.75, 0.05 - spineOffsetZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        rotation-z={spineRotation}
      >
        <ArcSpine spineColor={spineColor}/>
      </animated.mesh>

        {/* Outline Effects */}
        {frontCoverRef?.current && !isOpened && (
          <OutlineEffect objectRef={frontCoverRef} color="red" offsetX={0.0} offsetY={-0.014} offsetZ={-0.1} time={time} scaleMultiplier={hoverBookScaleMultiplier} />
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