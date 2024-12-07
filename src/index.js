import React from 'react';
import ReactDOM from 'react-dom/client';
import BookPage from './BookPage';
import {Canvas} from "@react-three/fiber";
import { Text } from '@react-three/drei';
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Canvas
      camera={{ position: [0, 0, 1], fov: 65 }}
    >
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <BookPage position={[0, 0, 0]} />
      <BookPage position={[0.1, 0, 0.1]} />
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Hello Mom!!
      </Text>
    </Canvas>,
  </React.StrictMode>
);
