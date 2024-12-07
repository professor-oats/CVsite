import { useRef } from 'react';
import { animated, useSpring } from '@react-spring/three';

const BookPage = ({ position }) => {
  const ref = useRef();
  const { rotation } = useSpring({
    from: { rotation: [0, 0, 0] },
    to: { rotation: [0, Math.PI / 4, 0] },
    config: { duration: 1000 },
  });

  return (
    <animated.mesh ref={ref} position={position} rotation={rotation} scale={[1, 1, 1]}>
      <planeGeometry args={[1, 1.5]} />
      <meshStandardMaterial color="white" />
    </animated.mesh>
  );
};

export default BookPage;