// Texture Context Loader for global use baby

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TextureLoader } from 'three';

const TextureContext = createContext();

export const useTextures = () => useContext(TextureContext);

export const TextureProvider = ({ children }) => {
  const [textures, setTextures] = useState({});

  useEffect(() => {
    const loader = new TextureLoader();
    const normalLeather = loader.load('./materials/leather/PNG/fabric_leather_02_nor_gl_1k.png');
    const roughnessLeather = loader.load('./materials/leather/PNG/fabric_leather_02_rough_1k.png');
    const diffuseLeather = loader.load('./materials/leather/PNG/fabric_leather_02_diff_1k.png');
    // Skipping displacement map. Sure it brings details but
    // since it only renders noticeable details when the scale is too high for
    // the object to remain intact and not being displaced, we skip.
    //const displacementLeather = loader.load('./materials/leather/PNG/fabric_leather_02_disp_1k.png')

    setTextures({ normalLeather, roughnessLeather, diffuseLeather });
  }, []);

  return (
    <TextureContext.Provider value={textures}>
      {children}
    </TextureContext.Provider>
  );
};